import type { Money } from './types';

/** Every demo currency (USD/EUR/GBP) uses 2 minor-unit decimals. */
const SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };

function withThousands(whole: bigint): string {
  return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function money(minorUnits: bigint, currency: string): Money {
  const symbol = SYMBOLS[currency] ?? `${currency} `;
  const negative = minorUnits < 0n;
  const abs = negative ? -minorUnits : minorUnits;
  const whole = abs / 100n;
  const cents = (abs % 100n).toString().padStart(2, '0');
  const sign = negative ? '-' : '';

  return {
    amount: `${sign}${whole}.${cents}`,
    amountMinor: minorUnits.toString(),
    currency,
    formatted: `${sign}${symbol}${withThousands(whole)}.${cents}`,
    symbol
  };
}
