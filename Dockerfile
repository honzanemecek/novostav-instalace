# Production image, deployed by Dokploy with deploy/docker-compose.yml.
#
# The image is built without access to any database. deploy/image/build.sh
# explains how the build gets around the pages that query Payload.
#
# Build arg:  NEXT_PUBLIC_SERVER_URL  the public origin; Next.js inlines it at build
# Runtime:    see deploy/.env.example

FROM node:22.23.3-alpine3.24 AS base
RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /app
# pnpm at the exact version in package.json's `packageManager`.
COPY package.json ./
RUN corepack enable && corepack install

# --- dependencies -----------------------------------------------------------
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=novostav-pnpm-store,target=/root/.cache/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /root/.cache/pnpm-store

# --- build ------------------------------------------------------------------
FROM base AS builder
# Postgres binaries for the throwaway database the build runs against.
RUN apk add --no-cache postgresql17
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
RUN sh deploy/image/build.sh

# --- runtime ----------------------------------------------------------------
FROM node:22.23.3-alpine3.24 AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    MEDIA_DIR=/app/media

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

# The standalone server traces its own node_modules (sharp and its libvips
# included); public/ and the static chunks are copied next to it by hand.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --chown=nextjs:nodejs deploy/image/start.sh deploy/image/drop-page-cache.sh ./deploy/

# Uploads. The compose file mounts a named volume here; a fresh volume takes
# this directory's owner, so the server can write to it.
RUN mkdir -p /app/media && chown nextjs:nodejs /app/media

USER nextjs
EXPOSE 3000
# The compose file's healthcheck uses busybox wget against /api/users/me.
CMD ["sh", "/app/deploy/start.sh"]
