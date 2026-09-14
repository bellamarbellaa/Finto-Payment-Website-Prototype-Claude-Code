import type { DemoStore } from '../store';

export function createNotificationsApi(store: DemoStore) {
  function unreadCount(): number {
    return store.get().notifications.filter((n) => !n.read).length;
  }

  return {
    async list(params: { limit?: number; unreadOnly?: boolean } = {}) {
      let items = store.get().notifications;
      if (params.unreadOnly) items = items.filter((n) => !n.read);
      return { notifications: items.slice(0, params.limit ?? 40), unread: unreadCount() };
    },

    async markRead(id: string) {
      store.mutate((s) => {
        const target = s.notifications.find((n) => n.id === id);
        if (target) target.read = true;
      });
      return { notification: store.get().notifications.find((n) => n.id === id)!, unread: unreadCount() };
    },

    async markAllRead() {
      let marked = 0;
      store.mutate((s) => {
        for (const n of s.notifications) {
          if (!n.read) {
            n.read = true;
            marked += 1;
          }
        }
      });
      return { marked, unread: unreadCount() };
    }
  };
}
