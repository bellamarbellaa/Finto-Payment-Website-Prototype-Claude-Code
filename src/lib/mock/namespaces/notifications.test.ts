import { describe, expect, it } from 'vitest';
import { createDemoStore } from '../store';
import { createMemoryStorage } from '../testSupport';
import { createNotificationsApi } from './notifications';

function setup() {
  const store = createDemoStore(createMemoryStorage());
  return { store, notifications: createNotificationsApi(store) };
}

describe('createNotificationsApi', () => {
  it('list() reports the unread count', async () => {
    const { notifications } = setup();
    const result = await notifications.list();
    expect(result.unread).toBe(2);
  });

  it('markRead() flips one notification and decreases the unread count', async () => {
    const { notifications } = setup();
    const result = await notifications.markRead('notif_01');
    expect(result.notification.read).toBe(true);
    expect(result.unread).toBe(1);
  });

  it('markAllRead() clears every unread notification', async () => {
    const { notifications } = setup();
    const result = await notifications.markAllRead();
    expect(result.marked).toBe(2);
    expect(result.unread).toBe(0);
  });
});
