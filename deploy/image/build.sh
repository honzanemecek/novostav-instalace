#!/bin/sh
# Builds the app inside the Dockerfile's builder stage, with no outside database.
#
# `next build` queries Payload in two places: generateStaticParams lists the
# slugs to prerender, and the routes without params (/, /sluzby, /realizace,
# /posts, their /en twins, the 404 page and the shared header and footer) are
# rendered outright. Next.js has no switch to skip prerendering a route that has
# no params, so the build gets a throwaway Postgres of its own:
#
#   1. start an empty Postgres inside this build stage, on 127.0.0.1 only;
#   2. `pnpm run ci` = `payload migrate && pnpm build`, the same command Vercel
#      ran. Applying the real migrations to an empty database also proves they
#      still run cleanly;
#   3. delete the pages the build rendered from that empty database. Each page
#      is then rendered on its first request against the real database and
#      cached (ISR) until a Payload hook revalidates it, as before.
#
# The database is stopped and deleted before the stage ends; nothing from it
# reaches the runtime image.
set -eu

: "${NEXT_PUBLIC_SERVER_URL:?build arg NEXT_PUBLIC_SERVER_URL is required, e.g. https://novostav-instalace.cz}"

PGDATA=/tmp/build-db

stop_db() {
  su postgres -s /bin/sh -c "pg_ctl --pgdata=$PGDATA --mode=fast stop" >/dev/null 2>&1 || true
  rm -rf "$PGDATA"
}
trap stop_db EXIT

su postgres -s /bin/sh -c "initdb --pgdata=$PGDATA --username=payload --auth=trust" >/dev/null
su postgres -s /bin/sh -c \
  "pg_ctl --pgdata=$PGDATA --wait --log=$PGDATA.log \
     --options=\"-c listen_addresses=127.0.0.1 -c port=5432 -c unix_socket_directories=/tmp\" start" >/dev/null
su postgres -s /bin/sh -c "createdb --host=127.0.0.1 --username=payload payload"

# Payload refuses to start without a secret. This one only ever signs nothing
# during the build; the runtime secret comes from the environment.
POSTGRES_URL=postgres://payload@127.0.0.1:5432/payload \
PAYLOAD_SECRET=image-build-only \
  pnpm run ci

sh deploy/image/drop-page-cache.sh .next/standalone/.next
