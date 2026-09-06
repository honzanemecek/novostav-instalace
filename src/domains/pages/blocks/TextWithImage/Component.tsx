import React from 'react'

import type { TextWithImageBlock as Props } from '@/payload/payload-types'

import RichText from '@/shared/components/RichText'
import { CMSLink } from '@/shared/components/Link'
import { Media } from '@/shared/components/Media'
import { cn } from '@/shared/utils/ui'

export const TextWithImageBlock: React.FC<Props> = ({
  image,
  imagePosition,
  richText,
  links,
}) => (
  <section className="container">
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div
        className={cn(
          'relative aspect-[4/3] overflow-hidden rounded-lg bg-card',
          imagePosition === 'left' ? 'lg:order-first' : 'lg:order-last',
        )}
      >
        <Media
          resource={image}
          fill
          imgClassName="object-cover"
          size="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-col items-start gap-6">
        {richText && <RichText data={richText} enableGutter={false} />}
        {!!links?.length && (
          <div className="flex flex-wrap gap-3">
            {links.map(({ link }, i) => (
              <CMSLink key={i} size="lg" {...link} />
            ))}
          </div>
        )}
      </div>
    </div>
  </section>
)
