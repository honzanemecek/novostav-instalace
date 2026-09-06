import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const getProjectSlugs = async (): Promise<{ slug: string }[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    depth: 0,
    draft: false,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return result.docs.flatMap(({ slug }) => (slug ? [{ slug }] : []))
}
