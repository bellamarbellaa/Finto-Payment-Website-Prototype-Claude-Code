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

/** Same contract as finto-backend's parseAmount: a decimal string in, integer minor units out. */
export function parseAmountMinor(amount: string): bigint {
  const trimmed = amount.trim();
  const negative = trimmed.startsWith('-');
  const unsigned = negative ? trimmed.slice(1) : trimmed;
  const [wholePart, fractionPart = ''] = unsigned.split('.');
  const cents = (fractionPart + '00').slice(0, 2);
  const minor = BigInt(wholePart || '0') * 100n + BigInt(cents || '0');
  return negative ? -minor : minor;
}
