import { describe, expect, it } from 'vitest';
import { createDemoStore } from './store';
import { createMemoryStorage } from './testSupport';
import { InvalidCredentialsError, signIn } from './auth';

function setup() {
  return createDemoStore(createMemoryStorage());
}

describe('signIn', () => {
  it('signs in with the seeded email and password', () => {
    const store = setup();
    const user = signIn(store, 'sofia@marengo.studio', 'sofia2026-finto');
    expect(user.handle).toBe('@sofia');
    expect(store.get().signedIn).toBe(true);
  });

  it('signs in with the handle too', () => {
    const store = setup();
    const user = signIn(store, '@sofia', 'sofia2026-finto');
    expect(user.email).toBe('sofia@marengo.studio');
  });

  it('rejects the wrong password', () => {
    const store = setup();
    expect(() => signIn(store, 'sofia@marengo.studio', 'wrong')).toThrow(InvalidCredentialsError);
    expect(store.get().signedIn).toBe(false);
  });

  it('rejects an unknown identifier', () => {
    const store = setup();
    expect(() => signIn(store, 'nobody@example.com', 'sofia2026-finto')).toThrow(InvalidCredentialsError);
  });
});
