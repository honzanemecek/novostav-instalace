import type { Page, Post, Project, Service } from '@/payload/payload-types'

/**
 * Route prefix per linkable collection. Keep in sync with the folders under
 * src/app/(frontend) — a missing entry silently produces a 404 link.
 */
export const collectionPrefixes = {
  pages: '',
  services: '/sluzby',
  projects: '/realizace',
  posts: '/posts',
} as const

/** The part of a CMS link that decides where it points. */
export type CMSLinkTarget = {
  type?: 'custom' | 'reference' | null
  reference?: {
    relationTo: keyof typeof collectionPrefixes
    value: Page | Post | Project | Service | string | number
  } | null
  url?: string | null
}

/**
 * The un-localised target of a CMS link — `/sluzby/strechy`, `tel:…`, `https://…`.
 *
 * Lives in its own module, without `'use client'`, because server components
 * read it too (the showcase block resolves its own „all realizace“ link). The
 * header also uses it to tell which nav item is the current page, instead of
 * rebuilding the prefix map and drifting from it.
 */
export const cmsLinkHref = (link?: CMSLinkTarget | null): string | null => {
  if (!link) return null
  if (
    link.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value.slug
  ) {
    return `${collectionPrefixes[link.reference.relationTo] ?? ''}/${link.reference.value.slug}`
  }
  return link.url ?? null
}
