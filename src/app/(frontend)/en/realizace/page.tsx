import type { Metadata } from 'next'

import { ProjectsArchivePage } from '@/domains/projects'
import { mergeOpenGraph } from '@/shared/utils/mergeOpenGraph'

export default function Page() {
  return <ProjectsArchivePage locale="en" />
}

export const metadata: Metadata = {
  title: 'Our work',
  description: 'Completed builds, renovations and installations.',
  openGraph: mergeOpenGraph({ title: 'Our work', url: '/en/realizace' }),
}
