import React from 'react'

import type { ProjectShowcaseBlock as Props } from '@/payload/payload-types'

import { CMSLink } from '@/shared/components/Link'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { getProjects } from '../../queries/getProjects'
import { ProjectCard } from '../../ui/ProjectCard'

export const ProjectShowcaseBlock: React.FC<Props> = async ({
  eyebrow,
  heading,
  lead,
  source,
  limit,
  service,
  links,
}) => {
  const serviceId = typeof service === 'object' ? service?.id : service

  const projects = await getProjects({
    limit: limit ?? 3,
    featured: source === 'featured',
    serviceId: source === 'service' ? (serviceId ?? undefined) : undefined,
  })

  // An empty showcase is worse than none — say nothing rather than show a gap.
  if (!projects.length) return null

  return (
    <section className="container py-14 md:py-[104px]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
        {!!links?.length && (
          <div className="flex gap-3">
            {links.map(({ link }, i) => (
              <CMSLink key={i} {...link} />
            ))}
          </div>
        )}
      </div>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  )
}
