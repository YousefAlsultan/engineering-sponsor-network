# Engineering Sponsor Network

Engineering Sponsor Network is a sponsorship-discovery platform for **university engineering teams**.

This repository is the engineering handoff for the current Softr prototype. Its first job is to preserve the current Softr website faithfully so Codex can rebuild or extend it without guessing.

## What the product does

University teams such as Formula SAE, Baja SAE, rocketry, robotics, CubeSat, UAV, solar-car, autonomous-vehicle, concrete-canoe, steel-bridge, Chem-E-Car, and other engineering project teams can discover companies that support student engineering work through cash sponsorship, complimentary products, components, manufacturing, materials, electronics, software, technical services, travel support, competition support, discounts, and other in-kind help.

The core flow is:

```text
Engineering team
  -> find relevant sponsor programs
  -> filter by team / need / industry / geography / dates
  -> open sponsor profile
  -> check eligibility and source
  -> Apply for Sponsorship when a valid route exists
  -> otherwise View Official Program
```

## Source of truth

**The current Softr app is the visual source of truth.**

Exact current custom-block source is stored in `softr-snapshots/`.

Do not redesign the site before first matching those snapshots.

## Current visual language

- premium Apple-inspired spacing and typography
- dark engineering hero with blue/violet ambient glow
- off-white/light-gray page backgrounds
- subtle blueprint / engineering grid texture
- pastel sponsor-card backgrounds
- equal sponsor-card geometry and aligned buttons
- rounded modern panels and pill controls
- restrained shadows and hover lift
- Lucide engineering icons
- source-check trust iconography
- dedicated Partner Companies section above normal directory
- responsive desktop/tablet/mobile behavior

## Important routes

| Route | Purpose |
| --- | --- |
| `/` | Home / primary discovery experience |
| `/sponsors` | Public sponsor directory |
| `/directory` | Legacy redirect |
| `/profile-setup` | Account profile setup |
| `/company/dashboard` | Company dashboard prototype |
| `/team/dashboard` | Team dashboard shell |
| `/subscriptions` | Pricing / business-model preview |
| `/admin/applications` | Moderator application dashboard |
| `/admin/stats` | Moderator analytics |
| `/login` | Login |
| `/sign-up` | Signup |

## Current data sources

The Softr app is backed by two Notion databases:

1. **STEM Sponsor Database**
2. **Sponsorship Applications**

See `docs/database-schema.md`.

## Start here in Codex

1. Read `AGENTS.md`.
2. Read `docs/current-softr-map.md`.
3. Read `docs/product-spec.md`.
4. Inspect `softr-snapshots/sponsors.tsx`.
5. Inspect `softr-snapshots/home.tsx`.
6. Recreate the current UI before proposing redesigns.

## Public-repository safety

This repository is currently public. Do not commit API keys, Notion tokens, Softr credentials, email credentials, private user data, or bulk applicant data. Use environment variables for secrets.
