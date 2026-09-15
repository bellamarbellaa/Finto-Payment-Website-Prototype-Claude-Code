# Finto — A Mobile Banking Product Built With an AI Agent

Designed and developed a **full mobile-banking web app (13+ screens)** for **Finto**, using **Claude as an AI-assisted development partner**, turning a product concept — pay, send, request, freeze a card, review activity — into a working, interactive digital experience.

This is a standalone showcase version: it runs entirely on seeded, in-browser demo data, so anyone can log in and use every feature without a real backend, database, or bank connection behind it.

## How to access

**[finto-showcase.vercel.app/login](https://finto-showcase.vercel.app/login)**

Demo login (pre-filled on the screen):
- Email: `sofia@marengo.studio`
- Password: `sofia2026-finto`

## What I did

- Directed Claude through the full build, translating product requirements, UX flows, and visual design decisions into functional React, TypeScript, and CSS.
- Designed a consistent, on-brand UI/UX system across the entire app — Home, Pay, Send, Request Money, Activity, Cards, Card Controls, Profile, Security, Notifications, Help, and Scan — including a branded, animated login screen.
- Built realistic product behavior on mock data: sending money, freezing/unfreezing a card, opening a new account, live-updating balances and activity — all persisted locally so the demo survives a page reload.
- Iteratively prompted the AI agent to refine responsiveness, spacing, and visual consistency across desktop and mobile.
- Set up automated tests to verify the app's core logic (money formatting, account balances, and every mock banking action) behaves correctly.
- Deployed the finished product to Vercel for public, shareable access.

## Screens & components

| Area | Screens |
|---|---|
| Access | Login (animated brand panel) |
| Home & Money Movement | Home, Pay, Send Amount, Request Money, Scan |
| Accounts | Accounts, Activity, Transaction Detail |
| Cards | Cards, Card Controls |
| Account Management | Profile, Security, Notifications, Help |

Shared building blocks — a persistent app shell/navigation, a reusable design system (buttons, cards, inputs, modals), and an auth layer — carry the same look and behavior across every screen.

## Stack

React 19 · Vite · TypeScript · React Router · Framer Motion (login animation)

## Running it locally

```bash
npm install
npm run dev      # http://localhost:5174
npm test         # verifies money formatting, account data, and every banking action
npm run build
```
