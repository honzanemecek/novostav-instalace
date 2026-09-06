import type { Metadata } from 'next'

import { ProjectsArchivePage } from '@/domains/projects'
import { mergeOpenGraph } from '@/shared/utils/mergeOpenGraph'

export default function Page() {
  return <ProjectsArchivePage />
}

export const metadata: Metadata = {
  title: 'Realizace',
  description: 'Ukázky dokončených staveb, rekonstrukcí a instalací.',
  openGraph: mergeOpenGraph({ title: 'Realizace', url: '/realizace' }),
}
