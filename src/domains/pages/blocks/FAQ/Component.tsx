'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

import type { FAQBlock as Props } from '@/payload/payload-types'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/motion/accordion'
import { SectionHeader } from '@/shared/components/SectionHeader'

export const FAQBlock: React.FC<Props> = ({ eyebrow, heading, lead, items }) => {
  if (!items?.length) return null

  return (
    <section className="container">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
      <Accordion
        className="mt-10 max-w-3xl divide-y divide-border border-y border-border"
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      >
        {items.map((item, i) => (
          <AccordionItem key={item.id ?? i} value={item.id ?? i}>
            <AccordionTrigger className="flex w-full items-center justify-between gap-4 py-5 text-left">
              <span className="text-base font-medium">{item.question}</span>
              <ChevronDown
                aria-hidden
                className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-expanded:rotate-180"
              />
            </AccordionTrigger>
            <AccordionContent>
              <p className="pb-5 pr-10 text-muted-foreground leading-relaxed">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
