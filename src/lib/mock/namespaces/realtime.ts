import type { RealtimeEvent } from '../types';
import type { DemoStore } from '../store';

export function createRealtimeApi(store: DemoStore) {
  return {
    realtime(handlers: { onEvent: (event: RealtimeEvent) => void; onOpen?: () => void; onClose?: () => void }) {
      let closed = false;
      const unsubscribe = store.subscribe((event) => {
        if (!closed) handlers.onEvent(event);
      });

      // Mirrors the real client: the connection "opens" asynchronously, never synchronously.
      void Promise.resolve().then(() => {
        if (!closed) handlers.onOpen?.();
      });

      return {
        close() {
          closed = true;
          unsubscribe();
          handlers.onClose?.();
        }
      };
    }
  };
}
