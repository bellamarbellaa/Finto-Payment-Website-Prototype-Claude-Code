import { FintoApiError, type Transaction, type TransactionGroup } from '../types';
import type { DemoStore } from '../store';
import { money } from '../money';

function groupByDay(transactions: Transaction[]): TransactionGroup[] {
  const groups = new Map<string, Transaction[]>();
  for (const item of transactions) {
    const key = item.occurredAt.slice(0, 10);
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, items]) => {
      const currency = items[0]!.amount.currency;
      const totalMinor = items.reduce(
        (sum, t) => sum + (t.direction === 'in' ? 1n : -1n) * BigInt(t.amount.amountMinor),
        0n
      );
      return {
        key,
        label: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(
          new Date(items[0]!.occurredAt)
        ),
        total: money(totalMinor, currency).formatted,
        currency,
        items
      };
    });
}

export function createTransactionsApi(store: DemoStore) {
  return {
    async list(
      params: {
        filter?: 'all' | 'income' | 'spending' | 'pending';
        q?: string;
        accountId?: string;
        cardId?: string;
        cursor?: string;
        limit?: number;
        grouped?: boolean;
      } = {}
    ) {
      let items: Transaction[] = [...store.get().transactions].sort((a, b) =>
        a.occurredAt < b.occurredAt ? 1 : -1
      );

      if (params.accountId) items = store.get().transactions.filter((t) => t.accountId === params.accountId);
      if (params.cardId) items = items.filter((t) => t.cardId === params.cardId);
      if (params.filter === 'income') items = items.filter((t) => t.direction === 'in');
      else if (params.filter === 'spending') items = items.filter((t) => t.direction === 'out');
      else if (params.filter === 'pending') items = items.filter((t) => t.status === 'pending');

      if (params.q) {
        const q = params.q.toLowerCase();
        items = items.filter(
          (t) => t.counterparty.name.toLowerCase().includes(q) || (t.note ?? '').toLowerCase().includes(q)
        );
      }

      const limited = items.slice(0, params.limit ?? 50);
      const grouped = params.grouped ?? true;

      return {
        transactions: limited,
        groups: grouped ? groupByDay(limited) : undefined,
        nextCursor: null,
        hasMore: false
      };
    },

    async get(id: string) {
      const transaction = store.get().transactions.find((t) => t.id === id);
      if (!transaction) throw new FintoApiError(404, 'not_found', 'Transaction not found.');
      return { transaction };
    },

    async summary(params: { from?: string; to?: string; currency?: string } = {}) {
      const currency = params.currency ?? store.get().user.baseCurrency;
      const items = store.get().transactions.filter((t) => t.amount.currency === currency);
      const spentMinor = items.filter((t) => t.direction === 'out').reduce((s, t) => s + BigInt(t.amount.amountMinor), 0n);
      const receivedMinor = items.filter((t) => t.direction === 'in').reduce((s, t) => s + BigInt(t.amount.amountMinor), 0n);

      const byCategory = new Map<string, { count: number; totalMinor: bigint }>();
      for (const t of items) {
        const entry = byCategory.get(t.category) ?? { count: 0, totalMinor: 0n };
        entry.count += 1;
        entry.totalMinor += BigInt(t.amount.amountMinor);
        byCategory.set(t.category, entry);
      }

      return {
        currency,
        spent: money(spentMinor, currency),
        received: money(receivedMinor, currency),
        net: money(receivedMinor - spentMinor, currency),
        categories: [...byCategory.entries()].map(([category, v]) => ({
          category,
          count: v.count,
          total: money(v.totalMinor, currency)
        }))
      };
    }
  };
}
