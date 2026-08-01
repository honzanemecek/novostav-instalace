import type { Metadata } from 'next'

import { DynamicPage, getPageBySlug } from '@/domains/pages'
import { generateMeta } from '@/shared/utils/generateMeta'

export default async function Page() {
  return <DynamicPage slug="home" locale="en" />
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ doc: await getPageBySlug('home', 'en') })
}
