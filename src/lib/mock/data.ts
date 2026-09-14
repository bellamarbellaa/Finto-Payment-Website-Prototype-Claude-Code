import type { Account, PublicUser } from './types';
import type { DemoState } from './store';
import { money } from './money';

/** Matches the real app's demo account — see START-HERE.md. */
const USER: PublicUser = {
  id: 'user_sofia',
  email: 'sofia@marengo.studio',
  fullName: 'Sofia Marengo',
  displayName: 'Sofia',
  handle: '@sofia',
  tint: 'lime',
  baseCurrency: 'USD',
  initials: 'SM',
  createdAt: '2026-01-14T09:00:00.000Z'
};

const ACCOUNTS: Account[] = [
  {
    id: 'acc_usd',
    name: 'Main',
    currency: 'USD',
    symbol: '$',
    kind: 'main',
    isPrimary: true,
    status: 'active',
    balance: money(245080n, 'USD'),
    available: money(245080n, 'USD'),
    createdAt: '2026-01-14T09:00:00.000Z'
  },
  {
    id: 'acc_eur',
    name: 'Euro balance',
    currency: 'EUR',
    symbol: '€',
    kind: 'balance',
    isPrimary: false,
    status: 'active',
    balance: money(86420n, 'EUR'),
    available: money(86420n, 'EUR'),
    createdAt: '2026-02-02T09:00:00.000Z'
  },
  {
    id: 'acc_gbp',
    name: 'Savings',
    currency: 'GBP',
    symbol: '£',
    kind: 'savings',
    isPrimary: false,
    status: 'active',
    balance: money(512300n, 'GBP'),
    available: money(512300n, 'GBP'),
    createdAt: '2026-03-18T09:00:00.000Z'
  }
];

export const SEED: DemoState = {
  user: USER,
  signedIn: false,
  accounts: ACCOUNTS
};
