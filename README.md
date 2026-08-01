# Novostav - Instalace

Complete plumbing, heating and gas installations for new builds and
renovations.

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
