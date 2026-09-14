import { FintoApiError } from '../types';
import type { DemoStore } from '../store';

const DEMO_PASSWORD = 'sofia2026-finto';

export function createAuthApi(store: DemoStore) {
  function requireSignedIn() {
    if (!store.get().signedIn) throw new FintoApiError(401, 'unauthorized', 'Not signed in.');
  }

  return {
    async login(identifier: string, password: string) {
      const state = store.get();
      const needle = identifier.trim().toLowerCase();
      const matchesIdentity = needle === state.user.email.toLowerCase() || needle === state.user.handle.toLowerCase();

      if (!matchesIdentity || password !== DEMO_PASSWORD) {
        throw new FintoApiError(401, 'invalid_credentials', 'That email or password is not right.');
      }

      store.mutate((s) => {
        s.signedIn = true;
      });
      return { user: store.get().user, accessToken: 'demo-access', refreshToken: 'demo-refresh', expiresIn: 900, sessionId: 'sess_current' };
    },

    async register() {
      throw new FintoApiError(403, 'forbidden', 'New accounts are not available in the demo — sign in as Sofia instead.');
    },

    async restore() {
      return store.get().signedIn;
    },

    async unlockWithPin(pin: string) {
      if (pin !== store.get().pin) throw new FintoApiError(401, 'invalid_credentials', 'Wrong PIN.');
      store.mutate((s) => {
        s.signedIn = true;
      });
      return { accessToken: 'demo-access', refreshToken: 'demo-refresh', expiresIn: 900, sessionId: 'sess_current' };
    },

    async setPin(pin: string) {
      store.mutate((s) => {
        s.pin = pin;
        s.user.security.pinSet = true;
      });
      return { ok: true as const };
    },

    async logout() {
      store.mutate((s) => {
        s.signedIn = false;
      });
    },

    async sessions() {
      requireSignedIn();
      return { sessions: store.get().sessions };
    },

    async revokeAllSessions(keepCurrent = true) {
      requireSignedIn();
      const before = store.get().sessions.length;
      store.mutate((s) => {
        s.sessions = keepCurrent ? s.sessions.filter((session) => session.current) : [];
      });
      return { revoked: before - store.get().sessions.length };
    }
  };
}
