import React from 'react'

import type { TestimonialsBlock as Props } from '@/payload/payload-types'

import { SectionHeader } from '@/shared/components/SectionHeader'

/** Reference na vlasových linkách — žádné karty, žádné uvozovkové ornamenty. */
export const TestimonialsBlock: React.FC<Props> = ({ eyebrow, heading, lead, items }) => {
  if (!items?.length) return null

  return (
    <section className="container py-14 md:py-[104px]">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
      <ul className="mt-12 grid gap-x-14 gap-y-[2px] md:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.id ?? i} className="border-t border-border pb-[30px] pt-[26px]">
            <figure className="flex h-full flex-col">
              <blockquote className="max-w-[52ch] text-base leading-[1.75]">
                „{item.quote}“
              </blockquote>
              <figcaption className="mt-5 text-sm leading-[1.6]">
                <span className="font-semibold">{item.author}</span>
                {item.context && <span className="block text-muted-foreground">{item.context}</span>}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
