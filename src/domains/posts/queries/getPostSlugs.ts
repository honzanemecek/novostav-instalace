import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getPostSlugs() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })
  return posts.docs.map(({ slug }) => ({ slug }))
}
