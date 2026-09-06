import type { Media } from '@/payload/payload-types'

import { getMediaUrl } from './getMediaUrl'

export type ResolvedMedia = {
  src: string
  alt: string
  width?: number
  height?: number
}

/**
 * Flattens a Payload upload field to the plain `src`/`alt` that raw `<img>`
 * based primitives (the motion lightbox, the before/after slider) need.
 * Returns null for an unpopulated relationship (depth 0 gives an id, not a doc).
 */
export const resolveMedia = (
  resource: Media | string | number | null | undefined,
): ResolvedMedia | null => {
  if (!resource || typeof resource !== 'object') return null
  if (!resource.url) return null

  return {
    src: getMediaUrl(resource.url, resource.updatedAt),
    alt: resource.alt || '',
    width: resource.width ?? undefined,
    height: resource.height ?? undefined,
  }
}
