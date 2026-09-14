# Finto — standalone demo

A fully working copy of [Finto](https://github.com/bellamarbellaa/Finto-Payment-App-in-Claude-Code)'s web app — every screen (Home, Pay, Activity, Cards, Profile, Security, and the rest) — running entirely on seeded, in-browser data instead of the real backend.

It has no backend, no database, and no connection to the real Finto project's Supabase/Render infrastructure. Signing in, sending money, freezing a card, opening a balance — all of it works, and all of it is local to your browser (persisted to `localStorage`, so it survives a reload).

## Stack

React 19 · Vite · TypeScript · React Router · Framer Motion (login brand-panel animation)

## Running it

```bash
npm install
npm run dev      # http://localhost:5174
npm test         # Vitest — money formatting, the local store, and every mock API endpoint
npm run build
```

## Demo credentials

`sofia@marengo.studio` / `sofia2026-finto` — pre-filled on the Login screen.

## Where the code came from

`src/lib/mock/` is a from-scratch mock implementation of Finto's real API contract (`finto-backend/packages/api-client`) — same types, same error codes, same double-entry-style balance updates (integer minor units, never floats), same realtime-event shape the real app's `LiveProvider` expects. Everything above it — every screen, `Shell.tsx`, `lib/auth.tsx`, `lib/live.tsx`, the full design system — is ported directly from `finto-web`, largely unmodified, because it never needed to know its data isn't coming from a server.
