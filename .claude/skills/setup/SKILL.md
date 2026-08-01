---
name: setup
description: Initialize this fresh payload-next-starter clone — personalize site identity, link Vercel, provision Neon Postgres + Blob, migrate + seed the database, verify local dev, and deploy to production. Use on first run in a new project, or rerun after a failed setup (all phases are idempotent).
---

# Project setup

Take this fresh clone to a personalized, locally running, production-deployed
state. Work through the phases **in order**. Every phase starts by checking
whether its work is already done — if so, say so and move on. Never continue
past a failed phase; report what failed and how to fix it, then stop.

## Phase 1 — Preflight

Check, in one pass:

```bash
command -v pnpm && command -v vercel && command -v gh
vercel whoami
gh auth status
git rev-parse --is-inside-work-tree
```

All four must succeed. If `vercel whoami` fails, have the user run
`! vercel login`. If `gh auth status` fails: `! gh auth login`. Then:

```bash
pnpm ii
```

## Phase 2 — Personalize

Skip this phase if `docs/PROJECT.md` no longer contains `Filled by /setup`.

Ask the user (one question at a time):
1. Site name (e.g. "Jana Nováková")
2. One-sentence site description in Czech
3. One-sentence site description in English
4. Production domain (e.g. `jananovakova.cz`)
5. A short paragraph describing the project (for docs/PROJECT.md)

Then write:
- `src/shared/config/site.ts` — set `name`, `description.cs`, `description.en`,
  `domain` to the answers (leave `ogImage` unchanged)
- `package.json` — set `"name"` to the kebab-cased site domain without TLD
  (e.g. `jananovakova`)
- `README.md` — replace the H1 and the first paragraph with the site name and
  English description; delete the "New project" section
- `docs/PROJECT.md` — replace the whole file:

  ```markdown
  # <Site name>

  **Site name:** <name>
  **Production domain:** <domain>

  ## What this project is

  <the user's project description paragraph>
  ```

Run `pnpm lint` to confirm nothing broke.

## Phase 3 — Link Vercel

Skip if `.vercel/project.json` exists.

```bash
vercel link
```

Let the user answer the interactive prompts (suggest they run `! vercel link`
if the interactive flow doesn't work through the tool). Project name should
match `package.json` name.

## Phase 4 — Provision

Check what already exists first:

```bash
vercel env ls
```

**Neon Postgres** — skip if `DATABASE_URL` or `POSTGRES_URL` is already listed:

```bash
vercel integration add neon
```

This is a browser flow — tell the user to accept the defaults (free plan). It
creates the Neon project + database and attaches its env vars to the Vercel
project.

**Vercel Blob** — skip if `BLOB_READ_WRITE_TOKEN` is already listed:

```bash
vercel blob store add <package-json-name>-media
```

**Secrets** — for each of `PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET`
that is not already listed, generate and attach to all three environments:

```bash
SECRET=$(openssl rand -hex 32)
printf '%s' "$SECRET" | vercel env add <NAME> production
printf '%s' "$SECRET" | vercel env add <NAME> preview
printf '%s' "$SECRET" | vercel env add <NAME> development
```

## Phase 5 — Pull env and verify DB connectivity

```bash
vercel env pull .env.local
```

Then verify `.env.local` contains `BLOB_READ_WRITE_TOKEN` and a Postgres URL.
The app reads `POSTGRES_URL`. If the Neon integration only attached
`DATABASE_URL`, bridge it — append to `.env.local`:

```bash
echo "POSTGRES_URL=$(grep '^DATABASE_URL=' .env.local | cut -d= -f2-)" >> .env.local
```

and attach `POSTGRES_URL` with the same value to all three Vercel environments
via `vercel env add` (same pattern as Phase 4 secrets).

Verify connectivity before touching the schema:

```bash
pnpm payload migrate:status
```

If this cannot connect, stop and report — do not proceed to Phase 6.

## Phase 6 — Migrate and seed

```bash
pnpm payload migrate
```

Expected: the single `initial` migration applies (or is already applied).

Then start the dev server (`pnpm dev`, in the background) and walk the user
through content bootstrap:

1. Open `http://localhost:3000/admin` — Payload shows the create-first-user
   screen. The user creates their admin account there (their real email +
   password; it is stored only in their own database).
2. On the dashboard, press the **seed** button (welcome block) and wait for
   "Seeded database successfully!" in the dev-server logs.

Skip the seed step if the dashboard shows existing pages (rerun scenario).

## Phase 7 — Verify locally

With the dev server still running, verify all three surfaces respond:

```bash
curl -sf -o /dev/null -w '%{http_code}\n' http://localhost:3000/
curl -sf -o /dev/null -w '%{http_code}\n' http://localhost:3000/en
curl -sf -o /dev/null -w '%{http_code}\n' http://localhost:3000/admin
```

All must return 200. Then stop the dev server.

## Phase 8 — Deploy

```bash
git add -A
git commit -m "chore: initialize project via /setup"
git push -u origin main
vercel deploy --prod
```

Capture the production URL from the deploy output and verify it serves:

```bash
curl -sf -o /dev/null -w '%{http_code}\n' <production-url>/
curl -sf -o /dev/null -w '%{http_code}\n' <production-url>/en
```

Finish by telling the user:
- the production URL,
- that the admin lives at `<production-url>/admin` with the account created in
  Phase 6 (same database),
- that pointing the custom domain (`vercel domains add <domain>` + DNS at the
  registrar) is the one remaining manual step.
