import configPromise from '@payload-config'
import { getPayload } from 'payload'

/** Slugs for `generateStaticParams` — ids and slugs only, no joins. */
export const getServiceSlugs = async (): Promise<{ slug: string }[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'services',
    depth: 0,
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return result.docs.flatMap(({ slug }) => (slug ? [{ slug }] : []))
}
