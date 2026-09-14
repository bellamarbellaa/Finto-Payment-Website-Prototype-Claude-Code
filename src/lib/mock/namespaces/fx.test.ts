import { describe, expect, it } from 'vitest';
import { createFxApi } from './fx';

describe('createFxApi', () => {
  it('lists the demo currencies', async () => {
    const fx = createFxApi();
    const { currencies } = await fx.currencies();
    expect(currencies.map((c) => c.code)).toEqual(['USD', 'EUR', 'GBP']);
  });

  it('quotes a conversion', async () => {
    const fx = createFxApi();
    const { from, to } = await fx.quote('USD', 'EUR', '100.00');
    expect(from.amount).toBe('100.00');
    expect(to.currency).toBe('EUR');
  });
});
