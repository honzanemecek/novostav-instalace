import { cache } from 'react'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload, type TypedLocale } from 'payload'

import type { Service } from '@/payload/payload-types'

/** All published services, in editor-defined `order`. */
export const getServices = cache(
  async (locale: TypedLocale = 'cs'): Promise<Service[]> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'services',
      draft,
      limit: 24,
      locale,
      overrideAccess: draft,
      pagination: false,
      sort: ['order', 'title'],
    })

    return result.docs
  },
)
