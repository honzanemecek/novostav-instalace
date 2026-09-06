import React from 'react'

import type { FeatureGridBlock as Props } from '@/payload/payload-types'

import { ServiceIcon } from '@/domains/services'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { cn } from '@/shared/utils/ui'

const columnClasses: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

export const FeatureGridBlock: React.FC<Props> = ({ eyebrow, heading, lead, columns, items }) => {
  if (!items?.length) return null

  return (
    <section className="container py-14 md:py-[104px]">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
      <ul className={cn('mt-10 grid gap-6', columnClasses[columns ?? '3'])}>
        {items.map((item, i) => (
          <li
            key={item.id ?? i}
            className="bg-card border border-border rounded-lg p-6 flex flex-col gap-3"
          >
            <ServiceIcon name={item.icon} className="size-7 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            {item.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
