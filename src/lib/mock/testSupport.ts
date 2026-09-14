import type { DemoStorage } from './store';

/** In-memory stand-in for localStorage, for tests where the real one isn't available. */
export function createMemoryStorage(): DemoStorage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    }
  };
}
