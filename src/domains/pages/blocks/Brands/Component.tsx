'use client'

import React from 'react'

import type { BrandsBlock as Props } from '@/payload/payload-types'

import { InfiniteSlider } from '@/shared/ui/motion/infinite-slider'
import { Media } from '@/shared/components/Media'
import { SectionHeader } from '@/shared/components/SectionHeader'

export const BrandsBlock: React.FC<Props> = ({ eyebrow, heading, lead, items }) => {
  if (!items?.length) return null

  return (
    <section>
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
      </div>
      {/* Decorative: the marquee duplicates its children, so screen readers get
          the plain list below instead of every brand twice. */}
      <div aria-hidden className="mt-10">
        <InfiniteSlider gap={64} speed={40} speedOnHover={10}>
          {items.map((item, i) => (
            <div key={item.id ?? i} className="flex h-12 items-center">
              {item.logo ? (
                <Media
                  resource={item.logo}
                  imgClassName="h-10 w-auto object-contain opacity-70 grayscale"
                  alt={item.name}
                />
              ) : (
                <span className="text-xl font-medium tracking-tight text-muted-foreground">
                  {item.name}
                </span>
              )}
            </div>
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
