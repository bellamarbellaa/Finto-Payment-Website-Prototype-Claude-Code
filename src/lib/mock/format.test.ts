import { describe, expect, it } from 'vitest';
import { transactionDisplay } from './format';
import { money } from './money';

describe('transactionDisplay', () => {
  it('shows incoming completed transactions in the income color with no status pill', () => {
    const display = transactionDisplay({
      direction: 'in',
      status: 'completed',
      amount: money(20000n, 'USD'),
      category: 'Transfer',
      occurredAt: '2026-09-12T14:32:00.000Z'
    });
    expect(display.amount).toBe('+$200.00');
    expect(display.amountColor).toBe('var(--income)');
    expect(display.showStatus).toBe(false);
  });

  it('shows a pending status pill for pending transactions', () => {
    const display = transactionDisplay({
      direction: 'out',
      status: 'pending',
      amount: money(2900n, 'USD'),
      category: 'Software',
      occurredAt: '2026-09-08T09:00:00.000Z'
    });
    expect(display.showStatus).toBe(true);
    expect(display.statusLabel).toBe('Pending');
  });

  it('shows failed transactions in the danger color with a Failed pill', () => {
    const display = transactionDisplay({
      direction: 'out',
      status: 'failed',
      amount: money(12000n, 'GBP'),
      category: 'Shopping',
      occurredAt: '2026-09-10T09:20:00.000Z'
    });
    expect(display.amountColor).toBe('var(--danger)');
    expect(display.statusLabel).toBe('Failed');
  });
});
