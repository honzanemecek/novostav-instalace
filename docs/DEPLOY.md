# Deployment

The site runs self-hosted on Honza's VPS. Dokploy deploys
[`deploy/docker-compose.yml`](../deploy/docker-compose.yml) from the `main` branch: a push
to `main` is a production deploy. Dokploy's Traefik routes the domain to `web:3000` and
handles Let's Encrypt; the compose file has no ports and no Traefik labels.

## Services

| Service | What it is |
| :-- | :-- |
| `web` | Next.js + Payload, built from the repo's `Dockerfile` (standalone output, non-root) |
| `postgres` | Postgres 17, data in the named volume `db-data` |
| `backup` | `pg_dump --format=custom` at start and nightly at 01:45 UTC into `/srv/novostav-backups` on the host, kept 30 days |

Uploaded media live in the named volume `media`, mounted at `/app/media` (`MEDIA_DIR`).
Payload serves them at `/api/media/file/<name>`, so the collection's access rules apply.

## Environment

Set in Dokploy (app → Environment). Names, with notes, in
[`deploy/.env.example`](../deploy/.env.example).

| Variable | Notes |
| :-- | :-- |
| `NEXT_PUBLIC_SERVER_URL` | Public origin, e.g. `https://novostav-instalace.cz`. **Also a build arg**: Next.js inlines it, so changing it needs a rebuild |
| `POSTGRES_PASSWORD` | Hex only (`openssl rand -hex 32`); the compose file builds `POSTGRES_URL` from it |
| `PAYLOAD_SECRET` | Keep the value from Vercel: it encrypts the MCP API keys in the database |
| `PREVIEW_SECRET`, `CRON_SECRET` | Any random value |
| `BACKUP_DIR` | Optional, defaults to `/srv/novostav-backups` |

## How the build works without a database

The image is built with no database reachable. `next build` still needs one: the routes
without params (`/`, `/sluzby`, `/realizace`, `/posts`, their `/en` twins, the 404 page) are
prerendered, and `generateStaticParams` lists slugs. So
[`deploy/image/build.sh`](../deploy/image/build.sh) starts a throwaway Postgres inside the
build stage, runs `pnpm ci` (`payload migrate && pnpm build`) against it, and then deletes
the pages it rendered from that empty database.

At runtime every page is rendered on its **first request** and then cached on disk (ISR)
until a Payload hook revalidates it, as before. The container starts with an empty page
cache every time ([`deploy/image/start.sh`](../deploy/image/start.sh)), so restarting
`web` picks up data changed outside Payload, such as a restored backup.

On start, before it accepts requests, the server applies pending migrations
(`prodMigrations`) and starts Payload's job queue, which publishes scheduled documents
every 5 minutes (`jobs.autoRun`). Both are triggered from
[`src/instrumentation.ts`](../src/instrumentation.ts).

## Restoring a backup

```bash
docker stop <project>-web-1
docker exec -i <project>-postgres-1 pg_restore --clean --if-exists -U payload -d payload < novostav-….dump
docker start <project>-web-1
```

## Moving the data off Vercel (one-off)

[`scripts/migrate-from-vercel.sh`](../scripts/migrate-from-vercel.sh) copies Neon's
database and every Vercel Blob file into the running stack. Deploy the stack once first,
then on the VPS:

```bash
export NEON_URL='…'               # Neon's direct (non-pooler) connection string
export BLOB_READ_WRITE_TOKEN='…'
scripts/migrate-from-vercel.sh <compose project> --reset
```

It stops `web`, replaces the database with a dump of Neon's `public` schema, checks row
counts, rewrites any Blob URLs in the media table, downloads the files into the `media`
volume, checks every referenced file is there, and starts `web` again. Details in the
script's header.
