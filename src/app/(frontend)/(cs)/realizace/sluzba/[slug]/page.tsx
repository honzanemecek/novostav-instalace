import type { Metadata } from 'next'

import { getServiceBySlug, getServiceSlugs } from '@/domains/services'
import { ProjectsArchivePage } from '@/domains/projects'
import { mergeOpenGraph } from '@/shared/utils/mergeOpenGraph'

export async function generateStaticParams() {
  return getServiceSlugs()
}

type Args = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  return <ProjectsArchivePage serviceSlug={decodeURIComponent(slug)} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const service = await getServiceBySlug(decodeURIComponent(slug))
  const title = service ? `Realizace — ${service.title}` : 'Realizace'

  return {
    title,
    openGraph: mergeOpenGraph({ title, url: `/realizace/sluzba/${slug}` }),
  }
}
