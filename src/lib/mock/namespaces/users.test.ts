import { describe, expect, it } from 'vitest';
import { createDemoStore } from '../store';
import { createMemoryStorage } from '../testSupport';
import { createAuthApi } from './auth';
import { createUsersApi } from './users';

function setup() {
  const store = createDemoStore(createMemoryStorage());
  return { store, auth: createAuthApi(store), users: createUsersApi(store) };
}

describe('createUsersApi', () => {
  it('rejects reading the profile when signed out', async () => {
    const { users } = setup();
    await expect(users.me()).rejects.toMatchObject({ code: 'unauthorized' });
  });

  it('returns the seeded profile once signed in', async () => {
    const { auth, users } = setup();
    await auth.login('sofia@marengo.studio', 'sofia2026-finto');
    const { user } = await users.me();
    expect(user.fullName).toBe('Sofia Marengo');
  });

  it('updateSecurity merges the patch', async () => {
    const { auth, users } = setup();
    await auth.login('sofia@marengo.studio', 'sofia2026-finto');
    const { user } = await users.updateSecurity({ biometricEnabled: true });
    expect(user.security.biometricEnabled).toBe(true);
    expect(user.security.confirmPayments).toBe(true);
  });
});
