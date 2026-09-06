---
name: payload
description: Use when working with Payload CMS 3 in this repo - collections, globals, blocks, fields, Payload hooks, access control, drafts/versions, live preview, localization (cs/en), queries via the Local API, migrations, seed data, or the admin panel. Read before adding or changing anything under src/payload/ or a domain's collection.ts / blocks/ / queries/ / hooks/.
---

# Payload CMS 3 in this repo

Version pin: **all `payload` and `@payloadcms/*` packages move together** (currently
`3.84.1`). Never bump one in isolation — mismatched versions break the admin bundle.

Config entry: `src/payload/payload.config.ts`. Adapters: `@payloadcms/db-vercel-postgres`
(Neon), `@payloadcms/storage-vercel-blob`, `@payloadcms/richtext-lexical`.

## Where things live (domain-driven)

Payload config is assembled in `src/payload/`, but every collection is **owned by its
domain**:

| Thing | Lives in |
|---|---|
| Collection / global config | `src/domains/<name>/collection.ts` (or `collections/`, `header/config.ts`) |
| Blocks (config + component) | `src/domains/<name>/blocks/<Block>/{config.ts,Component.tsx}` |
| Collection hooks (revalidate, populate) | `src/domains/<name>/hooks/` |
| Data access (Local API) | `src/domains/<name>/queries/` |
| Reusable field builders | `src/payload/fields/` (`link`, `defaultLexical`, …) |
| Access functions | `src/payload/access/` (`anyone`, `authenticated`, `authenticatedOrPublished`) |
| Cross-cutting hooks | `src/payload/hooks/` (`populatePublishedAt`, `revalidateRedirects`) |
| Plugin wiring (no domain) | `src/payload/plugins/index.ts` |
| Plugin wiring (domain-owned) | that domain's `config.ts`, composed into `payload/plugins` |
| Admin-only React components | `src/payload/components/` |
| Migrations | `src/payload/migrations/` |
| Seed | `src/payload/seed/` |

`src/payload/**` is the one place allowed to deep-import a domain
(`@/domains/pages/collection`) — that's build-time registration, not runtime coupling.

## The `config.ts` rule (important)

A Payload **block config or plugin instance consumed by another domain or by
`payload.config.ts` must be exported from that domain's `config.ts`, never from
`index.ts`.** `index.ts` also exports React components; pulling it into the Payload CLI's
module graph drags SCSS imports in and breaks `generate:types` / `generate:importmap`.

```ts
// src/domains/forms/config.ts  — build-time public API
export { FormBlock as FormBlockConfig } from './blocks/FormBlock/config'
export { formsPlugin } from './plugin'
```

Existing: `forms/config.ts`, `posts/config.ts` (`ArchiveBlockConfig`), `search/config.ts`.

## Adding a collection

1. `src/domains/<name>/collection.ts` — type it as `CollectionConfig<'<slug>'>` so
   `defaultPopulate` and `select` are slug-typed.
2. Bilingual labels: `labels: { singular: { cs: '…', en: '…' }, plural: { … } }`.
3. `access:` — use `src/payload/access/` helpers. Public-readable content collections use
   `authenticatedOrPublished` for `read` and `authenticated` for write.
4. `admin.useAsTitle`, `admin.defaultColumns`, and `admin.livePreview.url` /
   `admin.preview` via `generatePreviewPath` if the doc has a public URL.
5. `slugField()` (imported from `payload`) for URL-addressable docs.
6. `versions.drafts` (+ `autosave.interval: 100` if live preview) when editors need
   drafts.
7. Register in `src/payload/payload.config.ts` `collections: [...]`.
8. Add `afterChange` / `afterDelete` revalidate hooks — see below.
9. `pnpm generate:types` → then create a migration (see Migrations).

Reference implementation: `src/domains/pages/collection.ts`.

## Adding a block

1. `src/domains/<domain>/blocks/<Name>/config.ts` — export a `Block` with `slug`,
   `interfaceName` (this is what names the generated TS type), and `fields`.
2. `Component.tsx` next to it — the React renderer. Props are the generated
   `<InterfaceName>` type from `@/payload/payload-types`.
3. Add the block to the owning collection's `layout` blocks array.
4. Register the component in `src/domains/pages/blocks/RenderBlocks.tsx` — the
   `blockComponents` map is keyed by block `slug`.
5. If another domain's collection needs the block config, re-export it from that domain's
   `config.ts`.
6. `pnpm generate:types`.

A block that must render **inside rich text** is different: content primitives
(Banner, Code, MediaBlock) live in `src/shared/components/RichText/blocks/`. A
domain-owned block renders in rich text only by passing its converter through RichText's
`blockConverters` prop from the call site — `shared/` never imports a domain.

## Queries — the only data path

Frontend code never calls `getPayload()` inline. Every read goes through the owning
domain's `queries/`, and the module exports a narrow function.

```ts
// src/domains/pages/queries/getPageBySlug.ts
import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload, type TypedLocale } from 'payload'
import configPromise from '@payload-config'

export const getPageBySlug = cache(async (slug: string, locale: TypedLocale = 'cs') => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale,
    pagination: false,
    overrideAccess: draft,   // only bypass access when previewing drafts
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
```

Rules of thumb:

- Wrap per-request reads in React `cache()` so a page + its `generateMetadata` share one query.
- Always pass `locale` through; default `'cs'`.
- `overrideAccess: false` for anything public; only `true` (or `draft`) in preview paths.
- Use `select: { … }` and `depth: 0` for list/sitemap queries — Postgres joins are the
  main cost here.
- `pagination: false` + `limit` for finite sets; real pagination for archives
  (`getPostsArchive`).
- Sitemap-style queries use `unstable_cache` with a tag, and the collection's
  revalidate hook calls `revalidateTag(tag, 'max')`.

## Localization (cs primary, en fallback)

```ts
localization: { locales: ['cs', 'en'], defaultLocale: 'cs' }
i18n: { supportedLanguages: { cs, en }, translations: customTranslations }
```

- **No content field is `localized: true` today.** `/en` renders the `cs` values through
  Payload's fallback. To actually translate a field, add `localized: true` to it and
  generate types + a migration — routing, queries and revalidation already pass locale.
- Admin UI strings: bilingual `labels`/`label` objects inline. Project-specific terms go
  in `src/payload/i18n/customTranslations.ts` and are referenced with the `custom:` prefix
  (see the doc comment in that file).
- **Invariant:** a `cs` page with slug `en` is shadowed by the `/en` route subtree. Never
  use `en` as a top-level page slug.

## Hooks and revalidation

Every publicly routed collection needs revalidation on change, or Next serves stale HTML.

```ts
export const revalidatePage: CollectionAfterChangeHook<Page> = ({ doc, previousDoc, req }) => {
  if (req.context.disableRevalidate) return doc
  // revalidate both locales
  for (const p of [path, localizeHref(path, 'en')]) revalidatePath(p)
  revalidateTag('pages-sitemap', 'max')     // Next 16: profile arg is required
  return doc
}
```

- Guard on `req.context.disableRevalidate` — the seed script sets it to avoid thrashing.
- Revalidate the **old** path too when a doc is unpublished or its slug changes.
- Revalidate `/` and `/en` variants — use `localizeHref` from `@/shared/utils/locale`.
- `revalidateTag(tag, 'max')` — the single-argument form is deprecated in Next 16.

## Access control

Three helpers in `src/payload/access/`; compose rather than inline booleans.
`authenticatedOrPublished` returns a **where constraint** (`{ _status: { equals:
'published' } }`) for anonymous readers — that pattern is how you make draft content
invisible without a second query.

## Live preview & drafts

- `admin.livePreview.url` and `admin.preview` both build the URL with
  `generatePreviewPath({ slug, collection, locale, req })`.
- Draft routes: `src/app/(frontend)/next/preview` and `next/exit-preview`.
- Client side: render `<LivePreviewListener />` when `draftMode().isEnabled`.
- `versions.drafts.autosave.interval: 100` is deliberate — it's what makes live preview
  feel instant. Don't raise it without a reason.

## Migrations

Postgres adapter → schema changes need a migration, not just `generate:types`.

```bash
pnpm payload migrate:create <name>   # generate from the current config diff
pnpm payload migrate                 # apply (also runs in CI via `pnpm ci`)
pnpm payload migrate:status
```

Never hand-edit an applied migration; add a new one. `pnpm ci` = `payload migrate && pnpm build`
— that's what Vercel runs.

## After any schema or admin-component change

```bash
pnpm generate:types        # rewrites src/payload/payload-types.ts
pnpm generate:importmap    # after moving/adding admin components
pnpm lint && pnpm build
```

Admin component paths are **strings** (`'@/domains/layout/header/RowLabel#RowLabel'`).
Moving a file does not update them — grep for the old path.

## Gotchas

- `payload-types.ts` is generated: never edit it, it's prettier-ignored and eslint-ignored.
- Don't import `payload.config.ts` from client components; use `@payload-config` only in
  server modules under `queries/`.
- `getPayload({ config })` is cheap after the first call (cached), but the surrounding
  query is not — that's why `cache()` wraps the query, not the client.
- Plugin-owned collections (redirects, search, forms) have no domain `queries/` of their
  own; redirects reads live in `src/shared/utils/`.
