/** A trimmed slice of finto-backend's API shapes — just what this showcase's login demo needs. */

export interface Money {
  amount: string;
  amountMinor: string;
  currency: string;
  formatted: string;
  symbol: string;
}

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  displayName: string;
  handle: string;
  tint: string;
  baseCurrency: string;
  initials: string;
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  currency: string;
  symbol: string;
  kind: 'main' | 'balance' | 'savings';
  isPrimary: boolean;
  status: 'active' | 'frozen' | 'closed';
  balance: Money;
  available: Money;
  createdAt: string;
}
