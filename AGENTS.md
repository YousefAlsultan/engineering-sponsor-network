# AGENTS.md

## Mission

Maintain and extend **SponSierra (Engineering Sponsor Network)**, a source-backed sponsorship marketplace for university engineering teams. The current Next.js UI is a redesigned standalone product.

## Non-negotiable first step

Before changing behavior, inspect the current components in `src/components/sponsierra-*`, the public sponsor data model, and the applicable tests. Keep the current website working and avoid regressions.

The old Softr design in `softr-snapshots/` is historical reference; do not revert the current founder-approved SponSierra interface to it. Do not replace the current look with a generic SaaS template.

## Fidelity requirements

Preserve:
- existing wording and information architecture unless a task explicitly changes them
- scarlet gradient sidebar and centered SponSierra header branding
- dark animated blueprint/CAD hero and engineering-grid textures
- light and dark page themes
- dark sponsor cards with readable type, service icons, and clear statuses
- consistent card heights and aligned CTAs
- source-check and company-confirmed trust concepts
- search, custom filter dropdowns, and favorites behavior
- sponsor detail experience
- proposal draft workflow without implying an application is submitted
- profile photo/post/like/comment demos clearly labeled browser-local
- responsive layouts
- reduced-motion and keyboard accessibility

## Technical note

The files in `softr-snapshots/` are archived Vibe Coding source and contain Softr-specific imports such as `@/lib/datasource`.

Current standalone UI components are in `src/components/`; do not reintroduce Softr-specific dependencies into the active pages.

The GitHub source retains `src/app/api/applications/route.ts` and a standard Next.js server build. The separately deployed Sites preview is a static export and has no shared-user backend. Do not present browser-local profile images, posts, likes, or comments as publicly shared data.

Recommended stack:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react

## Data security

The GitHub repository is public right now.

Never commit:
- API keys
- Notion integration tokens
- Softr secrets
- SMTP credentials
- private applicant records
- private moderation notes
- non-public sponsor contact data

## Business rules

- Teams are free in the current model.
- A source-check symbol means the sponsorship source was verified; it does not mean partnership.
- A company-confirmed badge requires an authorized company claim and moderator approval.
- Partner placement requires `Platform Relationship = Partner`.
- In-platform Apply should only be offered when a legitimate sponsor delivery/contact route exists.
- Otherwise show View Official Program.
- Paid placement must never secretly alter organic ranking.
- Expired programs should be archived, not deleted.

## Build order

1. Keep current homepage, directory, sponsor detail, matching, About, and Pricing routes working.
2. Maintain sponsor-source provenance, safe updates, archived listings, and tests.
3. Design secure team/company authentication and account ownership before enabling shared profiles.
4. Add persistent storage, moderation, and safe image uploads before making posts, comments, or likes public.
5. Integrate real subscription and application workflows only after appropriate validation and access controls exist.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
