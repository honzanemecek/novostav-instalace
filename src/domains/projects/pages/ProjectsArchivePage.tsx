import React from 'react'
import type { TypedLocale } from 'payload'

import { LocalizedLink } from '@/shared/components/LocalizedLink'
import { getServices } from '@/domains/services'
import { getProjects } from '../queries/getProjects'
import { ProjectCard } from '../ui/ProjectCard'

/**
 * The portfolio. Filtering is a set of links rather than client-side state so
 * every filtered view is its own crawlable, shareable URL.
 */
export async function ProjectsArchivePage({
  serviceSlug,
  locale = 'cs',
}: {
  serviceSlug?: string
  locale?: TypedLocale
} = {}) {
  const services = await getServices(locale)
  const activeService = serviceSlug
    ? services.find((service) => service.slug === serviceSlug)
    : undefined

  const projects = await getProjects({
    limit: 60,
    serviceId: activeService?.id,
    locale,
  })

  return (
    <div className="container py-16 md:py-24">
      <header className="flex max-w-3xl flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Realizace</h1>
        <p className="text-lg text-muted-foreground">
          Ukázky dokončených prací — od rekonstrukcí bytových jader po střechy a elektroinstalace.
        </p>
      </header>

      {services.length > 0 && (
        <nav aria-label="Filtr podle služby" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            <li>
              <LocalizedLink
                aria-current={activeService ? undefined : 'page'}
                className="inline-flex rounded-full border border-border px-4 py-2 text-sm transition-colors aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground hover:border-foreground/25"
                href="/realizace"
              >
                Vše
              </LocalizedLink>
            </li>
            {services.map((service) => (
              <li key={service.id}>
                <LocalizedLink
                  aria-current={activeService?.id === service.id ? 'page' : undefined}
                  className="inline-flex rounded-full border border-border px-4 py-2 text-sm transition-colors aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground hover:border-foreground/25"
                  href={`/realizace/sluzba/${service.slug}`}
                >
                  {service.title}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {projects.length ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-muted-foreground">
          {activeService
            ? `Pro službu „${activeService.title}“ zatím nemáme zveřejněnou žádnou realizaci.`
            : 'Zatím zde nejsou žádné realizace. Přidejte je v administraci.'}
        </p>
      )}
    </div>
  )
}
