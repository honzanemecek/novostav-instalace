import React from 'react'

import type { ProjectShowcaseBlock as Props } from '@/payload/payload-types'

import { RuleLink } from '@/shared/components/RuleLink/RuleLink'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { cmsLinkHref } from '@/shared/components/Link'
import { getProjects } from '../../queries/getProjects'
import { ProjectCard } from '../../ui/ProjectCard'

export const ProjectShowcaseBlock: React.FC<Props> = async ({
  eyebrow,
  heading,
  lead,
  source,
  service,
  limit,
  links,
}) => {
  const serviceId = typeof service === 'object' ? service?.id : service

  const projects = await getProjects({
    limit: limit ?? 3,
    featured: source === 'featured',
    serviceId: source === 'service' ? (serviceId ?? undefined) : undefined,
  })

  if (!projects.length) return null

  // Odkaz „dál“ patří na účaří hlavičky jako textový odkaz, ne jako tlačítko —
  // na obrazovce smí být jedna akcentní akce.
  const first = links?.[0]?.link
  const href = cmsLinkHref(first)
  const action =
    href && first?.label ? (
      <RuleLink href={href}>{first.label}</RuleLink>
    ) : null

  return (
    <section className="container py-14 md:py-[104px]">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} action={action} />
      <ul className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id} className="flex">
            <ProjectCard project={project} className="w-full" />
          </li>
        ))}
      </ul>
    </section>
  )
}
