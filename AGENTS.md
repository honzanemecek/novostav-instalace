# Agent instructions

## The project

**Novostav - Instalace** (`novostav-instalace.cz`) — presentation website for a Czech
family building & installation firm, trading since 1993. **Not plumbing-only**: they sell
stavební práce, střechy, elektroinstalace, vodoinstalace, topení/plyn and podlahy — one
contractor for a whole house. Read [docs/PROJECT.md](docs/PROJECT.md) for the full brief,
including which facts are verified and which are still open. (If it still contains
placeholder markers, this clone has not been initialized: run the `/setup` skill.)

Site identity — name, descriptions, production domain, OG image — lives **only** in
`src/shared/config/site.ts`. Never hardcode it anywhere else.

Source material for the redesign: `old_website_photos/` (real photos of completed work —
use them; no stock imagery).

## Stack

Payload CMS 3 (`3.84.1`, all `@payloadcms/*` pinned together) + Next.js 16 App Router +
React 19.2, on Vercel. Neon Postgres via `@payloadcms/db-vercel-postgres`, Vercel Blob for
media, Tailwind 4 (CSS-first), shadcn/ui, motion 13 + motion-primitives. Domain-driven
layout. pnpm.

## Locale: Czech first

**Czech is the primary locale**; English lives under `/en`. Payload is configured
`locales: ['cs', 'en'], defaultLocale: 'cs'` and the admin UI is translated (cs default).
Project-specific admin terms go in `src/payload/i18n/customTranslations.ts`.

No content field is `localized: true` by default — `/en` currently serves the `cs` values
via Payload's locale fallback; mark a field `localized: true` to translate it, the
routing/query/revalidation plumbing already handles both locales.

Invariant: a `cs` page slugged `en` would be shadowed by the `/en` route subtree — don't
use that slug at the top level.

Write UI copy in Czech first. Use `localizeHref(path, locale)` from
`@/shared/utils/locale` for internal links; never hand-concatenate `/en`.

## Structure (the short version)

- `src/app/` — thin Next.js routes only; they delegate to domain page components.
- `src/domains/{layout,pages,services,projects,posts,company,media,users,search,forms}` —
  self-contained domains: collection config, blocks, UI, queries, pages together.
- `src/payload/blocks/` — the block palettes (`pageLayoutBlocks`, `serviceLayoutBlocks`,
  `projectLayoutBlocks`). Three collections share one library, and `src/payload/` is the
  layer allowed to reach across domains, so the lists are assembled there.
- `src/shared/` — `ui/` (registry CLI output only; `ui/motion/` = motion-primitives),
  `components/`, `utils/`, `hooks/`, `config/` (site identity in `config/site.ts`).
- `src/payload/` — payload.config.ts, generated types, fields, access, plugins, admin
  components, i18n, migrations, seed.

## Content model

| Collection | URL | What it is |
|---|---|---|
| `pages` | `/<slug>` | Anything, composed from the full block palette |
| `services` | `/sluzby/<slug>` | One trade. **Also the taxonomy for projects** |
| `projects` | `/realizace/<slug>` | A completed job — the portfolio. Tagged with services |
| `posts` | `/posts/<slug>` | Editorial articles, with their own `categories` |

`/realizace/sluzba/<service-slug>` is the portfolio filtered to one trade — a real URL,
not client-side state, so every filtered view is crawlable and shareable.

Pages, services and projects are all **composed of blocks**; the client changes any page
without a deploy. Add a block once in `src/payload/blocks/index.ts` and register its
component in `pages/blocks/RenderBlocks.tsx` — the palettes pick it up everywhere.

## Core rules

1. Cross-domain imports only via `@/domains/<name>` (or its `client`/`config` entry
   points) — ESLint-enforced.
2. `shared/` never imports `domains/` or `app/`; nothing imports `app/`.
3. All data access through a domain's `queries/` — never inline `getPayload()` in
   frontend code.
4. `src/shared/ui/` is registry-CLI-generated only: `pnpm dlx shadcn@latest add <component>`
   (or `@motion-primitives/<name>`). Never hand-edit it.
5. Site identity lives only in `src/shared/config/site.ts`; business facts (phone,
   addresses, IČO, founding year) live only in the `company` global — never in markup.
6. Anything the client should be able to change without a deploy is a **Payload field or
   block**, not hardcoded markup. This is a CMS site.
7. Design and check every screen in **both** light and dark theme (`[data-theme='dark']`).

## Skills — read the relevant one BEFORE you start

| Skill | Read it when |
|---|---|
| `architecture` | any structural change: new feature, domain, collection, component, block, file move, "where does this go" |
| `payload` | collections, globals, blocks, fields, access, hooks, drafts/live preview, localization, Local API queries, migrations, seed |
| `nextjs` | routes, layouts, RSC vs client, async params, caching/revalidation, metadata, images, draft mode, the cs//en route split |
| `frontend-design` | designing or building any user-facing UI — layout, typography, colour, states, accessibility, page anatomy |
| `shadcn` | adding/styling shadcn components, `components.json`, registries, the Tailwind 4 token layer in `globals.css` |
| `motion` | animation of any kind — scroll reveals, hover effects, counters, galleries, before/after sliders |
| `neon` / `neon-postgres` | database provisioning, branching, connection strings |
| `setup` | first run in a fresh clone, or re-running a failed setup |

Skill files live in `.claude/skills/<name>/SKILL.md` and are plain Markdown — readable by
any agent, not just Claude Code.

## MCP servers (`.mcp.json`)

- `nextjs-docs` — search the Next.js 16 docs. Prefer it over memory for current API shapes.
- `next-devtools` — live logs, errors and route context from a running `pnpm dev`.
- `shadcn` — search/inspect registry items and generate add commands.
- Payload also exposes its own MCP plugin over `pages`, `posts` and `categories`.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm lint` (Turbopack; `next lint` no longer exists in
  Next 16, `next build` does not lint — run `pnpm lint` yourself)
- `pnpm generate:types` after schema changes; `pnpm generate:importmap` after moving admin
  components
- `pnpm payload migrate:create <name>` / `pnpm payload migrate` for Postgres schema changes
- `pnpm test` (int via vitest + e2e via playwright)
- `npx tsc --noEmit -p tsconfig.json` for a fast typecheck without a full build

## Definition of done

`pnpm generate:types` (if schema changed) → `pnpm generate:importmap` (if admin component
paths changed) → `npx tsc --noEmit` → `pnpm lint` → `pnpm build`. Zero errors. Warnings
that predate your change are acceptable; new ones are not.

Watch out: `pnpm add` in this repo rewrites `pnpm-workspace.yaml`'s `allowBuilds:` block to
placeholder strings. Check `git diff pnpm-workspace.yaml` and revert it if that happened.
