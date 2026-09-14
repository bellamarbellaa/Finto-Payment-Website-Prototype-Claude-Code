import { FintoApiError, type Card } from '../types';
import type { DemoStore } from '../store';
import { money, parseAmountMinor } from '../money';

export function createCardsApi(store: DemoStore) {
  function requireCard(id: string): Card {
    const card = store.get().cards.find((c) => c.id === id);
    if (!card) throw new FintoApiError(404, 'not_found', 'Card not found.');
    return card;
  }

  return {
    async list() {
      return { cards: store.get().cards };
    },

    async get(id: string) {
      return { card: requireCard(id) };
    },

    async create(input: { holderName: string; kind?: 'virtual' | 'physical'; accountId?: string }) {
      const account = store.get().accounts.find((a) => a.id === input.accountId) ?? store.get().accounts[0]!;
      const last4 = String(Math.floor(1000 + Math.random() * 9000));
      const card: Card = {
        id: `card_${Date.now().toString(36)}`,
        brand: 'Finto',
        kind: input.kind ?? 'virtual',
        last4,
        maskedNumber: `•••• •••• •••• ${last4}`,
        expiry: '12/30',
        holderName: input.holderName,
        state: 'active',
        accountId: account.id,
        controls: { onlinePayments: true, paymentsAbroad: false, contactless: true, atmWithdrawals: false, monthlyLimit: null },
        spending: { thisMonth: money(0n, account.currency), limitUsedPercent: null },
        createdAt: new Date().toISOString()
      };
      store.mutate(
        (s) => {
          s.cards.push(card);
        },
        { type: 'card.updated', data: { cardId: card.id }, at: card.createdAt }
      );
      return { card };
    },

    async freeze(id: string, frozen: boolean) {
      requireCard(id);
      const at = new Date().toISOString();
      store.mutate(
        (s) => {
          s.cards.find((c) => c.id === id)!.state = frozen ? 'frozen' : 'active';
        },
        { type: 'card.updated', data: { cardId: id }, at }
      );
      return { card: requireCard(id) };
    },

    async updateControls(
      id: string,
      controls: {
        onlinePayments?: boolean;
        paymentsAbroad?: boolean;
        contactless?: boolean;
        atmWithdrawals?: boolean;
        monthlyLimit?: string | null;
      }
    ) {
      requireCard(id);
      const at = new Date().toISOString();
      const { monthlyLimit, ...rest } = controls;

      store.mutate(
        (s) => {
          const target = s.cards.find((c) => c.id === id)!;
          Object.assign(target.controls, rest);
          if (monthlyLimit !== undefined) {
            const account = s.accounts.find((a) => a.id === target.accountId);
            target.controls.monthlyLimit =
              monthlyLimit === null ? null : money(parseAmountMinor(monthlyLimit), account?.currency ?? 'USD');
          }
        },
        { type: 'card.updated', data: { cardId: id }, at }
      );
      return { card: requireCard(id) };
    },

    async reveal(id: string) {
      requireCard(id);
      return { revealToken: `demo-reveal-${id}`, processorCardId: `demo-${id}`, expiresIn: 60 };
    },

    async terminate(id: string) {
      requireCard(id);
      const at = new Date().toISOString();
      store.mutate(
        (s) => {
          s.cards.find((c) => c.id === id)!.state = 'terminated';
        },
        { type: 'card.updated', data: { cardId: id }, at }
      );
      return { card: requireCard(id) };
    }
  };
}
