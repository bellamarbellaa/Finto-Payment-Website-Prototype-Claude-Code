import { describe, expect, it, vi } from 'vitest';
import { api } from './client';

describe('api (mock client)', () => {
  it('exposes every namespace', () => {
    for (const key of [
      'auth', 'users', 'accounts', 'transactions', 'payments',
      'contacts', 'cards', 'notifications', 'devices', 'fx', 'support', 'realtime'
    ] as const) {
      expect(api[key]).toBeDefined();
    }
  });

  it('realtime() opens and can be closed without throwing', async () => {
    const onOpen = vi.fn();
    const socket = api.realtime({ onEvent: () => {}, onOpen });
    await Promise.resolve();
    expect(onOpen).toHaveBeenCalledOnce();
    expect(() => socket.close()).not.toThrow();
  });
});
