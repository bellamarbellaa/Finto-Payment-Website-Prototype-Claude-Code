import type {
  Account,
  Card,
  Contact,
  Notification,
  PaymentRequest,
  PublicUser,
  RealtimeEvent,
  Transaction
} from './types';
import { SEED } from './data';

export type StoredTransaction = Transaction & { accountId: string };

export interface DemoState {
  user: PublicUser;
  pin: string;
  signedIn: boolean;
  accounts: Account[];
  transactions: StoredTransaction[];
  cards: Card[];
  contacts: Contact[];
  notifications: Notification[];
  paymentRequests: PaymentRequest[];
  sessions: { id: string; ip: string | null; userAgent: string | null; current: boolean }[];
}

export interface DemoStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const STORAGE_KEY = 'finto-demo:v2';

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

type Listener = (event: RealtimeEvent) => void;

export function createDemoStore(storageOverride?: DemoStorage) {
  const storage = resolveStorage(storageOverride);
  const listeners = new Set<Listener>();
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

  function mutate(fn: (state: DemoState) => void, event?: RealtimeEvent) {
    fn(state);
    persist();
    if (event) for (const listener of listeners) listener(event);
  }

  function resetToSeed() {
    state = cloneSeed();
    persist();
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { get, mutate, resetToSeed, subscribe };
}

export type DemoStore = ReturnType<typeof createDemoStore>;
