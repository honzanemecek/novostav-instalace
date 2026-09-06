---
name: architecture
description: Use when making structural changes in this repo - adding features, domains, components, collections, blocks, or shadcn components, moving files, or deciding where new code goes. Defines the domain-driven layout and its boundary rules.
---

# Project Architecture: Domain-Driven Payload/Next.js

## Layout

```
src/
  app/        # Next.js routes ONLY — thin, no logic. Delegates to domain page components.
  domains/    # layout, pages, posts, media, users, search, forms — self-contained, deletable units
  shared/     # ui/ (registry CLI output ONLY; ui/motion/ = motion-primitives),
              # components/, utils/, hooks/, config/ (site identity in config/site.ts)
  payload/    # payload.config.ts, payload-types.ts, fields/, access/, hooks/, plugins/,
              # components/ (admin-only UI), migrations/, seed/
```

## Domain anatomy

Every domain follows this skeleton, omitting folders it does not need:

```
domains/<name>/
  index.ts          # PUBLIC API — main barrel: UI components, page components, queries
  client.ts         # PUBLIC API — client-safe exports (when needed)
  config.ts         # PUBLIC API — build-time exports: block configs, plugin instances (when needed)
  collection.ts     # Payload collection config (collections/ dir if several; global configs likewise)
  blocks/           # domain-owned blocks: config + React component colocated
  pages/            # full page components consumed by app/ routes
  ui/               # domain components (PostCard, PostHero, …)
  queries/          # ALL data access via Payload Local API
  utils/ hooks/ providers/   # domain helpers, Payload hooks, React providers
```

`index.ts` is the main barrel (UI components, page components, queries). `client.ts`
exists when a client component in another domain needs something from this domain
(currently: `layout/client.ts` exports `useHeaderTheme`) — importing a barrel that also
exports server components from a client component would drag the Payload runtime into
the client bundle. `config.ts` exists for build-time exports — Payload block configs and
configured plugin instances (currently: `forms/config.ts` exports `FormBlockConfig` and
`formsPlugin`; `posts/config.ts` exports `ArchiveBlockConfig`; `search/config.ts` exports
`searchPluginConfig`) — so that config consumers (`payload.config.ts`, other domains'
collection configs) don't pull React component trees into the Payload CLI's module
graph, which breaks `generate:types`/`generate:importmap` with scss import errors.

## Boundary rules (ESLint-enforced, eslint.config.mjs)

1. Cross-domain imports ONLY via the domain's entry points `@/domains/<name>`,
   `@/domains/<name>/client`, `@/domains/<name>/config` — anything deeper is a lint error.
2. Inside a domain, use RELATIVE imports (alias self-imports also trip the rule).
3. `shared/` never imports `domains/` or `app/`. Nothing imports `app/`.
4. Exemption: `src/payload/**` may deep-import domain collection/global/plugin configs
   (build-time registration).
5. Query rule: frontend code never calls `getPayload()` inline — data access goes through
   the owning domain's `queries/` (plugin-owned collections like redirects: `shared/utils/`).
6. Payload block configs / plugin configs consumed by other domains or `payload/plugins`
   go through `config.ts`; client hooks consumed by other domains' client components go
   through `client.ts`.

## Rich text and domain blocks

Content-primitive blocks embeddable in rich text (Banner, Code, MediaBlock) live in
`shared/components/RichText/blocks/`. RichText registers only those converters. If a
domain block must render inside rich text, the call site in that domain passes its
converter via RichText's `blockConverters` prop — shared never references a domain.

## shadcn / registry workflow

- `shared/ui/` is EXCLUSIVELY registry CLI output. Add components with
  `pnpm dlx shadcn@latest add <component>` — never write or edit files there by hand.
- `shared/ui/motion/` holds motion-primitives components
  (`pnpm dlx shadcn@latest add @motion-primitives/<name>`). Same read-only rule; the
  only sanctioned hand-edits are the React 19 / motion 13 compatibility fixes documented
  in the `motion` skill.
- Registries are declared in `components.json` under `registries`
  (`@motion-primitives` → `https://motion-primitives.com/c/{name}.json`).
- Theme via CSS variables in `src/app/(frontend)/globals.css`, not by editing generated files.
- `components.json` aliases already target `@/shared/ui`, `@/shared/components`, `@/shared/utils/ui`.
- Details: the `shadcn` skill (tokens, registries, CLI flags) and the `motion` skill.

## Where does new code go? (decision table)

| You are adding… | Put it in |
|---|---|
| A new route/URL | `app/` (thin file) + a page component in the owning domain's `pages/` |
| A data fetch | the owning domain's `queries/` |
| A collection/global + its blocks/hooks | its domain (`collection.ts`, `blocks/`, `hooks/`); register in `payload/payload.config.ts` |
| A component used by ONE domain | that domain's `ui/` |
| A component used by 2+ domains, not domain-flavored | `shared/components/` |
| A content-primitive block embeddable in rich text | `shared/components/RichText/blocks/` |
| A shadcn primitive | `shared/ui/` via the CLI |
| A motion-primitives component | `shared/ui/motion/` via the CLI |
| An animated composition used by 2+ domains | `shared/components/` |
| A pure helper / generic React hook | `shared/utils/` / `shared/hooks/` |
| Admin-panel-only UI | `payload/components/` |
| Plugin wiring for a domain-owned feature (forms, search) | that domain's `config.ts`, composed via `@/domains/<name>/config` in `payload/plugins/index.ts` |
| Plugin wiring with no domain (seo, redirects, nested-docs) | `payload/plugins/` |

## Adding a new domain (checklist)

1. `src/domains/<name>/` with `index.ts` (start empty: `export {}`).
2. `collection.ts` (or `collections/`) + Payload hooks in `hooks/`.
3. Register in `src/payload/payload.config.ts` (deep import — allowed there).
4. Queries in `queries/`, page components in `pages/`, thin routes in `app/`.
5. Export ONLY what other domains/app need from `index.ts`.
6. Need cross-domain build-time exports (block config, plugin)? Put them in `config.ts`.
   Client-hook exports? `client.ts`.
7. `pnpm generate:types && pnpm generate:importmap && pnpm lint && pnpm build`.

## After structural changes

Run: `pnpm generate:types`, `pnpm generate:importmap` (if admin component paths changed),
`pnpm lint`, `pnpm build`. Admin component paths are strings (e.g.
`'@/domains/layout/header/RowLabel#RowLabel'`) — grep for them when moving files.
