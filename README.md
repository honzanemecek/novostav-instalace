# payload-next-starter

Personal starter template: Payload CMS 3 + Next.js (App Router), domain-driven
structure, Czech-first bilingual (cs default, en at `/en`) with a translated
admin, deployed on Vercel with Neon Postgres and Vercel Blob.

## New project

1. `gh repo create <name> --template <owner>/payload-next-starter --private --clone`
2. Open the clone in Claude Code and run the **`/setup`** skill. It will
   personalize the site, link Vercel, provision Neon + Blob, migrate + seed the
   database, verify local dev, and deploy to production.

## Manual development (after setup)

- `pnpm dev` — local dev at http://localhost:3000 (cs) / `/en` (English), admin
  at `/admin`
- `pnpm test` — vitest integration + playwright e2e
- `pnpm generate:types` — after any collection schema change

## What's inside

- Domain-driven `src/` layout (see `AGENTS.md`), ESLint-enforced boundaries
- Payload plugins: SEO, search, redirects, nested docs, form builder, MCP
- Localization: `cs` (default) at `/` + `en` at `/en` — routes and admin UI;
  mark content fields `localized: true` to translate them (the query/link/
  revalidation plumbing already supports it); per-project admin terms via
  `src/payload/i18n/customTranslations.ts`
- Site identity centralized in `src/shared/config/site.ts`
- AI-ready: `.mcp.json`, `AGENTS.md`/`CLAUDE.md`, `.claude/skills/`
