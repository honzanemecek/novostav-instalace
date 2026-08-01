import type { Metadata } from 'next'

import { PostPage, getPostBySlug, getPostSlugs } from '@/domains/posts'
import { generateMeta } from '@/shared/utils/generateMeta'

export async function generateStaticParams() {
  return getPostSlugs()
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  return <PostPage slug={decodeURIComponent(slug)} locale="en" />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await getPostBySlug(decodeURIComponent(slug), 'en')
  return generateMeta({ doc: post })
}
