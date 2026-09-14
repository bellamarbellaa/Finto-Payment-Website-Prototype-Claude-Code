import { describe, expect, it } from 'vitest';
import { money, parseAmountMinor } from './money';

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

describe('parseAmountMinor', () => {
  it('parses a plain decimal string', () => {
    expect(parseAmountMinor('240.50')).toBe(24050n);
  });

  it('parses a whole-number string with no decimal point', () => {
    expect(parseAmountMinor('240')).toBe(24000n);
  });

  it('pads a single decimal digit', () => {
    expect(parseAmountMinor('240.5')).toBe(24050n);
  });

  it('round-trips through money()', () => {
    const minor = parseAmountMinor('99.99');
    expect(money(minor, 'USD').amount).toBe('99.99');
  });

  it('parses negative amounts', () => {
    expect(parseAmountMinor('-10.00')).toBe(-1000n);
  });
});
