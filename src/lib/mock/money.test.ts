import { describe, expect, it } from 'vitest';
import { money } from './money';

describe('money', () => {
  it('formats a whole-dollar USD amount with thousands separators', () => {
    const m = money(245080n, 'USD');
    expect(m.amount).toBe('2450.80');
    expect(m.amountMinor).toBe('245080');
    expect(m.formatted).toBe('$2,450.80');
    expect(m.symbol).toBe('$');
    expect(m.currency).toBe('USD');
  });

  it('formats a negative amount', () => {
    const m = money(-500n, 'USD');
    expect(m.amount).toBe('-5.00');
    expect(m.formatted).toBe('-$5.00');
  });

  it('falls back to the currency code as symbol for unknown currencies', () => {
    const m = money(1000n, 'JPY');
    expect(m.symbol).toBe('JPY ');
  });
});
