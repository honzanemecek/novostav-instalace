import { cache } from 'react'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload, type TypedLocale, type Where } from 'payload'

import type { Project } from '@/payload/payload-types'

export type ProjectListOptions = {
  limit?: number
  featured?: boolean
  /** Filter by service id — the taxonomy that drives "ukázky našich střech". */
  serviceId?: number | string
  /** Leave one project out — "Další realizace" must not list the page you are on. */
  excludeId?: number | string
  locale?: TypedLocale
}

/**
 * Published projects, newest completion first. Used by the archive page and by
 * the ProjectShowcase block.
 */
export const getProjects = cache(
  async ({
    limit = 12,
    featured,
    serviceId,
    excludeId,
    locale = 'cs',
  }: ProjectListOptions = {}): Promise<Project[]> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const and: Where[] = []
    if (featured) and.push({ featured: { equals: true } })
    if (serviceId) and.push({ services: { in: [serviceId] } })
    if (excludeId) and.push({ id: { not_equals: excludeId } })

    const result = await payload.find({
      collection: 'projects',
      depth: 1,
      draft,
      limit,
      locale,
      overrideAccess: draft,
      pagination: false,
      sort: '-completedAt',
      ...(and.length ? { where: { and } } : {}),
    })

    return result.docs
  },
)
