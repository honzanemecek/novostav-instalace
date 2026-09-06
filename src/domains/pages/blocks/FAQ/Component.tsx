'use client'

import React from 'react'

import type { FAQBlock as Props } from '@/payload/payload-types'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/motion/accordion'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { cn } from '@/shared/utils/ui'

/**
 * Časté dotazy. Nadpis vlevo, dotazy vpravo.
 *
 * Ukazatel je **`+` / `−`**, ne otáčející se šipka a rozhodně ne karta: znak se
 * jen překlopí a přebarví, nic se netočí.
 */
export const FAQBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  lead,
  anchor,
  defaultOpenFirst,
  items,
}) => {
  const firstValue = items?.[0]?.id ?? 0
  const [expanded, setExpanded] = React.useState<React.Key | null>(
    defaultOpenFirst !== false ? firstValue : null,
  )

  if (!items?.length) return null

  return (
    <section
      className="container scroll-mt-24 py-14 md:scroll-mt-32 md:py-[104px]"
      id={anchor || undefined}
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-20">
        <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
        <Accordion
          expandedValue={expanded}
          onValueChange={setExpanded}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        >
          {items.map((item, i) => {
            const value = item.id ?? i
            const open = expanded === value
            return (
              <AccordionItem
                key={value}
                value={value}
                className={cn('border-t border-border', i === items.length - 1 && 'border-b')}
              >
                <AccordionTrigger className="flex w-full items-start justify-between gap-6 py-6 text-left">
                  <span className="text-xl font-semibold leading-[1.3] tracking-[-0.02em]">
                    {item.question}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'mt-1 shrink-0 text-lg leading-none transition-colors duration-150',
                      open ? 'text-accent' : 'text-muted-foreground',
                    )}
                  >
                    {open ? '−' : '+'}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="max-w-[60ch] pb-6 text-base leading-[1.75] text-muted-foreground">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}
