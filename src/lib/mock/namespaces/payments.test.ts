import { describe, expect, it } from 'vitest';
import { createDemoStore } from '../store';
import { createMemoryStorage } from '../testSupport';
import { createPaymentsApi } from './payments';

function setup() {
  const store = createDemoStore(createMemoryStorage());
  return { store, payments: createPaymentsApi(store) };
}

describe('createPaymentsApi', () => {
  it('send() deducts the balance and records a transaction', async () => {
    const { store, payments } = setup();
    const before = BigInt(store.get().accounts[0]!.balance.amountMinor);

    const { transaction, balanceAfter } = await payments.send({ amount: '50.00', fromAccountId: 'acc_usd' });

    expect(transaction.direction).toBe('out');
    expect(BigInt(balanceAfter.amountMinor)).toBe(before - 5000n);
    expect(store.get().transactions[0]!.id).toBe(transaction.id);
  });

  it('send() rejects amounts over the available balance', async () => {
    const { payments } = setup();
    await expect(payments.send({ amount: '999999.00', fromAccountId: 'acc_usd' })).rejects.toMatchObject({
      code: 'insufficient_funds'
    });
  });

  it('createRequest -> scan -> payRequest settles the request once', async () => {
    const { store, payments } = setup();
    const { request } = await payments.createRequest({ amount: '25.00', accountId: 'acc_usd' });

    const scanned = await payments.scan(request.shareUrl);
    expect(scanned.request.linkToken).toBe(request.linkToken);

    await payments.payRequest(request.linkToken);
    expect(store.get().paymentRequests.find((r) => r.linkToken === request.linkToken)!.status).toBe('paid');

    await expect(payments.payRequest(request.linkToken)).rejects.toMatchObject({ code: 'conflict' });
  });
});
