import type { Metadata } from 'next'

import { DynamicPage, getPageBySlug, getPageSlugs } from '@/domains/pages'
import { generateMeta } from '@/shared/utils/generateMeta'

export async function generateStaticParams() {
  return getPageSlugs()
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  return <DynamicPage slug={decodeURIComponent(slug)} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await getPageBySlug(decodeURIComponent(slug))
  return generateMeta({ doc: page })
}
