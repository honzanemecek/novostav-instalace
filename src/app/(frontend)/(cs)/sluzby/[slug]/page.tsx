import type { Metadata } from 'next'

import { getServiceBySlug, getServiceSlugs, ServicePage } from '@/domains/services'
import { generateMeta } from '@/shared/utils/generateMeta'

export async function generateStaticParams() {
  return getServiceSlugs()
}

type Args = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  return <ServicePage slug={decodeURIComponent(slug)} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  return generateMeta({ doc: await getServiceBySlug(decodeURIComponent(slug)) })
}
