import { cache } from 'react'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload, type TypedLocale } from 'payload'

import type { Project } from '@/payload/payload-types'

export const getProjectBySlug = cache(
  async (slug: string, locale: TypedLocale = 'cs'): Promise<Project | null> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'projects',
      draft,
      limit: 1,
      locale,
      overrideAccess: draft,
      pagination: false,
      where: { slug: { equals: slug } },
    })

    return result.docs?.[0] || null
  },
)
