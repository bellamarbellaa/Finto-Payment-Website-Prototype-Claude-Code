import { FintoApiError, type PaymentRequest } from '../types';
import type { DemoStore, StoredTransaction } from '../store';
import { money, parseAmountMinor } from '../money';
import { transactionDisplay } from '../format';

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createPaymentsApi(store: DemoStore) {
  function requireAccount(accountId?: string) {
    const state = store.get();
    const account = accountId
      ? state.accounts.find((a) => a.id === accountId)
      : (state.accounts.find((a) => a.isPrimary) ?? state.accounts[0]);
    if (!account) throw new FintoApiError(404, 'not_found', 'Account not found.');
    return account;
  }

  return {
    async quote(input: { amount: string; fromAccountId?: string; currency?: string }) {
      const account = requireAccount(input.fromAccountId);
      const requested = parseAmountMinor(input.amount);
      const available = BigInt(account.available.amountMinor);
      const remainingAfter = available - requested;

      return {
        amount: money(requested, account.currency),
        available: account.available,
        remainingAfter: money(remainingAfter, account.currency),
        fee: money(0n, account.currency),
        sufficient: remainingAfter >= 0n,
        warning: remainingAfter < 0n ? 'This would take the account below zero.' : null
      };
    },

    async send(input: {
      amount: string;
      contactId?: string;
      handle?: string;
      fromAccountId?: string;
      currency?: string;
      note?: string;
      password?: string;
    }) {
      const account = requireAccount(input.fromAccountId);
      const amountMinor = parseAmountMinor(input.amount);

      if (amountMinor > BigInt(account.available.amountMinor)) {
        throw new FintoApiError(422, 'insufficient_funds', "You don't have enough available to send that.");
      }

      const state = store.get();
      const contact = input.contactId
        ? state.contacts.find((c) => c.id === input.contactId)
        : input.handle
          ? state.contacts.find((c) => c.handle.toLowerCase() === input.handle!.toLowerCase())
          : undefined;

      const amount = money(amountMinor, account.currency);
      const occurredAt = new Date().toISOString();
      const transaction: StoredTransaction = {
        id: newId('txn'),
        reference: newId('ref').toUpperCase(),
        type: 'transfer',
        status: 'completed',
        direction: 'out',
        counterparty: contact
          ? { name: contact.name, handle: contact.handle, initial: contact.initials[0] ?? '?', tint: contact.tint }
          : { name: input.handle ?? 'Finto transfer', handle: input.handle ?? null, initial: '?', tint: 'stone' },
        category: 'Transfer',
        note: input.note ?? null,
        failureReason: null,
        amount,
        display: transactionDisplay({ direction: 'out', status: 'completed', amount, category: 'Transfer', occurredAt }),
        cardId: null,
        accountId: account.id,
        occurredAt,
        settledAt: occurredAt
      };

      let balanceAfter = amount;
      store.mutate(
        (s) => {
          const acc = s.accounts.find((a) => a.id === account.id)!;
          const newMinor = BigInt(acc.balance.amountMinor) - amountMinor;
          acc.balance = money(newMinor, acc.currency);
          acc.available = money(newMinor, acc.currency);
          balanceAfter = acc.balance;
          s.transactions.unshift(transaction);
          const storedContact = contact && s.contacts.find((c) => c.id === contact.id);
          if (storedContact) storedContact.lastPaidAt = occurredAt;
        },
        { type: 'transaction.created', data: { transactionId: transaction.id }, at: occurredAt }
      );

      return { transaction, balanceAfter };
    },

    async createRequest(input: {
      amount: string;
      currency?: string;
      accountId?: string;
      contactId?: string;
      note?: string;
      expiresInHours?: number;
    }) {
      const account = requireAccount(input.accountId);
      const amountMinor = parseAmountMinor(input.amount);
      const linkToken = newId('req');
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (input.expiresInHours ?? 72) * 3_600_000).toISOString();

      const request: PaymentRequest = {
        id: newId('preq'),
        amount: money(amountMinor, input.currency ?? account.currency),
        note: input.note ?? null,
        status: 'pending',
        linkToken,
        shareUrl: `https://finto.app/pay/r/${linkToken}`,
        deepLink: `finto://pay/r/${linkToken}`,
        expiresAt,
        createdAt: now.toISOString()
      };

      store.mutate((s) => {
        s.paymentRequests.push(request);
      });
      return { request };
    },

    async listRequests() {
      return { requests: store.get().paymentRequests };
    },

    async cancelRequest(id: string) {
      const exists = store.get().paymentRequests.some((r) => r.id === id);
      if (!exists) throw new FintoApiError(404, 'not_found', 'Request not found.');
      store.mutate((s) => {
        s.paymentRequests.find((r) => r.id === id)!.status = 'cancelled';
      });
      return { request: store.get().paymentRequests.find((r) => r.id === id)! };
    },

    async scan(payload: string) {
      const token = payload.trim().split('/').pop() || payload.trim();
      const request = store.get().paymentRequests.find((r) => r.linkToken === token);
      if (!request) throw new FintoApiError(404, 'not_found', "That code doesn't match a Finto request.");

      const user = store.get().user;
      return {
        request: { ...request, requester: { fullName: user.fullName, handle: user.handle, tint: user.tint } }
      };
    },

    async payRequest(linkToken: string, fromAccountId?: string) {
      const request = store.get().paymentRequests.find((r) => r.linkToken === linkToken);
      if (!request) throw new FintoApiError(404, 'not_found', 'Request not found.');
      if (request.status !== 'pending') throw new FintoApiError(409, 'conflict', 'This request has already been settled.');

      const account = requireAccount(fromAccountId);
      const amountMinor = BigInt(request.amount.amountMinor);
      if (amountMinor > BigInt(account.available.amountMinor)) {
        throw new FintoApiError(422, 'insufficient_funds', "You don't have enough available to pay that.");
      }

      const occurredAt = new Date().toISOString();
      const transaction: StoredTransaction = {
        id: newId('txn'),
        reference: newId('ref').toUpperCase(),
        type: 'request_payment',
        status: 'completed',
        direction: 'out',
        counterparty: { name: 'Payment request', handle: null, initial: 'R', tint: 'forest' },
        category: 'Transfer',
        note: request.note,
        failureReason: null,
        amount: request.amount,
        display: transactionDisplay({
          direction: 'out', status: 'completed', amount: request.amount, category: 'Transfer', occurredAt
        }),
        cardId: null,
        accountId: account.id,
        occurredAt,
        settledAt: occurredAt
      };

      let balanceAfter = request.amount;
      store.mutate(
        (s) => {
          const acc = s.accounts.find((a) => a.id === account.id)!;
          const newMinor = BigInt(acc.balance.amountMinor) - amountMinor;
          acc.balance = money(newMinor, acc.currency);
          acc.available = money(newMinor, acc.currency);
          balanceAfter = acc.balance;
          s.transactions.unshift(transaction);
          s.paymentRequests.find((r) => r.linkToken === linkToken)!.status = 'paid';
        },
        { type: 'transaction.created', data: { transactionId: transaction.id }, at: occurredAt }
      );

      return { transaction, balanceAfter };
    }
  };
}
