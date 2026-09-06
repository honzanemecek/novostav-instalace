import React from 'react'

import type { Project, Service } from '@/payload/payload-types'

import { DuoPhoto } from '@/shared/components/DuoPhoto/DuoPhoto'
import { LocalizedLink } from '@/shared/components/LocalizedLink'
import { Tag } from '@/shared/components/Tag/Tag'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/ui'

/** „09/2025“ — dvojciferný měsíc, aby čísla v mřížce neposkakovala. */
const formatCompleted = (value?: string | null): string | null => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

const populatedServices = (project: Project): Service[] =>
  (project.services ?? []).filter((service): service is Service => typeof service === 'object' && service !== null)

type Props = {
  project: Project
  /** `caption` = jen fotka s popiskem (řádek „Další realizace“). */
  variant?: 'full' | 'caption'
  priority?: boolean
  className?: string
}

const CARD_SIZES = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'

/**
 * Realizace v mřížce — nejopakovanější složený prvek návrhu.
 *
 * Žádná karta: fotka, vlasová linka, obsah. Bez zaoblení, bez podkladu, bez
 * zvětšení při najetí — mění se jen barva linky a nadpisu (pravidlo motion:
 * nic se nezvětšuje, nic neposkakuje).
 */
export const ProjectCard: React.FC<Props> = ({ project, variant = 'full', priority, className }) => {
  const completed = formatCompleted(project.completedAt)
  const meta = [project.location, completed].filter(Boolean).join(', ')
  const href = `/realizace/${project.slug}`

  if (variant === 'caption') {
    return (
      <LocalizedLink href={href} className={cn('group block no-underline', className)}>
        <DuoPhoto
          plain
          resource={project.coverImage}
          eyebrow={meta || undefined}
          title={project.title}
          aspect="7 / 5"
          size={CARD_SIZES}
          priority={priority}
        />
      </LocalizedLink>
    )
  }

  const services = populatedServices(project)
  const shown = services.slice(0, 2)
  const rest = services.length - shown.length

  return (
    <article className={cn('group flex h-full flex-col', className)}>
      <DuoPhoto
        plain
        resource={project.coverImage}
        aspect="7 / 5"
        size={CARD_SIZES}
        priority={priority}
        className="transition-colors duration-150"
      />
      <div className="mt-[18px] flex flex-1 flex-col border-t border-border pt-[18px] transition-colors duration-150 group-hover:border-foreground/40">
        {shown.length > 0 && (
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {shown.map((service) => (
              <li key={service.id}>
                <Tag tone="accent" href={`/sluzby/${service.slug}`}>
                  {service.title}
                </Tag>
              </li>
            ))}
            {rest > 0 && (
              <li className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground">+{rest}</li>
            )}
          </ul>
        )}
        {meta && <p className="eyebrow mt-3">{meta}</p>}
        <h3 className="mt-3 text-[19px] leading-[1.3]">
          <LocalizedLink
            href={href}
            className="no-underline transition-colors duration-150 hover:text-accent"
          >
            {project.title}
          </LocalizedLink>
        </h3>
        {project.summary && (
          <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">{project.summary}</p>
        )}
        <div className="mt-auto pt-5">
          <Button asChild variant="outline" size="sm">
            <LocalizedLink href={href} className="no-underline">
              Zobrazit realizaci
            </LocalizedLink>
          </Button>
        </div>
      </div>
    </article>
  )
}
