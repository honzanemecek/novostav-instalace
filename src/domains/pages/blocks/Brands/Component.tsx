'use client'

import React from 'react'
import { useReducedMotion } from 'motion/react'

import type { BrandsBlock as Props } from '@/payload/payload-types'

import { InfiniteSlider } from '@/shared/ui/motion/infinite-slider'
import { SectionHeader } from '@/shared/components/SectionHeader'

/**
 * Nejširší displej, na kterém má pás vypadat souvisle. `InfiniteSlider`
 * vykresluje přesně dvě kopie svých dětí a posouvá se o polovinu — když je
 * jedna kopie užší než okno, dojede na konec seznamu a za ním zeje prázdno.
 */
const MARQUEE_MIN_WIDTH = 2560

/**
 * Odhad šířky jedné kopie. Nemá být přesný, jen bezpečně nízký: podstřelený
 * odhad znamená o jedno opakování navíc, přestřelený znamená díru v pásu.
 * 19px medium s tracking 0.08em vychází zhruba na 11 px na znak, plus mezera.
 */
const estimateWidth = (names: string[], gap: number) =>
  names.reduce((total, name) => total + name.length * 11 + gap, 0)

/**
 * Materiály a dodavatelé jako pás jmen mezi dvěma vlasovými linkami.
 *
 * Bez log — návrh je sází jako text. Jediný trvale se pohybující prvek na webu,
 * a při `prefers-reduced-motion` stojí.
 */
export const BrandsBlock: React.FC<Props> = ({ eyebrow, heading, lead, items }) => {
  const reduce = useReducedMotion()

  if (!items?.length) return null

  // Seznam zopakujeme tolikrát, aby jedna kopie přesáhla i ten nejširší
  // displej; slider si ji pak zdvojí sám a pás nikde nekončí.
  const gap = 64
  const repeats = Math.max(
    1,
    Math.ceil(MARQUEE_MIN_WIDTH / Math.max(estimateWidth(items.map((item) => item.name), gap), 1)),
  )
  const marqueeItems = Array.from({ length: repeats }, () => items).flat()

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
        <InfiniteSlider gap={gap} speed={reduce ? 0 : 40} speedOnHover={reduce ? 0 : 12}>
          {marqueeItems.map((item, i) => (
            // Kopie nesou stejná `item.id`, klíč proto drží i pořadí.
            <span
              key={`${item.id ?? 'brand'}-${i}`}
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
