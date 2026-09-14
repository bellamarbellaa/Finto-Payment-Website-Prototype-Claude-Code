import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import type { PublicUser } from './mock/types';
import { api } from './mock/client';

interface AuthValue {
  user: PublicUser | null;
  /** null while the initial session check is still running. */
  ready: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);

  /**
   * The demo store persists to localStorage, so a signed-in visitor stays
   * signed in across a reload — same shape as the real app's cookie restore,
   * just backed by a different mechanism.
   */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const restored = await api.auth.restore();
        if (!restored) {
          if (!cancelled) setUser(null);
          return;
        }

        const { user: me } = await api.users.me();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (identifier: string, password: string) => {
    const result = await api.auth.login(identifier, password);
    setUser(result.user);
  }, []);

  const signOut = useCallback(async () => {
    await api.auth.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const { user: me } = await api.users.me();
    setUser(me);
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signOut, refreshUser }),
    [user, ready, signIn, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
