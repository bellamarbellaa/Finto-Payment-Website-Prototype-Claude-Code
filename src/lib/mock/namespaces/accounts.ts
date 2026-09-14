import { FintoApiError, type Account } from '../types';
import type { DemoStore } from '../store';
import { money } from '../money';

export function createAccountsApi(store: DemoStore) {
  function total(accounts: Account[]) {
    const base = store.get().user.baseCurrency;
    const minor = accounts
      .filter((a) => a.currency === base)
      .reduce((sum, a) => sum + BigInt(a.balance.amountMinor), 0n);
    return money(minor, base);
  }

  return {
    async list() {
      const accounts = store.get().accounts;
      return { accounts, total: total(accounts), baseCurrency: store.get().user.baseCurrency };
    },

    async get(id: string) {
      const account = store.get().accounts.find((a) => a.id === id);
      if (!account) throw new FintoApiError(404, 'not_found', 'Account not found.');
      return { account };
    },

    async open(currency: string, name?: string) {
      const id = `acc_${currency.toLowerCase()}_${Date.now().toString(36)}`;
      const account: Account = {
        id,
        name: name ?? `${currency} account`,
        currency,
        symbol: currency,
        kind: 'balance',
        ibanMasked: '•••• 0000',
        isPrimary: false,
        status: 'active',
        balance: money(0n, currency),
        available: money(0n, currency),
        createdAt: new Date().toISOString()
      };
      store.mutate(
        (s) => {
          s.accounts.push(account);
        },
        { type: 'account.balance_changed', data: { accountId: id }, at: account.createdAt }
      );
      return { account };
    },

    async statement(id: string, limit = 100) {
      const account = store.get().accounts.find((a) => a.id === id);
      if (!account) throw new FintoApiError(404, 'not_found', 'Account not found.');
      const entries = store.get().transactions.filter((t) => t.accountId === id).slice(0, limit);
      return { account, entries };
    }
  };
}
