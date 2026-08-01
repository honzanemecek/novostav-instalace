import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload, type TypedLocale } from 'payload'
import configPromise from '@payload-config'
import type { Page } from '@/payload/payload-types'

export const getPageBySlug = cache(
  async (slug: string, locale: TypedLocale = 'cs'): Promise<Page | null> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      locale,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  },
)
