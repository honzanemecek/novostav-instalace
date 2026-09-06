---
name: nextjs
description: Use when working with Next.js 16 App Router in this repo - routes, layouts, RSC vs client components, async params/searchParams, caching and revalidation (use cache, cacheLife, revalidateTag/updateTag), metadata and SEO, next/image, draft mode, route handlers, proxy.ts, sitemaps, or the cs//en route split. Read before adding or changing anything under src/app/.
---

# Next.js 16 (App Router) in this repo

Running **Next 16.2.6 + React 19.2**, Turbopack by default, wrapped by
`withPayload()` in `next.config.ts`. Payload's admin lives under `src/app/(payload)/`;
the site lives under `src/app/(frontend)/`.

## Golden rule for this repo

`src/app/` contains **thin routes only**. A route file resolves params, calls a domain
page component, and returns it. All logic, data fetching and markup live in
`src/domains/<name>/pages/`.

```tsx
// src/app/(frontend)/(cs)/[slug]/page.tsx  — the whole file
import { DynamicPage, getPageBySlug, getPageSlugs } from '@/domains/pages'

export async function generateStaticParams() {
  return getPageSlugs()
}

type Args = { params: Promise<{ slug?: string }> }

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  return <DynamicPage slug={decodeURIComponent(slug)} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  return generateMeta({ doc: await getPageBySlug(decodeURIComponent(slug)) })
}
```

Nothing imports from `app/` — routes are leaves (ESLint-enforced).

## Route layout (cs primary, en mirror)

```
src/app/(frontend)/
  layout.tsx                 # html/body, fonts, providers
  (cs)/                      # Czech at the root: /, /[slug], /posts, /search
    layout.tsx               # <Header /> {children} <Footer />
  en/                        # English mirror: /en, /en/[slug], /en/posts, /en/search
  (sitemaps)/                # pages-sitemap.xml, posts-sitemap.xml
  next/{preview,exit-preview,seed}
```

Adding a page means adding it in **both** trees, each passing the right `locale` to the
same domain page component. Use `localizeHref(path, locale)` from `@/shared/utils/locale`
for internal links — never hand-concatenate `/en`.

## Async everything (Next 16 removed the sync forms)

`params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` are all Promises.

```ts
const { slug } = await params
const { isEnabled: draft } = await draftMode()
```

Metadata image routes take async `params` too, and `generateImageMetadata`'s `id` is a
`Promise<string>`.

## Caching model

`cacheComponents` is **not** enabled in `next.config.ts`. Today's model:

- Pages are static where `generateStaticParams` + cached queries allow, dynamic where a
  request-time API (`draftMode()`, `cookies()`) is touched.
- Per-request dedupe: React `cache()` inside domain `queries/`.
- Cross-request cache: `unstable_cache(fn, keys, { tags })` — used by the sitemap queries.
- Invalidation is driven by Payload `afterChange` hooks calling `revalidatePath()` /
  `revalidateTag()`.

**Next 16 API changes that matter here:**

```ts
revalidateTag('pages-sitemap', 'max')   // ✅ profile arg required (SWR)
revalidateTag('pages-sitemap')          // ⚠️ deprecated single-arg form
updateTag('user-1')                     // Server Actions only: read-your-writes
refresh()                               // Server Actions only: refresh uncached data
```

Use `'max'` unless you specifically want a shorter window (`'hours'`, `'days'`, or
`{ expire: 3600 }`).

If you ever enable `cacheComponents: true`, `"use cache"` + `cacheLife`/`cacheTag` become
the model and all dynamic code runs at request time by default — that's a project-wide
migration, not a per-file change. Don't flip it casually.

## Metadata & SEO

- Per-route `generateMetadata` delegates to `generateMeta({ doc })` in
  `@/shared/utils/generateMeta`, which reads the SEO-plugin `meta` group.
- Site identity (name, descriptions, domain, OG image) comes **only** from
  `src/shared/config/site.ts`. Never hardcode the site name or domain in a route.
- Server URL: `getServerSideURL()` from `@/shared/utils/getURL`.
- Sitemaps are route handlers under `(sitemaps)/`; `next-sitemap` runs in `postbuild`.

## Images

`next.config.ts` already sets `images.localPatterns` for `/api/media/file/**` (Payload
media) and `qualities: [100]`. Next 16 defaults changed — `images.qualities` is now
`[75]` by default and the `quality` prop is coerced to the nearest allowed value, so any
new quality you use must be added to that array. Prefer the repo's `<Media />`
(`@/shared/components/Media`) over raw `next/image`: it handles Payload media resources,
sizes and video.

## Server vs client components

- Default to server components. Add `'use client'` only for interactivity, browser APIs,
  or motion.
- A client component must not import a domain barrel that also exports server code — use
  the domain's `client.ts` entry (`@/domains/layout/client`).
- Push `'use client'` to the leaf. A page shouldn't become a client component so one
  button can have an `onClick`.
- All `src/shared/ui/motion/*` components are client components by design.

## Route handlers, proxy, drafts

- Route handlers under `(frontend)/next/`: `preview` enables draft mode from Payload's
  preview URL, `exit-preview` clears it, `seed` runs the seed script.
- Redirects: static ones in `redirects.ts` (fed into `next.config.ts`); editor-managed
  ones via the Payload redirects plugin, resolved by `<PayloadRedirects />`.
- **`middleware.ts` is deprecated in Next 16** — if this project ever needs request
  interception, create `proxy.ts` exporting `proxy(request)`. It runs on the Node runtime.

## Commands

```bash
pnpm dev          # Turbopack
pnpm build        # Turbopack; `--webpack` to fall back
pnpm lint         # `next lint` was removed in Next 16 — eslint runs directly
pnpm dev:prod     # clean prod build + start, for verifying caching behaviour
```

`next build` no longer runs lint. Run `pnpm lint` yourself before calling work done.

## Next 16 removals worth remembering

`next lint`, AMP, `serverRuntimeConfig`/`publicRuntimeConfig`, `experimental.ppr` and
`export const experimental_ppr`, `unstable_rootParams()`, sync `params`/`cookies`/
`headers`/`draftMode`, automatic `scroll-behavior: smooth` (opt back in with
`data-scroll-behavior="smooth"`). Parallel route slots now require explicit `default.js`.

## MCP servers available

`.mcp.json` wires up `next-devtools` (live logs, errors, route context — use it to debug
a running `pnpm dev`), `nextjs-docs` (search the Next 16 docs), and `shadcn`. Prefer
`nextjs-docs` over memory when an API's current shape is in doubt.
