import { Link } from 'react-router-dom';

const REPO_URL = 'https://github.com/bellamarbellaa/Finto-Payment-App-in-Claude-Code';

const GALLERY: { src: string; caption: string }[] = [
  { src: '/screenshots/home-desktop.png', caption: 'Home — balance and quick actions, desktop' },
  { src: '/screenshots/activity-desktop.png', caption: 'Activity — transactions grouped by day' },
  { src: '/screenshots/pay-mobile.png', caption: 'Sending money with the amount keypad' },
  { src: '/screenshots/cards-mobile.png', caption: 'Card controls — freeze, limits, spending' },
  { src: '/screenshots/accounts-mobile.png', caption: 'Multi-currency account balances' },
  { src: '/screenshots/send-mobile.png', caption: 'Confirming a payment' }
];

export function Landing() {
  return (
    <div>
      <nav className="site-nav">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div className="login-mark">F</div>
          <strong style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.02em' }}>Finto</strong>
        </Link>
        <div className="site-nav-links">
          <a className="btn btn-ghost btn-sm" href={REPO_URL} target="_blank" rel="noreferrer">
            View source
          </a>
          <Link className="btn btn-primary btn-sm" to="/">
            Try the sign-in
          </Link>
        </div>
      </nav>

      <header className="hero">
        <h1>A fictional banking app, built end to end with Claude Code</h1>
        <p>
          Finto lets people hold balances across multiple currencies, send and request money, pay
          through QR codes, and manage cards — across a Fastify/Postgres backend, a React web app,
          and a React Native mobile app, all sharing one API and one set of types.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/">
            Try the sign-in demo
          </Link>
          <a className="btn btn-ghost" href={REPO_URL} target="_blank" rel="noreferrer">
            Read the source
          </a>
        </div>
        <div className="hero-stats">
          <div>
            <span>Design</span>
            <strong>15 original screens</strong>
          </div>
          <div>
            <span>Backend</span>
            <strong>Fastify · Postgres</strong>
          </div>
          <div>
            <span>Web</span>
            <strong>React 19 · Vite</strong>
          </div>
          <div>
            <span>Mobile</span>
            <strong>Expo · React Native</strong>
          </div>
          <div>
            <span>Testing</span>
            <strong>53 tests</strong>
          </div>
        </div>
      </header>

      <section className="section">
        <h2>What it does</h2>
        <p>
          A working product prototype, not just a UI mockup — built out into real financial
          infrastructure underneath.
        </p>
        <div className="build-grid">
          <div className="build-card">
            <h3>Hold 14 currencies</h3>
            <p>Balances across multiple accounts, each with its own IBAN-style reference and status.</p>
          </div>
          <div className="build-card">
            <h3>Send &amp; request money</h3>
            <p>To contacts or @handles, or with a shareable QR code that settles instantly Finto-to-Finto.</p>
          </div>
          <div className="build-card">
            <h3>Manage cards</h3>
            <p>Freeze a card, set a monthly spending limit, and control online or international payments.</p>
          </div>
          <div className="build-card">
            <h3>Real-time sync</h3>
            <p>Web and mobile activity stay in sync through one API, over a live WebSocket connection.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>A few things built under the hood</h2>
        <p>The part that doesn't show up in a screenshot — the financial plumbing had to be real.</p>
        <div className="build-grid">
          <div className="build-card">
            <h3>Precise money handling</h3>
            <p>
              Amounts are stored as integer minor units, never JavaScript floats:{' '}
              <code>parseAmount("240.50") → 24050n</code>.
            </p>
          </div>
          <div className="build-card">
            <h3>Double-entry ledger</h3>
            <p>
              Every money movement is a balanced ledger entry, not just a balance field — so two
              payments can never overdraw the same account.
            </p>
          </div>
          <div className="build-card">
            <h3>Safe payment retries</h3>
            <p>Idempotency keys mean retrying a request after a network failure never double-charges.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>See it</h2>
        <p>Screens from the real, running app.</p>
        <div className="gallery">
          {GALLERY.map((item) => (
            <figure className="gallery-item" key={item.src}>
              <img src={item.src} alt={item.caption} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="cta-panel">
        <div className="cta-panel-inner">
          <h2>Try the sign-in</h2>
          <p>
            The Login screen here is a real, working demo — it checks your credentials against a
            seeded account, with the same brand animation as the actual app.
          </p>
          <Link className="btn btn-primary" to="/">
            Sign in as the demo account
          </Link>
        </div>
      </div>

      <footer className="site-footer">
        <span>Finto — a portfolio case study. Not a real bank.</span>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
      </footer>
    </div>
  );
}
