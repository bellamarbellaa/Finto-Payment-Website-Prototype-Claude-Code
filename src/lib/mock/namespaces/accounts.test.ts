import { describe, expect, it } from 'vitest';
import { createDemoStore } from '../store';
import { createMemoryStorage } from '../testSupport';
import { createAccountsApi } from './accounts';

function setup() {
  const store = createDemoStore(createMemoryStorage());
  return { store, accounts: createAccountsApi(store) };
}

describe('createAccountsApi', () => {
  it('lists the seeded accounts with a USD-only total', async () => {
    const { accounts } = setup();
    const result = await accounts.list();
    expect(result.accounts).toHaveLength(3);
    expect(result.total.amount).toBe('2450.80');
    expect(result.baseCurrency).toBe('USD');
  });

  it('get() returns a single account by id', async () => {
    const { accounts } = setup();
    const { account } = await accounts.get('acc_eur');
    expect(account.currency).toBe('EUR');
  });

  it('get() throws not_found for an unknown id', async () => {
    const { accounts } = setup();
    await expect(accounts.get('nope')).rejects.toMatchObject({ code: 'not_found' });
  });

  it('open() adds a new zero-balance account', async () => {
    const { store, accounts } = setup();
    const { account } = await accounts.open('JPY', 'Yen fund');
    expect(account.balance.amount).toBe('0.00');
    expect(store.get().accounts).toHaveLength(4);
  });
});
