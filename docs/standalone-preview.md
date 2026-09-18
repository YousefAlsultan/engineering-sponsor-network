# Standalone preview

This milestone ports `/sponsors` and `/` from the original files in `softr-snapshots/`. Those snapshots are unchanged. `/directory` redirects to `/sponsors`.

## Run locally

Use Node.js 22.6 or newer and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

Open http://localhost:3000/sponsors or http://localhost:3000/.

For development: `pnpm dev`. Validation: `pnpm typecheck`, `pnpm test`, and `pnpm test:e2e` after installing Playwright Chromium (`pnpm exec playwright install chromium`).

## What is included

The existing hero, typography, wording, section order, glow/grid treatment, sponsor cards, partner section, responsive layouts, search, filters, detail dialogs and application screens are retained. The saved Softr sponsors headline is restored. The two snapshots have different original card styles; each page retains its own style. The Softr host toolbar and platform badge are not part of the standalone block.

The server loads a checked export of 24 published, verified sponsor programs. Its public field allowlist excludes private contacts, applicant records and moderation data. This is a static export, not live Notion synchronization. Formal partner placement requires an explicit Partner relationship. Source checks never imply partnership.

Programs without a contact route link to their official program. Application screens remain available for records with a route, but submission is explicitly disabled until durable storage and sponsor delivery are configured. Nothing is saved or emailed by this preview. Auth, moderator pages, company dashboards and subscriptions are subsequent milestones.

## Validation

Production build and TypeScript checks passed. Three data tests passed. Eight desktop/mobile browser test cases passed (search, filters, archive reset, dialogs, redirect and overflow). The Windows browser runner required interruption during server cleanup after all cases reported success.

External images and sponsor websites still require internet access, as in the original snapshots.
