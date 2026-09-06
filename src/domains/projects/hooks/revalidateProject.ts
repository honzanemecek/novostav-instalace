import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Project } from '@/payload/payload-types'
import { localizeHref } from '@/shared/utils/locale'

/**
 * A project shows up on the homepage showcase, the archive, and the pages of
 * every service it is tagged with — so revalidate broadly rather than guess.
 */
const revalidateProjectPaths = (slug?: string | null) => {
  const paths = ['/', '/realizace', '/sluzby', ...(slug ? [`/realizace/${slug}`] : [])]

  for (const path of paths) {
    for (const p of [path, localizeHref(path, 'en')]) revalidatePath(p)
  }
  revalidateTag('projects-sitemap', 'max')
}

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating project: ${doc.slug}`)
      revalidateProjectPaths(doc.slug)
    }

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      revalidateProjectPaths(previousDoc.slug)
    }
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidateProjectPaths(previousDoc.slug)
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Project> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) revalidateProjectPaths(doc?.slug)
  return doc
}
