import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import type { TypedLocale } from 'payload'

import { LivePreviewListener } from '@/shared/components/LivePreviewListener'
import { LocalizedLink } from '@/shared/components/LocalizedLink'
import { Media } from '@/shared/components/Media'
import { RenderBlocks } from '@/domains/pages'
import { getProjectBySlug } from '../queries/getProjectBySlug'

const formatCompleted = (value?: string | null): string | null => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(date)
}

export async function ProjectPage({
  slug,
  locale = 'cs',
}: {
  slug: string
  locale?: TypedLocale
}) {
  const { isEnabled: draft } = await draftMode()
  const project = await getProjectBySlug(slug, locale)

  if (!project) notFound()

  const services = (project.services ?? []).filter((service) => typeof service === 'object')
  const completed = formatCompleted(project.completedAt)

  return (
    <article className="pb-24">
      {draft && <LivePreviewListener />}

      <header className="container pt-12 md:pt-16">
        <p className="text-sm text-muted-foreground">
          <LocalizedLink className="underline-offset-4 hover:underline" href="/realizace">
            Realizace
          </LocalizedLink>
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          {project.title}
        </h1>
        {project.summary && (
          <p className="mt-5 max-w-prose text-lg text-muted-foreground">{project.summary}</p>
        )}

        {!!services.length && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.id}>
                <LocalizedLink
                  className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-sm transition-colors hover:border-foreground/25"
                  href={`/sluzby/${service.slug}`}
                >
                  {service.title}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        )}
      </header>

      {project.coverImage && (
        <div className="container mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-card">
            <Media
              resource={project.coverImage}
              fill
              priority
              imgClassName="object-cover"
              size="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>
      )}

      {(project.location || completed || !!project.facts?.length) && (
        <div className="container mt-10">
          <dl className="grid gap-6 rounded-lg border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
            {project.location && (
              <div>
                <dt className="text-sm text-muted-foreground">Místo</dt>
                <dd className="mt-1 font-medium">{project.location}</dd>
              </div>
            )}
            {completed && (
              <div>
                <dt className="text-sm text-muted-foreground">Dokončeno</dt>
                <dd className="mt-1 font-medium">{completed}</dd>
              </div>
            )}
            {(project.facts ?? []).map((fact, i) => (
              <div key={fact.id ?? i}>
                <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                <dd className="mt-1 font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <RenderBlocks blocks={project.layout} />
    </article>
  )
}
