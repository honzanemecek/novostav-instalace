import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getServerSideURL } from '@/shared/utils/getURL'

export const getProjectsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'projects',
      depth: 0,
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true, updatedAt: true },
      where: { _status: { equals: 'published' } },
    })

    const dateFallback = new Date().toISOString()

    const archives = [
      { loc: `${SITE_URL}/realizace`, lastmod: dateFallback },
      { loc: `${SITE_URL}/en/realizace`, lastmod: dateFallback },
    ]

    const entries = results.docs.flatMap((project) => {
      if (!project.slug) return []
      const lastmod = project.updatedAt || dateFallback

      return [
        { loc: `${SITE_URL}/realizace/${project.slug}`, lastmod },
        { loc: `${SITE_URL}/en/realizace/${project.slug}`, lastmod },
      ]
    })

    return [...archives, ...entries]
  },
  ['projects-sitemap'],
  { tags: ['projects-sitemap'] },
)
