import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload, type TypedLocale } from 'payload'

/**
 * How many published projects each service has, keyed by service id.
 *
 * One find with `depth: 0` and a `services`-only select, counted in JS — six
 * `payload.count` calls would be six round trips for the same answer.
 */
export const getProjectCountsByService = cache(
  async (locale: TypedLocale = 'cs'): Promise<Record<number, number>> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 0,
      locale,
      pagination: false,
      select: { services: true },
      where: { _status: { equals: 'published' } },
    })

    const counts: Record<number, number> = {}
    for (const project of result.docs) {
      for (const service of project.services ?? []) {
        const id = typeof service === 'object' ? service.id : service
        if (typeof id === 'number') counts[id] = (counts[id] ?? 0) + 1
      }
    }

    return counts
  },
)
