import { describe, expect, it, vi } from 'vitest';
import { createDemoStore } from '../store';
import { createMemoryStorage } from '../testSupport';
import { createRealtimeApi } from './realtime';

describe('createRealtimeApi', () => {
  it('opens asynchronously and relays store events until closed', async () => {
    const store = createDemoStore(createMemoryStorage());
    const { realtime } = createRealtimeApi(store);
    const onOpen = vi.fn();
    const onEvent = vi.fn();

    const socket = realtime({ onOpen, onEvent });
    expect(onOpen).not.toHaveBeenCalled();
    await Promise.resolve();
    expect(onOpen).toHaveBeenCalledOnce();

    store.mutate(() => {}, { type: 'transaction.created', data: {}, at: new Date().toISOString() });
    expect(onEvent).toHaveBeenCalledOnce();

    socket.close();
    store.mutate(() => {}, { type: 'card.updated', data: {}, at: new Date().toISOString() });
    expect(onEvent).toHaveBeenCalledOnce();
  });
});
