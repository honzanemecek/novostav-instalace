#!/bin/sh
# Empties Next.js's on-disk page cache in the given .next directory: the HTML,
# RSC payloads and metadata of prerendered or ISR-rendered pages under
# server/app, and the unstable_cache data under cache/fetch-cache.
#
# Pages missing from the cache are rendered on their next request and cached
# again. Compiled code (*.js) and the manifests are not touched.
set -eu

next_dir=${1:?usage: drop-page-cache.sh <path to .next>}
app_dir="$next_dir/server/app"

if [ -d "$app_dir" ]; then
  find "$app_dir" -type d -name '*.segments' -prune -exec rm -rf {} +
  find "$app_dir" -type f \( -name '*.html' -o -name '*.rsc' -o -name '*.meta' -o -name '*.body' \) -delete
fi
rm -rf "$next_dir/cache/fetch-cache"
