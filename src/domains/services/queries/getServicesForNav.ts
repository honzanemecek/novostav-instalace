import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload, type TypedLocale } from 'payload'

export type ServiceNavItem = { title: string; slug: string }

/**
 * Titles and slugs of published services, for the footer's „Služby" column.
 *
 * The footer lists the collection, not `navItems` — the offering must never lag
 * behind what the client has actually published. Cached under
 * `collection_services`, which `revalidateService` clears on every change.
 */
export const getServicesForNav = (locale: TypedLocale = 'cs') =>
  unstable_cache(
    async (): Promise<ServiceNavItem[]> => {
      const payload = await getPayload({ config: configPromise })

      const result = await payload.find({
        collection: 'services',
        depth: 0,
        limit: 24,
        locale,
        pagination: false,
        select: { title: true, slug: true },
        sort: ['order', 'title'],
        where: { _status: { equals: 'published' } },
      })

      return result.docs.map((doc) => ({ title: doc.title, slug: doc.slug }))
    },
    ['services-nav', locale],
    { tags: ['collection_services'] },
  )
