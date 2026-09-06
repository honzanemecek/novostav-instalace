import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import type { TypedLocale } from 'payload'

import type { Service } from '@/payload/payload-types'

import { RenderBlocks } from '@/domains/pages'
import { ActionRow } from '@/shared/components/ActionRow/ActionRow'
import { Chip } from '@/shared/components/Chip/Chip'
import { DuoPhoto } from '@/shared/components/DuoPhoto/DuoPhoto'
import { FactList } from '@/shared/components/FactList/FactList'
import { LivePreviewListener } from '@/shared/components/LivePreviewListener'
import { PageHero } from '@/shared/components/PageHero/PageHero'
import { RuleLink } from '@/shared/components/RuleLink/RuleLink'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { getProjectBySlug } from '../queries/getProjectBySlug'
import { getProjects } from '../queries/getProjects'
import { ProjectCard } from '../ui/ProjectCard'

/** „Září 2025“ — v sloupci faktů je slovní měsíc čitelnější než 09/2025. */
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

  const services = (project.services ?? []).filter(
    (service): service is Service => typeof service === 'object' && service !== null,
  )
  const completed = formatCompleted(project.completedAt)

  const more = await getProjects({ limit: 3, excludeId: project.id, locale })

  const facts = [
    project.location ? { label: 'Místo', value: project.location } : null,
    completed ? { label: 'Dokončeno', value: completed } : null,
    ...(project.facts ?? []).map((fact) => ({ label: fact.label, value: fact.value })),
  ].filter((fact) => fact !== null)

  return (
    <article>
      {draft && <LivePreviewListener />}

      <PageHero
        breadcrumb={[
          { label: 'Realizace', href: '/realizace' },
          { label: project.title },
        ]}
        eyebrow="Realizace"
        heading={project.title}
        lead={project.summary}
        className="pb-10 md:pb-14"
      />

      {/* Fotografie je LCP — priority, žádná animace při vstupu. */}
      {project.coverImage && (
        <DuoPhoto plain resource={project.coverImage} aspect="16 / 6" priority size="100vw" />
      )}

      <div className="container py-14 md:py-[104px]">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_400px] md:items-start md:gap-20">
          <div>
            {!!project.layout?.length && (
              <>
                <h2 className="sr-only">Průběh</h2>
                <div className="blocks-inline">
                  <RenderBlocks blocks={project.layout} />
                </div>
              </>
            )}
          </div>

          <aside className="flex flex-col gap-10">
            {facts.length > 0 && <FactList items={facts} />}

            {services.length > 0 && (
              <div>
                <h2 className="eyebrow mb-4">Řemesla na této realizaci</h2>
                <ul className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <li key={service.id}>
                      <Chip href={`/sluzby/${service.slug}`} size="sm">
                        {service.title}
                      </Chip>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-border pt-6">
              <h2 className="text-[19px] leading-[1.3]">Máte podobný dům?</h2>
              <p className="mt-2 text-[15px] leading-[1.7] text-muted-foreground">
                Řekněte nám, co potřebujete. Ozveme se týž den.
              </p>
              <ActionRow
                className="mt-5"
                full
                links={[{ link: { type: 'custom', url: '/kontakt', label: 'Nezávazná poptávka' } }]}
              />
            </div>
          </aside>
        </div>
      </div>

      {more.length > 0 && (
        <section className="container pb-14 md:pb-[104px]">
          <SectionHeader
            heading="Další realizace"
            action={<RuleLink href="/realizace">Zpět na přehled</RuleLink>}
          />
          <ul className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
            {more.map((item) => (
              <li key={item.id}>
                <ProjectCard project={item} variant="caption" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
