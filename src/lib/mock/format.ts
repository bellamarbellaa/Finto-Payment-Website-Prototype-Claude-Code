import type { Money, Transaction } from './types';

export function metaDate(iso: string): string {
  const date = new Date(iso);
  const datePart = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(date);
  const timePart = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date);
  return `${datePart} ${timePart}`;
}

const STATUS_STYLE: Record<Transaction['status'], { label: string; bg: string; fg: string } | null> = {
  completed: null,
  pending: { label: 'Pending', bg: 'var(--warn-bg)', fg: 'var(--warn)' },
  failed: { label: 'Failed', bg: 'var(--danger-bg)', fg: 'var(--danger)' },
  reversed: { label: 'Reversed', bg: 'var(--surface-3)', fg: 'var(--muted)' }
};

export function transactionDisplay(input: {
  direction: 'in' | 'out';
  status: Transaction['status'];
  amount: Money;
  category: string;
  occurredAt: string;
}): Transaction['display'] {
  const sign = input.direction === 'in' ? '+' : '-';
  const amountColor =
    input.status === 'failed' ? 'var(--danger)' : input.direction === 'in' ? 'var(--income)' : 'var(--ink)';
  const style = STATUS_STYLE[input.status];

  return {
    amount: `${sign}${input.amount.formatted}`,
    amountColor,
    meta: `${input.category} · ${metaDate(input.occurredAt)}`,
    showStatus: style !== null,
    statusLabel: style?.label ?? '',
    statusBg: style?.bg ?? '',
    statusFg: style?.fg ?? ''
  };
}
