import type { Metadata } from 'next'

import { ServicesArchivePage } from '@/domains/services'
import { mergeOpenGraph } from '@/shared/utils/mergeOpenGraph'

export default function Page() {
  return <ServicesArchivePage />
}

export const metadata: Metadata = {
  title: 'Naše služby',
  description:
    'Stavební práce, střechy, elektroinstalace, vodoinstalace, topení a podlahy pro novostavby i rekonstrukce.',
  openGraph: mergeOpenGraph({ title: 'Naše služby', url: '/sluzby' }),
}
