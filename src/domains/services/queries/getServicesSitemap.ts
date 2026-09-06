import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getServerSideURL } from '@/shared/utils/getURL'

export const getServicesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'services',
      depth: 0,
      draft: false,
      limit: 200,
      overrideAccess: false,
      pagination: false,
      select: { slug: true, updatedAt: true },
      where: { _status: { equals: 'published' } },
    })

    const dateFallback = new Date().toISOString()

    const archives = [
      { loc: `${SITE_URL}/sluzby`, lastmod: dateFallback },
      { loc: `${SITE_URL}/en/sluzby`, lastmod: dateFallback },
    ]

    const entries = results.docs.flatMap((service) => {
      if (!service.slug) return []
      const lastmod = service.updatedAt || dateFallback

      return [
        { loc: `${SITE_URL}/sluzby/${service.slug}`, lastmod },
        { loc: `${SITE_URL}/en/sluzby/${service.slug}`, lastmod },
      ]
    })

    return [...archives, ...entries]
  },
  ['services-sitemap'],
  { tags: ['services-sitemap'] },
)
