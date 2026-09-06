import React from 'react'

import type { TestimonialsBlock as Props } from '@/payload/payload-types'

import { SectionHeader } from '@/shared/components/SectionHeader'

export const TestimonialsBlock: React.FC<Props> = ({ eyebrow, heading, lead, items }) => {
  if (!items?.length) return null

  return (
    <section className="container">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
      <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.id ?? i}>
            <figure className="flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-6">
              <blockquote className="text-balance leading-relaxed">„{item.quote}“</blockquote>
              <figcaption className="mt-auto text-sm">
                <span className="font-medium">{item.author}</span>
                {item.context && (
                  <span className="block text-muted-foreground">{item.context}</span>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
