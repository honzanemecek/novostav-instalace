import type { Metadata } from 'next'

import { getProjectBySlug, getProjectSlugs, ProjectPage } from '@/domains/projects'
import { generateMeta } from '@/shared/utils/generateMeta'

export async function generateStaticParams() {
  return getProjectSlugs()
}

type Args = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  return <ProjectPage slug={decodeURIComponent(slug)} locale="en" />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  return generateMeta({ doc: await getProjectBySlug(decodeURIComponent(slug), 'en') })
}
