import { describe, expect, it } from 'vitest';
import { createDemoStore, STORAGE_KEY } from './store';
import { createMemoryStorage } from './testSupport';

describe('createDemoStore', () => {
  it('starts from the seed data when storage is empty', () => {
    const store = createDemoStore(createMemoryStorage());
    expect(store.get().user.email).toBe('sofia@marengo.studio');
    expect(store.get().accounts.length).toBeGreaterThan(0);
    expect(store.get().signedIn).toBe(false);
  });

  it('persists mutations across store instances sharing the same storage', () => {
    const storage = createMemoryStorage();
    const first = createDemoStore(storage);
    first.mutate((s) => {
      s.signedIn = true;
    });

    const second = createDemoStore(storage);
    expect(second.get().signedIn).toBe(true);
  });

  it('resetToSeed discards mutations', () => {
    const store = createDemoStore(createMemoryStorage());
    store.mutate((s) => {
      s.signedIn = true;
    });
    store.resetToSeed();
    expect(store.get().signedIn).toBe(false);
  });

  it('falls back to the seed when stored JSON is corrupt', () => {
    const storage = createMemoryStorage();
    storage.setItem(STORAGE_KEY, '{not json');
    const store = createDemoStore(storage);
    expect(store.get().user.email).toBe('sofia@marengo.studio');
  });
});
