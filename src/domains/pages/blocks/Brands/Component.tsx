'use client'

import React from 'react'
import { useReducedMotion } from 'motion/react'

import type { BrandsBlock as Props } from '@/payload/payload-types'

import { InfiniteSlider } from '@/shared/ui/motion/infinite-slider'
import { SectionHeader } from '@/shared/components/SectionHeader'

/**
 * Materiály a dodavatelé jako pás jmen mezi dvěma vlasovými linkami.
 *
 * Bez log — návrh je sází jako text. Jediný trvale se pohybující prvek na webu,
 * a při `prefers-reduced-motion` stojí.
 */
export const BrandsBlock: React.FC<Props> = ({ eyebrow, heading, lead, items }) => {
  const reduce = useReducedMotion()

  if (!items?.length) return null

  return (
    <section className="py-14 md:py-[104px]">
      {(eyebrow || heading || lead) &&
        (heading || lead ? (
          <div className="container mb-10">
            <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
          </div>
        ) : (
          <div className="container">
            <p className="eyebrow mb-6">{eyebrow}</p>
          </div>
        ))}
      {/* Decorative: the marquee duplicates its children, so screen readers get
          the plain list below instead of every brand twice. */}
      <div
        aria-hidden
        className="overflow-hidden border-y border-border py-[22px] md:py-[30px]"
      >
        <InfiniteSlider gap={64} speed={reduce ? 0 : 40} speedOnHover={reduce ? 0 : 12}>
          {items.map((item, i) => (
            <span
              key={item.id ?? i}
              className="text-[19px] font-medium tracking-[0.08em] text-[oklch(0.42_0.008_250)] dark:text-muted-foreground"
            >
              {item.name}
            </span>
          ))}
        </InfiniteSlider>
      </div>
      <ul className="sr-only">
        {items.map((item, i) => (
          <li key={item.id ?? i}>{item.name}</li>
        ))}
      </ul>
    </section>
  )
}
