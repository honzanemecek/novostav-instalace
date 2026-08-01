import { getPayload, type TypedLocale } from 'payload'
import configPromise from '@payload-config'

export const POSTS_PER_PAGE = 12

export async function getPostsArchive(page = 1, locale: TypedLocale = 'cs') {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'posts',
    depth: 1,
    limit: POSTS_PER_PAGE,
    locale,
    page,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })
}

// Preserves the template's original paging math (ceil(total / 10), not / 12).
export async function getPostsPageCount(): Promise<number> {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })
  return Math.ceil(totalDocs / 10)
}
