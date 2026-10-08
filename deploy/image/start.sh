#!/bin/sh
# Container entrypoint.
#
# Pages are cached on disk inside the container as they are first rendered. Each
# start begins with an empty cache, so restarting the container is enough to
# pick up data that changed behind Payload's back (a restored backup, a fix made
# in SQL). Payload's own edits revalidate pages while the server runs, as before.
set -eu

sh /app/deploy/drop-page-cache.sh /app/.next

# Migrations and the job queue start in src/instrumentation.ts, before the
# server accepts requests.
exec node /app/server.js
