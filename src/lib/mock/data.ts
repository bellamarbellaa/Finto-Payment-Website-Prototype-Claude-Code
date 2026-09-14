import type { Account, Card, Contact, Notification, PublicUser, Transaction } from './types';
import type { DemoState, StoredTransaction } from './store';
import { money } from './money';
import { transactionDisplay } from './format';

/** Matches the real app's demo account — see START-HERE.md. */
const USER: PublicUser = {
  id: 'user_sofia',
  email: 'sofia@marengo.studio',
  phone: '+1 555 0142',
  fullName: 'Sofia Marengo',
  displayName: 'Sofia',
  handle: '@sofia',
  tint: 'lime',
  baseCurrency: 'USD',
  initials: 'SM',
  security: { biometricEnabled: false, confirmPayments: true, pinSet: true },
  emailVerified: true,
  createdAt: '2026-01-14T09:00:00.000Z'
};

const ACCOUNTS: Account[] = [
  {
    id: 'acc_usd',
    name: 'Main',
    currency: 'USD',
    symbol: '$',
    kind: 'main',
    ibanMasked: '•••• 4471',
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
    ibanMasked: '•••• 2290',
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
    ibanMasked: '•••• 7783',
    isPrimary: false,
    status: 'active',
    balance: money(512300n, 'GBP'),
    available: money(512300n, 'GBP'),
    createdAt: '2026-03-18T09:00:00.000Z'
  }
];

const CONTACTS: Contact[] = [
  { id: 'contact_alessia', name: 'Alessia Moretti', handle: '@alessia', firstName: 'Alessia', initials: 'AM', tint: 'sky', isFavourite: true, isFintoUser: true, lastPaidAt: '2026-09-04T11:10:00.000Z' },
  { id: 'contact_marco', name: 'Marco Conti', handle: '@marco', firstName: 'Marco', initials: 'MC', tint: 'sand', isFavourite: false, isFintoUser: true, lastPaidAt: '2026-09-05T08:40:00.000Z' },
  { id: 'contact_nora', name: 'Nora Field', handle: '@norafield', firstName: 'Nora', initials: 'NF', tint: 'stone', isFavourite: false, isFintoUser: false, lastPaidAt: null },
  { id: 'contact_june', name: 'June Okafor', handle: '@june', firstName: 'June', initials: 'JO', tint: 'forest', isFavourite: true, isFintoUser: true, lastPaidAt: '2026-09-12T14:32:00.000Z' }
];

const CARDS: Card[] = [
  {
    id: 'card_virtual',
    brand: 'visa',
    kind: 'virtual',
    last4: '4821',
    maskedNumber: '•••• •••• •••• 4821',
    expiry: '09/29',
    holderName: 'Sofia Marengo',
    state: 'active',
    accountId: 'acc_usd',
    controls: { onlinePayments: true, paymentsAbroad: false, contactless: true, atmWithdrawals: false, monthlyLimit: money(150000n, 'USD') },
    spending: { thisMonth: money(48300n, 'USD'), limitUsedPercent: 32 },
    createdAt: '2026-01-20T09:00:00.000Z'
  },
  {
    id: 'card_physical',
    brand: 'visa',
    kind: 'physical',
    last4: '7790',
    maskedNumber: '•••• •••• •••• 7790',
    expiry: '11/28',
    holderName: 'Sofia Marengo',
    state: 'active',
    accountId: 'acc_usd',
    controls: { onlinePayments: true, paymentsAbroad: true, contactless: true, atmWithdrawals: true, monthlyLimit: null },
    spending: { thisMonth: money(112400n, 'USD'), limitUsedPercent: null },
    createdAt: '2026-01-20T09:00:00.000Z'
  }
];

const NOTIFICATIONS: Notification[] = [
  { id: 'notif_01', kind: 'payment_received', title: 'You got paid', body: 'June Okafor sent you $200.00', glyph: '💸', tint: 'lime', data: {}, read: false, createdAt: '2026-09-12T14:32:00.000Z', timeAgo: '2d ago' },
  { id: 'notif_02', kind: 'security', title: 'New sign-in', body: 'A new device signed in to your account', glyph: '🔒', tint: 'sky', data: {}, read: true, createdAt: '2026-09-10T08:00:00.000Z', timeAgo: '4d ago' },
  { id: 'notif_03', kind: 'payment_failed', title: 'Payment failed', body: 'Your payment to Fielding & Co did not go through', glyph: '⚠️', tint: 'sand', data: {}, read: false, createdAt: '2026-09-10T09:20:00.000Z', timeAgo: '4d ago' },
  { id: 'notif_04', kind: 'payment_request', title: 'Money request sent', body: 'Your request is ready to share', glyph: '🔗', tint: 'forest', data: {}, read: true, createdAt: '2026-09-06T10:00:00.000Z', timeAgo: '1w ago' }
];

function tx(input: {
  id: string;
  direction: 'in' | 'out';
  status: Transaction['status'];
  category: string;
  amountMinor: bigint;
  currency: string;
  accountId: string;
  counterparty: Transaction['counterparty'];
  note?: string | null;
  failureReason?: string | null;
  occurredAt: string;
}): StoredTransaction {
  const amount = money(input.amountMinor, input.currency);
  return {
    id: input.id,
    reference: input.id.toUpperCase(),
    type: 'transfer',
    status: input.status,
    direction: input.direction,
    counterparty: input.counterparty,
    category: input.category,
    note: input.note ?? null,
    failureReason: input.failureReason ?? null,
    amount,
    display: transactionDisplay({
      direction: input.direction,
      status: input.status,
      amount,
      category: input.category,
      occurredAt: input.occurredAt
    }),
    cardId: null,
    accountId: input.accountId,
    occurredAt: input.occurredAt,
    settledAt: input.status === 'completed' ? input.occurredAt : null
  };
}

const TRANSACTIONS: StoredTransaction[] = [
  tx({ id: 'txn_01', direction: 'in', status: 'completed', category: 'Salary', amountMinor: 320000n, currency: 'USD', accountId: 'acc_usd', counterparty: { name: 'Bloom Studio Payroll', handle: null, initial: 'B', tint: 'forest' }, occurredAt: '2026-08-30T09:00:00.000Z' }),
  tx({ id: 'txn_02', direction: 'out', status: 'completed', category: 'Rent', amountMinor: 180000n, currency: 'USD', accountId: 'acc_usd', counterparty: { name: 'Meridian Properties', handle: null, initial: 'M', tint: 'stone' }, occurredAt: '2026-09-01T09:00:00.000Z' }),
  tx({ id: 'txn_03', direction: 'out', status: 'completed', category: 'Groceries', amountMinor: 8420n, currency: 'USD', accountId: 'acc_usd', counterparty: { name: 'Green Aisle Market', handle: null, initial: 'G', tint: 'sand' }, occurredAt: '2026-09-03T17:45:00.000Z' }),
  tx({ id: 'txn_04', direction: 'out', status: 'completed', category: 'Transfer', amountMinor: 15000n, currency: 'USD', accountId: 'acc_usd', counterparty: { name: 'Alessia Moretti', handle: '@alessia', initial: 'A', tint: 'sky' }, occurredAt: '2026-09-04T11:10:00.000Z' }),
  tx({ id: 'txn_05', direction: 'in', status: 'completed', category: 'Transfer', amountMinor: 6000n, currency: 'EUR', accountId: 'acc_eur', counterparty: { name: 'Marco Conti', handle: '@marco', initial: 'M', tint: 'sand' }, occurredAt: '2026-09-05T08:40:00.000Z' }),
  tx({ id: 'txn_06', direction: 'out', status: 'pending', category: 'Software', amountMinor: 2900n, currency: 'USD', accountId: 'acc_usd', counterparty: { name: 'Northwind Cloud', handle: null, initial: 'N', tint: 'stone' }, occurredAt: '2026-09-08T09:00:00.000Z' }),
  tx({ id: 'txn_07', direction: 'out', status: 'completed', category: 'Dining', amountMinor: 5680n, currency: 'USD', accountId: 'acc_usd', counterparty: { name: 'Ember & Oak', handle: null, initial: 'E', tint: 'sand' }, occurredAt: '2026-09-09T19:30:00.000Z' }),
  tx({ id: 'txn_08', direction: 'out', status: 'failed', category: 'Shopping', amountMinor: 12000n, currency: 'GBP', accountId: 'acc_gbp', counterparty: { name: 'Fielding & Co', handle: null, initial: 'F', tint: 'stone' }, failureReason: 'Card declined by issuer', occurredAt: '2026-09-10T09:20:00.000Z' }),
  tx({ id: 'txn_09', direction: 'out', status: 'completed', category: 'Transport', amountMinor: 3400n, currency: 'USD', accountId: 'acc_usd', counterparty: { name: 'CityLine Transit', handle: null, initial: 'C', tint: 'sky' }, occurredAt: '2026-09-11T08:05:00.000Z' }),
  tx({ id: 'txn_10', direction: 'in', status: 'completed', category: 'Transfer', amountMinor: 20000n, currency: 'USD', accountId: 'acc_usd', counterparty: { name: 'June Okafor', handle: '@june', initial: 'J', tint: 'forest' }, occurredAt: '2026-09-12T14:32:00.000Z' })
];

export const SEED: DemoState = {
  user: USER,
  pin: '4829',
  signedIn: false,
  accounts: ACCOUNTS,
  transactions: TRANSACTIONS,
  cards: CARDS,
  contacts: CONTACTS,
  notifications: NOTIFICATIONS,
  paymentRequests: [],
  sessions: [{ id: 'sess_current', ip: '203.0.113.42', userAgent: 'Chrome on macOS', current: true }]
};
