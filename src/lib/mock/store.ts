import type { Account, PublicUser } from './types';
import { SEED } from './data';

export interface DemoState {
  user: PublicUser;
  signedIn: boolean;
  accounts: Account[];
}

export interface DemoStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const STORAGE_KEY = 'finto-demo:v1';

function cloneSeed(): DemoState {
  return structuredClone(SEED);
}

function resolveStorage(storage?: DemoStorage): DemoStorage {
  if (storage) return storage;
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    // storage blocked (private mode, SSR) — fall through to a no-op
  }
  return { getItem: () => null, setItem: () => {} };
}

export function createDemoStore(storageOverride?: DemoStorage) {
  const storage = resolveStorage(storageOverride);
  let state = load();

  function load(): DemoState {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as DemoState;
    } catch {
      // corrupt JSON — fall back to a clean seed rather than crashing the app
    }
    return cloneSeed();
  }

  function persist() {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable — demo still works for this page load
    }
  }

  function get(): DemoState {
    return state;
  }

  function mutate(fn: (state: DemoState) => void) {
    fn(state);
    persist();
  }

  function resetToSeed() {
    state = cloneSeed();
    persist();
  }

  return { get, mutate, resetToSeed };
}

export type DemoStore = ReturnType<typeof createDemoStore>;
