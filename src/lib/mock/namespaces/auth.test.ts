import { describe, expect, it } from 'vitest';
import { createDemoStore } from '../store';
import { createMemoryStorage } from '../testSupport';
import { createAuthApi } from './auth';

function setup() {
  const store = createDemoStore(createMemoryStorage());
  return { store, auth: createAuthApi(store) };
}

describe('createAuthApi', () => {
  it('signs in with the seeded email and password', async () => {
    const { store, auth } = setup();
    const result = await auth.login('sofia@marengo.studio', 'sofia2026-finto');
    expect(result.user.handle).toBe('@sofia');
    expect(store.get().signedIn).toBe(true);
  });

  it('signs in with the handle too', async () => {
    const { auth } = setup();
    const result = await auth.login('@sofia', 'sofia2026-finto');
    expect(result.user.email).toBe('sofia@marengo.studio');
  });

  it('rejects the wrong password', async () => {
    const { auth } = setup();
    await expect(auth.login('sofia@marengo.studio', 'wrong')).rejects.toMatchObject({
      code: 'invalid_credentials'
    });
  });

  it('restore reflects the current session state', async () => {
    const { auth } = setup();
    expect(await auth.restore()).toBe(false);
    await auth.login('sofia@marengo.studio', 'sofia2026-finto');
    expect(await auth.restore()).toBe(true);
  });

  it('logout clears the session', async () => {
    const { store, auth } = setup();
    await auth.login('sofia@marengo.studio', 'sofia2026-finto');
    await auth.logout();
    expect(store.get().signedIn).toBe(false);
  });

  it('unlockWithPin accepts the seeded PIN and rejects any other', async () => {
    const { store, auth } = setup();
    await expect(auth.unlockWithPin('0000')).rejects.toMatchObject({ code: 'invalid_credentials' });
    await auth.unlockWithPin('4829');
    expect(store.get().signedIn).toBe(true);
  });

  it('revokeAllSessions(true) keeps only the current session', async () => {
    const { store, auth } = setup();
    await auth.login('sofia@marengo.studio', 'sofia2026-finto');
    const { revoked } = await auth.revokeAllSessions(true);
    expect(revoked).toBe(0);
    expect(store.get().sessions).toHaveLength(1);
  });
});
