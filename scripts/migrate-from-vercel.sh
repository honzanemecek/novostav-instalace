#!/usr/bin/env bash
# One-off move of the data from Vercel (Neon Postgres + Vercel Blob) into the
# self-hosted stack from deploy/docker-compose.yml. Run it on the Docker host,
# after the stack has been deployed once (the site then runs on an empty
# database), and before the domain points at the new server.
#
#   export NEON_URL='postgres://…'              # the DIRECT (non-pooler) connection string
#   export BLOB_READ_WRITE_TOKEN='vercel_blob_rw_…'
#   scripts/migrate-from-vercel.sh <compose project> --reset
#
# <compose project> is the Compose project name (the Dokploy app name, e.g.
# novostav-instalace-ab12cd); `docker ps` shows it as the prefix of the
# container names. The secrets are read from the environment only. They are
# never printed and never put on a command line: `docker exec -e NAME` copies
# them from this shell into the container.
#
# What it does:
#   1. checks Neon: Postgres version, no dev-mode rows in payload_migrations;
#   2. stops the web container, so nothing writes or caches during the restore;
#   3. --reset: drops and recreates the `public` schema of the new database
#      (required once the site has started, since it migrated the empty database);
#   4. pg_dump of Neon's `public` schema (--no-owner --no-privileges), saved
#      next to where you run this as neon-<time>.dump, restored in one transaction;
#      Neon's roles, grants, extensions and other schemas are left behind;
#   5. compares the row count of every table, Neon against the new database;
#   6. rewrites media URLs that point at *.blob.vercel-storage.com to
#      /api/media/file/…, and reports any other column that still mentions it;
#   7. downloads every blob into the media volume, keeping its pathname,
#      and checks that every file the media table names is there;
#   8. starts the web container again. Its entrypoint empties the page cache,
#      so the first visits render from the restored data.
#
# The restored payload_migrations table lists all migrations as applied, so the
# server's start-up migration (prodMigrations) runs nothing.
#
# Safe to re-run with --reset: the dump is taken again, the database replaced,
# and blobs already downloaded (same size) are skipped.
set -euo pipefail

usage() { sed -n '2,13p' "$0" >&2; exit 2; }

project=${1:-}
[[ -n "$project" && "$project" != -* ]] || usage
shift
reset=no
for arg in "$@"; do
  case "$arg" in
    --reset) reset=yes ;;
    *) usage ;;
  esac
done

: "${NEON_URL:?set NEON_URL (Neon direct connection string) in the environment}"
: "${BLOB_READ_WRITE_TOKEN:?set BLOB_READ_WRITE_TOKEN in the environment}"
export NEON_URL BLOB_READ_WRITE_TOKEN

case "$NEON_URL" in
  *-pooler.*) echo "NEON_URL is the pooled connection; use the direct one (Vercel: POSTGRES_URL_NON_POOLING)." >&2; exit 1 ;;
esac

step() { printf '\n== %s\n' "$*"; }

container() {
  local id
  id=$(docker ps -a -q \
    --filter "label=com.docker.compose.project=$project" \
    --filter "label=com.docker.compose.service=$1")
  if [[ -z "$id" || "$id" == *$'\n'* ]]; then
    echo "Expected one '$1' container in Compose project '$project', found: ${id:-none}" >&2
    exit 1
  fi
  echo "$id"
}

pg=$(container postgres)
web=$(container web)
web_image=$(docker inspect -f '{{.Config.Image}}' "$web")
# The stack's network, for the one-off containers below.
network=$(docker inspect -f '{{range $name, $_ := .NetworkSettings.Networks}}{{println $name}}{{end}}' "$pg" | head -n 1)

# psql against the new database: local socket inside the postgres container,
# as the user and database the compose file creates.
target() { docker exec -i "$pg" psql -v ON_ERROR_STOP=1 -X -q -U payload -d payload "$@"; }
# Commands against Neon run in the same container (its pg_dump is Postgres 17).
# The password moves from the URL into PGPASSWORD first, so it never shows up in
# a process list. (Neon passwords are plain alphanumerics, no %-escapes.)
neon_env='case "$NEON_URL" in *://*:*@*)
  PGPASSWORD=$(printf %s "$NEON_URL" | sed -E "s#^[^:]+://[^:/@]+:([^@]*)@.*#\1#"); export PGPASSWORD
  NEON_URL=$(printf %s "$NEON_URL" | sed -E "s#^([^:]+://[^:/@]+):[^@]*@#\1@#") ;;
esac
'
neon() { docker exec -i -e NEON_URL "$pg" sh -c "$neon_env"'exec psql -v ON_ERROR_STOP=1 -X -q -d "$NEON_URL" "$@"' psql "$@"; }

on_error() {
  echo >&2
  echo "Stopped on an error. The web container is left as it is ($(docker inspect -f '{{.State.Status}}' "$web"))." >&2
  echo "Fix the cause and re-run with --reset; or 'docker start $web' to bring the site back as it was." >&2
}
trap on_error ERR

step "Checking Neon"
neon_version=$(neon -Atc 'show server_version_num')
target_version=$(target -Atc 'show server_version_num')
echo "Neon Postgres $neon_version, new database $target_version"
if (( neon_version / 10000 > target_version / 10000 )); then
  echo "Neon runs a newer major Postgres than the new database. Raise the postgres image in deploy/docker-compose.yml first." >&2
  exit 1
fi
dev_rows=$(neon -Atc "select count(*) from payload_migrations where batch = -1")
if (( dev_rows > 0 )); then
  echo "Neon's payload_migrations has $dev_rows dev-mode row(s) (batch -1). The server's start-up migration" >&2
  echo "would stop at an interactive prompt. Look at them and delete them in Neon first." >&2
  exit 1
fi
echo "Migrations applied in Neon:"
neon -Atc "select '  ' || name from payload_migrations order by name"

step "Checking the new database"
tables=$(target -Atc "select count(*) from pg_tables where schemaname = 'public'")
if (( tables > 0 )) && [[ "$reset" != yes ]]; then
  echo "The new database already has $tables tables (the site migrated it on start)." >&2
  echo "Re-run with --reset to replace them with Neon's data." >&2
  exit 1
fi

step "Stopping the web container"
docker stop "$web" >/dev/null
echo "stopped $web"

dump_file="neon-$(date -u +%Y%m%d-%H%M%S).dump"
step "Dumping Neon into $dump_file"
docker exec -e NEON_URL "$pg" sh -c "$neon_env"'umask 077
  exec pg_dump --format=custom --no-owner --no-privileges --schema=public --dbname="$NEON_URL" --file=/tmp/neon.dump'
docker cp -q "$pg:/tmp/neon.dump" "$dump_file"
chmod 600 "$dump_file"
ls -l "$dump_file"

step "Restoring into the new database"
# Restore everything in the dump except the schema itself, which already exists.
docker exec "$pg" sh -c \
  'pg_restore --list /tmp/neon.dump | grep -v -E "^[0-9]+; [0-9]+ [0-9]+ SCHEMA - public " > /tmp/neon.list'
if [[ "$reset" == yes ]]; then
  target -c 'drop schema public cascade' -c 'create schema public'
fi
docker exec "$pg" pg_restore --no-owner --no-privileges --exit-on-error --single-transaction \
  --use-list=/tmp/neon.list -U payload -d payload /tmp/neon.dump
docker exec "$pg" rm -f /tmp/neon.dump /tmp/neon.list
echo "restored"

step "Comparing row counts"
# Builds one query that counts every table in public, then runs it.
count_sql=$(cat <<'SQL'
select 'select t, n from (' ||
  string_agg(format('select %L as t, count(*) as n from public.%I', tablename, tablename), ' union all ') ||
  ') counts order by t'
from pg_tables where schemaname = 'public'
SQL
)
neon_counts=$(neon -Atc "$count_sql" | neon -At -F ' ')
target_counts=$(target -Atc "$count_sql" | target -At -F ' ')
if [[ "$neon_counts" == "$target_counts" ]]; then
  echo "all $(wc -l <<<"$neon_counts") tables match ($(awk '{s += $2} END {print s}' <<<"$neon_counts") rows)"
else
  # Not fatal: the old site is still live, so a form submission or an edit after
  # the dump shows up here. Anything listed exists only in Neon.
  echo "WARNING: row counts differ (<: Neon now, >: new database):"
  diff <(echo "$neon_counts") <(echo "$target_counts") || true
fi

step "Rewriting Vercel Blob URLs in the media table"
target <<'SQL'
do $$
declare
  col text;
  n bigint;
begin
  for col in
    select column_name from information_schema.columns
    where table_schema = 'public' and table_name = 'media'
      and (column_name in ('url', 'thumbnail_u_r_l') or column_name like 'sizes\_%\_url')
  loop
    execute format(
      $q$update public.media set %1$I = regexp_replace(%1$I, '^https?://[^/]+\.blob\.vercel-storage\.com/', '/api/media/file/')
         where %1$I ~ '^https?://[^/]+\.blob\.vercel-storage\.com/'$q$, col);
    get diagnostics n = row_count;
    raise notice 'media.%: % rewritten', col, n;
  end loop;
end $$;
SQL

echo "Other columns that still mention blob.vercel-storage.com (fix by hand if any):"
target -At <<'SQL'
do $$
declare
  r record;
  n bigint;
  found boolean := false;
begin
  for r in
    select table_name, column_name from information_schema.columns
    where table_schema = 'public' and data_type in ('character varying', 'text', 'jsonb', 'json')
  loop
    execute format('select count(*) from public.%I where %I::text like %L', r.table_name, r.column_name, '%blob.vercel-storage.com%') into n;
    if n > 0 then
      raise notice '  %.%: % row(s)', r.table_name, r.column_name, n;
      found := true;
    end if;
  end loop;
  if not found then raise notice '  none'; end if;
end $$;
SQL

step "Downloading blobs into the media volume"
# A one-off container from the web image, with the web container's volumes and
# user, so files land in MEDIA_DIR owned by the server.
# BLOB_API_URL is only for testing against a stand-in for Vercel's API.
docker run --rm -i --network "$network" --volumes-from "$web" \
  -e BLOB_READ_WRITE_TOKEN -e BLOB_API_URL="${BLOB_API_URL:-https://blob.vercel-storage.com}" \
  --entrypoint node "$web_image" --input-type=module - <<'JS'
import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const dir = process.env.MEDIA_DIR
const token = process.env.BLOB_READ_WRITE_TOKEN
const auth = { authorization: `Bearer ${token}` }
let cursor, listed = 0, fetched = 0, skipped = 0, failed = 0

do {
  const url = new URL(process.env.BLOB_API_URL)
  url.searchParams.set('limit', '1000')
  if (cursor) url.searchParams.set('cursor', cursor)
  const res = await fetch(url, { headers: auth })
  if (!res.ok) throw new Error(`listing blobs failed: HTTP ${res.status}`)
  const page = await res.json()

  for (const blob of page.blobs) {
    listed++
    const target = path.resolve(dir, blob.pathname)
    if (!target.startsWith(path.resolve(dir) + path.sep)) {
      console.error(`skipped, unsafe pathname: ${blob.pathname}`)
      failed++
      continue
    }
    if (fs.existsSync(target) && fs.statSync(target).size === blob.size) {
      skipped++
      continue
    }
    fs.mkdirSync(path.dirname(target), { recursive: true })
    const file = await fetch(blob.url, { headers: auth })
    if (!file.ok) {
      console.error(`failed: ${blob.pathname} (HTTP ${file.status})`)
      failed++
      continue
    }
    await pipeline(Readable.fromWeb(file.body), fs.createWriteStream(`${target}.part`))
    fs.renameSync(`${target}.part`, target)
    if (blob.pathname.includes('/')) console.log(`note: nested pathname ${blob.pathname}`)
    fetched++
  }
  cursor = page.hasMore ? page.cursor : undefined
} while (cursor)

console.log(`${listed} blobs: ${fetched} downloaded, ${skipped} already there, ${failed} failed`)
process.exit(failed ? 1 : 0)
JS

step "Checking that every file the media table names is on disk"
media_cols=$(target -Atc "select string_agg(quote_ident(column_name), ', ') from information_schema.columns
  where table_schema = 'public' and table_name = 'media'
    and (column_name = 'filename' or column_name like 'sizes\_%\_filename')")
target -Atc "select f from public.media, unnest(array[$media_cols]) as f where f is not null" |
  docker run --rm -i --volumes-from "$web" --entrypoint sh "$web_image" -c '
    total=0; missing=0
    while IFS= read -r f; do
      total=$((total + 1))
      [ -f "$MEDIA_DIR/$f" ] || { echo "missing: $f"; missing=$((missing + 1)); }
    done
    echo "$total files referenced, $missing missing"
    [ "$missing" -eq 0 ]'

step "Starting the web container"
docker start "$web" >/dev/null
for _ in $(seq 1 60); do
  status=$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$web")
  [[ "$status" == healthy ]] && break
  sleep 5
done
echo "web: $status"
echo
echo "Done. Keep $dump_file until the new site has been checked, then delete it."
