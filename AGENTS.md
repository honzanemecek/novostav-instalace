# Agent instructions

## Project context

Read [docs/PROJECT.md](docs/PROJECT.md) first — it describes what this
project is. (If it still contains placeholder markers, this clone has not
been initialized yet: run the `/setup` skill.)

**Czech is the primary locale**; English lives under `/en`. The admin UI is
translated (cs default). Project-specific admin terms go in
`src/payload/i18n/customTranslations.ts`. No content field is `localized: true`
by default — `/en` currently serves the `cs` values via Payload's locale
fallback; mark a field `localized: true` to translate it, the routing/query/
revalidation plumbing already handles both locales. Invariant: a `cs` page
slugged `en` would be shadowed by the `/en` route subtree — don't use that
slug at the top level.

## Stack

Payload CMS 3 + Next.js (App Router), deployed on Vercel. Neon Postgres,
Vercel Blob, Tailwind 4, shadcn. Domain-driven layout.

## Structure (the short version)

- `src/app/` — thin Next.js routes only; they delegate to domain page components.
- `src/domains/{layout,pages,posts,media,users,search,forms}` — self-contained
  domains: collection config, blocks, UI, queries, pages together.
- `src/shared/` — `ui/` (shadcn CLI output only), `components/`, `utils/`,
  `hooks/`, `config/` (site identity in `config/site.ts`).
- `src/payload/` — payload.config.ts, generated types, fields, access, plugins,
  admin components, i18n, migrations, seed.

## Core rules

1. Cross-domain imports only via `@/domains/<name>` (or its `client`/`config`
   entry points) — ESLint-enforced.
2. `shared/` never imports `domains/` or `app/`; nothing imports `app/`.
3. All data access through a domain's `queries/` — never inline `getPayload()`
   in frontend code.
4. `shared/ui/` is shadcn-CLI-generated only: `pnpm dlx shadcn add <component>`.
5. Site identity (name, descriptions, domain, OG image) lives only in
   `src/shared/config/site.ts` — never hardcode it elsewhere.

**Before any structural change (new feature, domain, collection, component,
file move), read the architecture skill: `.claude/skills/architecture/SKILL.md`.**

## Commands

- `pnpm dev` / `pnpm build` / `pnpm lint`
- `pnpm generate:types` after schema changes; `pnpm generate:importmap` after
  moving admin components
- `pnpm test` (int via vitest + e2e via playwright)
