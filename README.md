# SponSierra — Engineering Sponsor Network

SponSierra is a sponsorship-discovery platform for **university engineering teams**. It connects teams exploring support with source-backed programs from companies and organizations.

This is the current Next.js source repository. The original Softr prototype is archived in `softr-snapshots/` for historical reference.

The website preview is at [SponSierra](https://engineering-sponsor-network-yousef-preview.yousefalsultan.chatgpt.site/). It is currently owner-private. **This GitHub repository and the hosted Sites source repository are separate:** committing to this GitHub repository does not automatically redeploy the preview.

## What is implemented today

- Scarlet/red SponSierra navigation, optional persistent dark mode, responsive menu, and animated engineering-blueprint homepage.
- Sponsor directory with search, animated resource categories, custom team/support dropdown filters, grid/list mode, source-backed details, and local favorites.
- Sponsor detail pages with official-source links and a copyable **proposal draft**. Drafts are **not submitted** to companies.
- Smart Match client-side questionnaire for finding relevant listed programs. It does not guarantee eligibility or funding.
- Team profile demo with editable identity, banner/avatar images, a post feed, likes, and comments. These are **browser-local demos, not shared accounts or public posts**.
- About and placeholder Pricing pages. Student teams are free in the current model; sponsor prices are concepts, not live checkout.
- Server-side application API route retained in this GitHub repository for future integration. The separate static Sites preview does not expose that API.

## What the product does

University teams such as Formula SAE, Baja SAE, rocketry, robotics, CubeSat, UAV, solar-car, autonomous-vehicle, concrete-canoe, steel-bridge, Chem-E-Car, and other engineering project teams can discover companies that support student engineering work through cash sponsorship, complimentary products, components, manufacturing, materials, electronics, software, technical services, travel support, competition support, discounts, and other in-kind help.

The core flow is:

```text
Engineering team
  -> find relevant sponsor programs
  -> filter by team / need / industry / geography / dates
  -> open sponsor profile
  -> check eligibility and source
  -> View Official Program
  -> optionally draft an introduction to the sponsor
```

## Current design and source of truth

**The current SponSierra site and its design choices are the visual source of truth.** Preserve the scarlet identity, dark blueprint hero, resource modules, high-contrast sponsor cards, readable icons, and responsive layouts unless a new task explicitly changes them.

The original Softr custom-block source remains in `softr-snapshots/`. It is historical context, not an instruction to revert the current design.

Keep trust language accurate: source-checked is **not** company-confirmed or partnered.

## Current visual language

- scarlet engineering branding with a dark animated CAD/blueprint hero
- light/dark page themes, responsive sidebar, and centered header branding
- high-contrast dark sponsor-card palettes and resource-type icon tooltips
- equal sponsor-card geometry and aligned buttons
- custom dropdowns, rounded panels, and interactive hover states
- Lucide engineering icons
- transparent source-check trust iconography
- responsive desktop/tablet/mobile behavior

## Important routes

| Route | Purpose |
| --- | --- |
| `/` | Home / primary discovery experience |
| `/sponsors` | Public sponsor directory |
| `/directory` | Legacy redirect |
| `/sponsors/[id]` | Source-backed sponsor detail and proposal draft |
| `/match` | Smart Match questionnaire |
| `/profile` | Editable, browser-local university team profile demo |
| `/about` | About SponSierra |
| `/pricing` | Early subscription concepts (not active) |

## Current data sources

The historical Softr app referenced two Notion databases:

1. **STEM Sponsor Database**
2. **Sponsorship Applications**

See `docs/database-schema.md`.

This standalone repository currently reads the checked public export from `data/sponsors.public.json`. Do not expose private Notion records, email delivery contacts, or moderation notes in the public export. The public-data tests enforce important boundaries.

## Run locally

Requires Node.js 22.6+ and pnpm.

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

The GitHub version uses the regular Next.js server build so the existing application API can remain. The separately hosted static preview uses `output: 'export'` and contains public, client-side functionality only.

## Start here in Codex

1. Read `AGENTS.md` and this README.
2. Inspect `src/components/sponsierra-shell.tsx` and `src/components/sponsierra-marketplace.tsx`.
3. Review `src/components/sponsierra-profile.tsx` for local-only demo behavior.
4. Read `docs/product-spec.md` and `docs/sponsor-verification.md` for business rules.
5. Before introducing shared profiles or posts, design authentication, access control, moderation, database storage, image storage, and user privacy.

## Public-repository safety

This repository is currently public. Do not commit API keys, Notion tokens, Softr credentials, email credentials, private user data, or bulk applicant data. Use environment variables for secrets.
