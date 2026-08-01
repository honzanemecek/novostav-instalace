import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload, type TypedLocale } from 'payload'
import configPromise from '@payload-config'
import type { Post } from '@/payload/payload-types'

export const getPostBySlug = cache(
  async (slug: string, locale: TypedLocale = 'cs'): Promise<Post | null> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'posts',
      draft,
      limit: 1,
      locale,
      overrideAccess: draft,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  },
)
