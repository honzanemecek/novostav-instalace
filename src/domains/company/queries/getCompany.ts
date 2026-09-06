import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload, type TypedLocale } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Company } from '@/payload/payload-types'

const fetchCompany = async (locale: TypedLocale): Promise<Company> => {
  const payload = await getPayload({ config: configPromise })

  return payload.findGlobal({ slug: 'company', depth: 0, locale })
}

/**
 * Business details for the whole site. Tagged so the global's afterChange hook
 * can bust it, and wrapped in `cache()` so a page and its `generateMetadata`
 * share a single read.
 */
export const getCompany = cache(
  async (locale: TypedLocale = 'cs'): Promise<Company> =>
    unstable_cache(() => fetchCompany(locale), ['company', locale], {
      tags: ['global_company'],
    })(),
)
