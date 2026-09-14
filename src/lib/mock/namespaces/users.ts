import { FintoApiError, type PublicUser } from '../types';
import type { DemoStore } from '../store';

export function createUsersApi(store: DemoStore) {
  function requireSignedIn(): void {
    if (!store.get().signedIn) throw new FintoApiError(401, 'unauthorized', 'Not signed in.');
  }

  return {
    async me() {
      requireSignedIn();
      return { user: store.get().user };
    },

    async update(patch: Partial<Pick<PublicUser, 'fullName' | 'displayName' | 'phone' | 'tint'>>) {
      requireSignedIn();
      store.mutate((s) => {
        Object.assign(s.user, patch);
      });
      return { user: store.get().user };
    },

    async updateSecurity(patch: { biometricEnabled?: boolean; confirmPayments?: boolean }) {
      requireSignedIn();
      store.mutate((s) => {
        Object.assign(s.user.security, patch);
      });
      return { user: store.get().user };
    },

    async changePassword(_currentPassword: string, _newPassword: string) {
      requireSignedIn();
      return { ok: true as const, otherSessionsRevoked: 0 };
    }
  };
}
