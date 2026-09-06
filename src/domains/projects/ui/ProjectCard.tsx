import React from 'react'

import type { Project } from '@/payload/payload-types'

import { LocalizedLink } from '@/shared/components/LocalizedLink'
import { Media } from '@/shared/components/Media'

const formatCompleted = (value?: string | null): string | null => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(date)
}

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const completed = formatCompleted(project.completedAt)
  const meta = [project.location, completed].filter(Boolean).join(' · ')

  return (
    <LocalizedLink
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/25"
      href={`/realizace/${project.slug}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {project.coverImage ? (
          <Media
            resource={project.coverImage}
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {meta && <p className="text-xs uppercase tracking-wide text-muted-foreground">{meta}</p>}
        <h3 className="text-lg font-semibold leading-snug">{project.title}</h3>
        {project.summary && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        )}
      </div>
    </LocalizedLink>
  )
}
