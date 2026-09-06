import React from 'react'

import type { TextWithImageBlock as Props } from '@/payload/payload-types'

import { ActionRow } from '@/shared/components/ActionRow/ActionRow'
import { DuoPhoto } from '@/shared/components/DuoPhoto/DuoPhoto'
import RichText from '@/shared/components/RichText'
import { cn } from '@/shared/utils/ui'

/**
 * Fotografie a textový panel vedle sebe. Výchozí podoba je přes celou šířku
 * okna, dělená vlasovou linkou — žádné zaoblení a žádný rámeček s poměrem 4/3.
 */
export const TextWithImageBlock: React.FC<Props> = ({
  image,
  imagePosition,
  duotone,
  fullBleed,
  richText,
  links,
}) => {
  const imageLeft = imagePosition === 'left'

  const photo = (
    <DuoPhoto
      resource={image}
      plain={!duotone}
      aspect="4 / 3"
      size="(max-width: 768px) 100vw, 55vw"
      className={imageLeft ? 'md:order-first' : 'md:order-last'}
    />
  )

  const panel = (
    <div
      className={cn(
        'flex flex-col items-start justify-center gap-6',
        fullBleed !== false ? 'bg-card px-5 py-9 md:px-[34px]' : '',
      )}
    >
      {richText && <RichText data={richText} enableGutter={false} />}
      <ActionRow links={links} />
    </div>
  )

  if (fullBleed !== false) {
    return (
      <section
        className={cn(
          'hairline-grid border-y border-border',
          imageLeft ? 'md:grid-cols-[1.3fr_1fr]' : 'md:grid-cols-[1fr_1.3fr]',
        )}
      >
        {photo}
        {panel}
      </section>
    )
  }

  return (
    <section className="container py-14 md:py-[104px]">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        {photo}
        {panel}
      </div>
    </section>
  )
}
