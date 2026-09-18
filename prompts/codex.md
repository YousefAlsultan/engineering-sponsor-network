# Codex prompt

Rebuild Engineering Sponsor Network from this repository.

First read:
- AGENTS.md
- docs/current-softr-map.md
- docs/product-spec.md
- docs/database-schema.md
- softr-snapshots/sponsors.tsx
- softr-snapshots/home.tsx

Your first milestone is a faithful standalone implementation of the current Softr website, not a redesign.

Use Next.js + TypeScript + Tailwind + shadcn/ui + lucide-react unless the existing repository evolves to another stack.

Translate Softr-only datasource/user hooks into a server-side data layer. Never expose Notion or email credentials client-side.

Match the existing:
- dark engineering hero
- grid texture
- blue/violet glow
- pastel sponsor cards
- equal card heights
- button alignment
- partner section
- search/filter behavior
- sponsor detail/application flow
- moderator dashboards
- responsive behavior

Do not add new features until the visual/behavioral mirror is working.
