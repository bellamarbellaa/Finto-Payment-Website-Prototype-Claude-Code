import { money, parseAmountMinor } from '../money';

const RATES: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.78 };

export function createFxApi() {
  return {
    async currencies() {
      return { currencies: Object.keys(RATES).map((code) => ({ code })) };
    },

    async rate(from: string, to: string) {
      const rate = (RATES[to] ?? 1) / (RATES[from] ?? 1);
      return { base: from, quote: to, rate: rate.toFixed(6), asOf: new Date().toISOString() };
    },

    async quote(from: string, to: string, amount: string) {
      const fromMinor = parseAmountMinor(amount);
      const rate = (RATES[to] ?? 1) / (RATES[from] ?? 1);
      const toMinor = BigInt(Math.round(Number(fromMinor) * rate));
      return {
        from: money(fromMinor, from),
        to: money(toMinor, to),
        rate: rate.toFixed(6),
        asOf: new Date().toISOString()
      };
    }
  };
}
