# Finto — portfolio showcase

A standalone case-study site for [Finto](https://github.com/bellamarbellaa/Finto-Payment-App-in-Claude-Code), a fictional multi-currency banking app built with Claude Code.

This is intentionally **not** the real app — it's a lighter portfolio page: a description of what was built, real screenshots from the actual product, and one genuinely working piece, the Login screen, which checks your credentials against a seeded demo account and shows a preview of the dashboard on success.

It has no backend, no database, and no connection to the real Finto project's Supabase/Render infrastructure — everything here runs on static, seeded data in the browser.

## Stack

React 19 · Vite · TypeScript · React Router · Framer Motion (for the login brand-panel animation)

## Running it

```bash
npm install
npm run dev      # http://localhost:5174
npm test         # Vitest — money formatting, the local store, and the sign-in check
npm run build
```

## Demo credentials

`sofia@marengo.studio` / `sofia2026-finto` — pre-filled on the Login screen.

## Where the code came from

The `src/lib/mock/` files (`money.ts`, `store.ts`, `data.ts`, `auth.ts`) started life on an abandoned `demo-mode` branch of the real Finto repo, where they were built and unit-tested as part of a (since-reconsidered) plan to add fake-data support directly into the real web app. They were ported here — trimmed down to just what a login-only demo needs — once the decision was made to keep the real app untouched and build the portfolio site as a fully separate project instead.
