import React from 'react'

import type { Media, PhotoStripBlock as Props } from '@/payload/payload-types'

import { getProjects } from '@/domains/projects'
import { DuoPhoto } from '@/shared/components/DuoPhoto/DuoPhoto'
import { cn } from '@/shared/utils/ui'

type Photo = {
  resource?: Media | number | null
  eyebrow?: string | null
  title?: string | null
}

/** „Kladno, 09/2025“ — stejný tvar jako na kartě realizace. */
const completedLabel = (location?: string | null, completedAt?: string | null): string => {
  const date = completedAt ? new Date(completedAt) : null
  const stamp =
    date && !Number.isNaN(date.getTime())
      ? `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
      : null
  return [location, stamp].filter(Boolean).join(', ')
}

/**
 * Pás fotografií přes celou šířku okna. Vykresluje se bez `.container`, aby
 * doopravdy dosáhl k hranám, a vlasová linka je mezerou mřížky — ne rámečkem.
 */
export const PhotoStripBlock: React.FC<Props> = async ({ source, limit, plain, service, items }) => {
  const count = limit === '2' ? 2 : 3

  let photos: Photo[]

  if (source === 'manual') {
    photos = (items ?? []).map((item) => ({
      resource: item.image,
      eyebrow: item.eyebrow,
      title: item.title,
    }))
  } else {
    const serviceId = typeof service === 'object' ? service?.id : service
    const projects = await getProjects({
      limit: count,
      featured: source === 'featured',
      serviceId: source === 'service' ? (serviceId ?? undefined) : undefined,
    })
    photos = projects.map((project) => ({
      resource: project.coverImage,
      eyebrow: completedLabel(project.location, project.completedAt),
      title: project.title,
    }))
  }

  const shown = photos.slice(0, count)
  if (!shown.length) return null

  const sizes = shown.length === 2 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'

  return (
    <section
      className={cn(
        'hairline-grid border-y border-border',
        shown.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3',
      )}
    >
      {shown.map((photo, i) => (
        <DuoPhoto
          key={i}
          resource={photo.resource}
          eyebrow={photo.eyebrow}
          title={photo.title}
          plain={plain !== false}
          aspect="4 / 3"
          size={sizes}
        />
      ))}
    </section>
  )
}
