# Standalone build plan

## Phase 1 — visual foundation
- create Next.js/TypeScript app
- add Tailwind, shadcn/ui, lucide-react
- recreate global typography, spacing, radii, neutral backgrounds, grid texture
- preserve the current Softr snapshots unchanged as reference

## Phase 2 — public sponsor directory
- translate `softr-snapshots/sponsors.tsx`
- connect read-only sponsor data through a server-side adapter
- preserve filters, partner section, card geometry, source-check indicators, date states, sponsor details

## Phase 3 — home
- translate `softr-snapshots/home.tsx`
- preserve hero and current discovery sections

## Phase 4 — applications
- implement structured application form
- write to Sponsorship Applications through a secure server-side route
- keep save state separate from email delivery state

## Phase 5 — roles/admin
- profile setup
- moderator applications
- moderator analytics
- company dashboard prototype
- subscriptions page

## Acceptance criterion
Side-by-side comparison should look like the current Softr website before new product redesign work begins.
