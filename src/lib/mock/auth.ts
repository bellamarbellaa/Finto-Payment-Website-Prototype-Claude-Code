import type { DemoStore } from './store';
import type { PublicUser } from './types';

/** Matches the real app's demo password — see START-HERE.md. */
const DEMO_PASSWORD = 'sofia2026-finto';

export class InvalidCredentialsError extends Error {
  constructor() {
    super('That email or password is not right.');
    this.name = 'InvalidCredentialsError';
  }
}

/** Checks the typed credentials against the one seeded demo user and signs them in. */
export function signIn(store: DemoStore, identifier: string, password: string): PublicUser {
  const state = store.get();
  const needle = identifier.trim().toLowerCase();
  const matchesIdentity = needle === state.user.email.toLowerCase() || needle === state.user.handle.toLowerCase();

  if (!matchesIdentity || password !== DEMO_PASSWORD) {
    throw new InvalidCredentialsError();
  }

  store.mutate((s) => {
    s.signedIn = true;
  });
  return store.get().user;
}
