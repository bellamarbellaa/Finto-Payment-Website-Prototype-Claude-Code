import { describe, expect, it } from 'vitest';
import { createDemoStore } from '../store';
import { createMemoryStorage } from '../testSupport';
import { createTransactionsApi } from './transactions';

function setup() {
  const store = createDemoStore(createMemoryStorage());
  return { store, transactions: createTransactionsApi(store) };
}

describe('createTransactionsApi', () => {
  it('lists transactions newest-first, grouped by day', async () => {
    const { transactions } = setup();
    const result = await transactions.list();
    expect(result.transactions.length).toBeGreaterThan(0);
    expect(result.transactions[0]!.occurredAt >= result.transactions.at(-1)!.occurredAt).toBe(true);
    expect(result.groups && result.groups.length).toBeGreaterThan(0);
    // Regression: group totals must be formatted currency, not raw minor units.
    expect(result.groups![0]!.total).toMatch(/^-?[$€£][\d,]+\.\d{2}$/);
  });

  it('filters to pending only', async () => {
    const { transactions } = setup();
    const result = await transactions.list({ filter: 'pending' });
    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0]!.status).toBe('pending');
  });

  it('get() throws not_found for an unknown id', async () => {
    const { transactions } = setup();
    await expect(transactions.get('nope')).rejects.toMatchObject({ code: 'not_found' });
  });
});
