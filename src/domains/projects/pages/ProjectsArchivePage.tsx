import React from 'react'
import type { TypedLocale } from 'payload'

import { getServices } from '@/domains/services'
import { ActionRow } from '@/shared/components/ActionRow/ActionRow'
import { Chip } from '@/shared/components/Chip/Chip'
import { PageHero } from '@/shared/components/PageHero/PageHero'
import { Slab } from '@/shared/components/Slab/Slab'
import { getProjectCountsByService } from '../queries/getProjectCountsByService'
import { getProjects } from '../queries/getProjects'
import { ProjectCard } from '../ui/ProjectCard'

/**
 * The portfolio. Filtering is a set of links rather than client-side state so
 * every filtered view is its own crawlable, shareable URL — and the cross-fade
 * across that navigation is what keeps it from reading as a white flash.
 */
export async function ProjectsArchivePage({
  serviceSlug,
  locale = 'cs',
}: {
  serviceSlug?: string
  locale?: TypedLocale
} = {}) {
  const [services, { byService, total }] = await Promise.all([
    getServices(locale),
    getProjectCountsByService(locale),
  ])
  const activeService = serviceSlug
    ? services.find((service) => service.slug === serviceSlug)
    : undefined

  const projects = await getProjects({
    limit: 60,
    serviceId: activeService?.id,
    locale,
  })

  return (
    <article>
      <PageHero
        eyebrow="Portfolio"
        heading="Realizace"
        lead="Ukázky dokončených prací — od rekonstrukcí bytových jader po střechy a elektroinstalace."
        className="pb-8 md:pb-12"
      />

      {services.length > 0 && (
        <nav aria-label="Filtr podle služby" className="border-b border-border">
          {/* Na mobilu se řádek posouvá vodorovně — filtry nikdy nezalomí do tří řádků. */}
          <div className="container overflow-x-auto pb-5">
            <ul className="flex w-max gap-2 md:w-auto md:flex-wrap">
              <li>
                <Chip href="/realizace" active={!activeService} count={total || undefined}>
                  Vše
                </Chip>
              </li>
              {services.map((service) => (
                <li key={service.id}>
                  <Chip
                    href={`/realizace/sluzba/${service.slug}`}
                    active={activeService?.id === service.id}
                    count={byService[service.id] ?? 0}
                  >
                    {service.title}
                  </Chip>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* React's <ViewTransition> would cross-fade this grid across the filter
          navigation, but it ships only in react@experimental — moving the whole
          stack onto an experimental React for one transition is not a trade
          worth making. Revisit when it lands in a stable release. */}
      <section className="container py-14 md:py-[104px]">
        {projects.length ? (
          <ul className="grid gap-x-8 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <li key={project.id} className="flex">
                <ProjectCard project={project} className="w-full" priority={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="max-w-[52ch] text-[17px] leading-[1.7] text-muted-foreground">
            {activeService
              ? `Pro službu „${activeService.title}“ zatím nemáme zveřejněnou žádnou realizaci.`
              : 'Zatím zde nejsou žádné realizace. Přidejte je v administraci.'}
          </p>
        )}
      </section>

      <Slab pad="md">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-14">
          <div>
            <h2 className="max-w-[26ch]">Podobný dům, podobná práce?</h2>
            <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.7] text-slab-muted">
              Řekněte nám, co potřebujete. Ozveme se týž den.
            </p>
          </div>
          <ActionRow
            onSlab
            size="lg"
            links={[{ link: { type: 'custom', url: '/kontakt', label: 'Nezávazná poptávka' } }]}
          />
        </div>
      </Slab>
    </article>
  )
}
