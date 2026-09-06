import type { Metadata } from 'next'

import { ServicesArchivePage } from '@/domains/services'
import { mergeOpenGraph } from '@/shared/utils/mergeOpenGraph'

export default function Page() {
  return <ServicesArchivePage locale="en" />
}

export const metadata: Metadata = {
  title: 'Our services',
  description:
    'Building work, roofs, electrical, plumbing, heating and floors for new builds and renovations.',
  openGraph: mergeOpenGraph({ title: 'Our services', url: '/en/sluzby' }),
}
