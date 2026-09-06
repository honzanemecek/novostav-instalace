import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Service } from '@/payload/payload-types'
import { localizeHref } from '@/shared/utils/locale'

/**
 * Services appear on their own page and inside every ServicesGrid, so a change
 * has to clear the listing routes too, not just the detail page.
 */
const revalidateServicePaths = (slug?: string | null) => {
  const paths = ['/', '/sluzby', ...(slug ? [`/sluzby/${slug}`] : [])]

  for (const path of paths) {
    for (const p of [path, localizeHref(path, 'en')]) revalidatePath(p)
  }
  revalidateTag('services-sitemap', 'max')
}

export const revalidateService: CollectionAfterChangeHook<Service> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating service: ${doc.slug}`)
      revalidateServicePaths(doc.slug)
    }

    // Unpublished, or the slug moved — the old URL must stop serving.
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      revalidateServicePaths(previousDoc.slug)
    }
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidateServicePaths(previousDoc.slug)
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Service> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) revalidateServicePaths(doc?.slug)
  return doc
}
