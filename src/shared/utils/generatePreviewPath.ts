import { PayloadRequest, CollectionSlug } from 'payload'

export type PreviewSearchParams = {
  path: string
  previewSecret: string
}

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  projects: '/realizace',
  services: '/sluzby',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  locale?: string
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, locale, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const localePrefix = locale && locale !== 'cs' ? `/${locale}` : ''

  const encodedParams = new URLSearchParams({
    path: `${localePrefix}${collectionPrefixMap[collection]}/${encodedSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
