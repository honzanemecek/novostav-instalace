import React from 'react'

import type { BreadcrumbItem } from '@/shared/components/Breadcrumb/Breadcrumb'
import type { Fact } from '@/shared/components/FactList/FactList'

import { Breadcrumb } from '@/shared/components/Breadcrumb/Breadcrumb'
import { FactList } from '@/shared/components/FactList/FactList'
import { cn } from '@/shared/utils/ui'

type Rail = 'sm' | 'md' | 'lg'

const railWidths: Record<Rail, string> = {
  sm: 'md:grid-cols-[minmax(0,1fr)_340px]',
  md: 'md:grid-cols-[minmax(0,1fr)_380px]',
  lg: 'md:grid-cols-[minmax(0,1fr)_420px]',
}

type Props = {
  eyebrow?: string | null
  heading: string
  lead?: string | null
  breadcrumb?: BreadcrumbItem[] | null
  /** Typicky `<ActionRow>`. */
  actions?: React.ReactNode
  facts?: Fact[] | null
  /** Vlastní obsah pravého sloupce místo `facts`. */
  rail?: React.ReactNode
  railWidth?: Rail
  align?: 'start' | 'end'
  as?: 'h1' | 'h2'
  className?: string
}

/**
 * Otevření stránky: štítek → nadpis → perex → akce, vpravo sloupec faktů.
 *
 * Sedm z devíti obrazovek návrhu začíná přesně touhle mřížkou. Bez společného
 * komponentu by se sedmkrát vysázela ručně — a sedmkrát trochu jinak.
 */
export const PageHero: React.FC<Props> = ({
  eyebrow,
  heading,
  lead,
  breadcrumb,
  actions,
  facts,
  rail,
  railWidth = 'md',
  align = 'start',
  as: Heading = 'h1',
  className,
}) => {
  const aside = rail ?? (facts?.length ? <FactList items={facts} /> : null)

  return (
    <section className={cn('container py-14 md:py-[104px]', className)}>
      <div
        className={cn(
          'grid gap-12',
          aside && cn(railWidths[railWidth], 'md:gap-20', align === 'end' ? 'md:items-end' : 'md:items-start'),
        )}
      >
        <div>
          {breadcrumb?.length ? <Breadcrumb items={breadcrumb} className="mb-8" /> : null}
          {eyebrow && <p className="eyebrow mb-[18px] text-accent">{eyebrow}</p>}
          <Heading className="max-w-[22ch]">{heading}</Heading>
          {lead && <p className="mt-6 max-w-[44ch] text-[19px] leading-[1.7] text-muted-foreground">{lead}</p>}
          {actions && <div className="mt-9">{actions}</div>}
        </div>
        {aside}
      </div>
    </section>
  )
}
