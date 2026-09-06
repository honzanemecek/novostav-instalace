import React from 'react'

import type { CallToActionBlock as Props } from '@/payload/payload-types'

import { ActionRow } from '@/shared/components/ActionRow/ActionRow'
import RichText from '@/shared/components/RichText'
import { Slab } from '@/shared/components/Slab/Slab'

/**
 * Závěrečná výzva. Buď na střed na bílém podkladu, nebo na modré ploše s textem
 * vlevo a akcemi vpravo. Žádná rámovaná karta — ta patřila starému systému.
 */
export const CallToActionBlock: React.FC<Props> = ({ links, richText, variant }) => {
  if (variant === 'slab') {
    return (
      <Slab pad="md">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-14">
          {richText && (
            <RichText
              className="max-w-none [&_h2]:max-w-[26ch] [&_p]:mt-4 [&_p]:max-w-[46ch] [&_p]:text-[17px] [&_p]:text-slab-muted"
              data={richText}
              enableGutter={false}
              enableProse={false}
            />
          )}
          <ActionRow links={links} size="lg" onSlab />
        </div>
      </Slab>
    )
  }

  // Centrování si blok drží sám — `SectionHeader` už align="center" nezná.
  return (
    <section className="container py-20 md:py-24">
      <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
        {richText && (
          <RichText
            className="max-w-none [&_h2]:mx-auto [&_h2]:max-w-[26ch] [&_p]:mx-auto [&_p]:mt-5 [&_p]:max-w-[42ch] [&_p]:text-[17px] [&_p]:text-muted-foreground"
            data={richText}
            enableGutter={false}
            enableProse={false}
          />
        )}
        <ActionRow links={links} size="lg" className="mt-9 justify-center" />
      </div>
    </section>
  )
}
