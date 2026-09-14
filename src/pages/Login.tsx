import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { BrandReveal } from '../components/BrandReveal';
import { EyeIcon } from '../components/EyeIcon';
import { store } from '../lib/mock/client';
import { InvalidCredentialsError, signIn } from '../lib/mock/auth';
import type { PublicUser } from '../lib/mock/types';

export function Login() {
  const [identifier, setIdentifier] = useState('sofia@marengo.studio');
  const [password, setPassword] = useState('sofia2026-finto');
  const [shown, setShown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState<PublicUser | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    // A real sign-in has network latency; a beat of "Signing in…" makes the
    // demo feel like it's actually checking something, not just flipping a flag.
    setTimeout(() => {
      try {
        setUser(signIn(store, identifier.trim(), password));
      } catch (err) {
        setError(err instanceof InvalidCredentialsError ? err.message : 'Something went wrong. Try again.');
        setBusy(false);
      }
    }, 500);
  }

  const primaryAccount = store.get().accounts.find((a) => a.isPrimary);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr', background: 'var(--paper)' }}>
      <div className="login-split">
        <aside className="login-brand">
          <div className="login-brand-inner">
            <Link to="/case-study" className="login-mark" aria-label="About this project">
              F
            </Link>
            <h2>Payments that keep up with your business</h2>
            <p>
              Send, receive and settle in one place — the same Finto rails your customers already
              check out on.
            </p>
            <div className="login-facts">
              <div>
                <span>Hold</span>
                <strong>14 currencies</strong>
              </div>
              <div>
                <span>Finto to Finto</span>
                <strong>Instant</strong>
              </div>
            </div>
            <BrandReveal src="/brand-preview.png" alt="The Finto home screen, showing balances and recent activity" />
            <Link to="/case-study" style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.75)' }}>
              Read the full case study →
            </Link>
          </div>
        </aside>

        <main className="login-form-wrap">
          {user ? (
            <div className="success-panel">
              <div className="success-badge">✓</div>
              <h1>Welcome back, {user.displayName}</h1>
              <p>
                This is a portfolio demo — sign-in is real (it checked your credentials against a seeded
                account), but the dashboard beyond this point isn't wired up here. Here's what it looks like.
              </p>
              {primaryAccount && (
                <div className="success-balance">
                  <span>Available balance</span>
                  <strong className="tnum">{primaryAccount.available.formatted}</strong>
                </div>
              )}
              <div className="success-preview">
                <img src="/brand-preview.png" alt="The Finto home screen" />
              </div>
              <Link to="/case-study" className="btn btn-ghost btn-block">
                Read the case study
              </Link>
            </div>
          ) : (
            <form className="login-form" onSubmit={submit}>
              <h1>Welcome back</h1>
              <p className="login-sub">Sign in to your Finto account.</p>

              {error && (
                <div className="alert alert-err" role="alert">
                  {error}
                </div>
              )}

              <div className="field">
                <label className="label" htmlFor="identifier">
                  Email, phone or @handle
                </label>
                <input
                  id="identifier"
                  className={`input${error ? ' err' : ''}`}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="password">
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    className={`input${error ? ' err' : ''}`}
                    type={shown ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    style={{ paddingRight: 50 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShown((s) => !s)}
                    aria-label={shown ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: 6,
                      top: 6,
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      display: 'grid',
                      placeItems: 'center'
                    }}
                  >
                    <EyeIcon off={shown} color="var(--muted)" />
                  </button>
                </div>
              </div>

              <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
              </button>

              <p className="login-hint">
                Demo account — <strong>sofia@marengo.studio</strong> with{' '}
                <strong>sofia2026-finto</strong>
              </p>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
