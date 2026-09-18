# AGENTS.md

## Mission

Recreate and extend **Engineering Sponsor Network** while preserving the current Softr design and behavior.

## Non-negotiable first step

Before changing design language, compare your implementation against the exact Softr source files in `softr-snapshots/`.

Do not replace the existing look with a generic SaaS template.

## Fidelity requirements

Preserve:
- existing wording unless a task explicitly changes copy
- section order
- dark engineering hero
- blue/violet glow treatment
- light neutral page background
- engineering grid textures
- pastel sponsor cards
- consistent card heights and aligned CTAs
- partner-company section
- source-check and company-confirmed trust concepts
- search/filter behavior
- sponsor detail experience
- structured sponsorship application flow
- responsive layouts
- moderator/admin visual style

## Technical note

The files in `softr-snapshots/` are exact Vibe Coding source and contain Softr-specific imports such as `@/lib/datasource`.

For a standalone implementation, translate those dependencies rather than deleting the UI.

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

1. Visual mirror of `/sponsors`
2. Visual mirror of `/`
3. Sponsor detail/application flow
4. Auth/profile pages
5. Moderator applications and stats
6. Company dashboard prototype
7. Subscription page
8. Only then add new features

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
