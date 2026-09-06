import React from 'react'

import type { Media as MediaType } from '@/payload/payload-types'

import { Media } from '@/shared/components/Media'
import { cn } from '@/shared/utils/ui'

type Props = {
  resource?: MediaType | string | number | null
  eyebrow?: string | null
  title?: string | null
  /** `true` = běžná fotografie; `false` = tištěná do modři (jen na `.slab`). */
  plain?: boolean
  /** CSS `aspect-ratio`. Stejný pro fotku i pro stav „doplníme“ — jinak mřížka poskočí. */
  aspect?: string
  priority?: boolean
  /** `sizes` pro `next/image`. */
  size?: string
  className?: string
}

const CAPTION_GRADIENT =
  'linear-gradient(to top, oklch(0.2 0.045 240 / 0.88), oklch(0.2 0.045 240 / 0.72) 46%, oklch(0.2 0.045 240 / 0))'

/**
 * Fotografie s popiskem — nejčastěji instancovaný prvek celého návrhu.
 *
 * Bez fotky **nikdy nevznikne díra**: vykreslí se stav „Fotografii doplníme.“ ve
 * stejném poměru stran, takže den, kdy fotka dorazí, nepohne rozvržením (CLS).
 * Skladová fotografie není náhrada — do webu jde jen skutečné médium z Payloadu.
 */
export const DuoPhoto: React.FC<Props> = ({
  resource,
  eyebrow,
  title,
  plain = false,
  aspect = '4 / 3',
  priority,
  size,
  className,
}) => {
  const hasImage = typeof resource === 'object' && resource !== null && Boolean(resource.url)

  if (!hasImage) {
    return (
      <div
        className={cn('flex flex-col justify-between gap-6 border border-border bg-secondary p-5', className)}
        style={{ aspectRatio: aspect }}
      >
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <div>
          {title && <p className="text-[19px] font-semibold leading-[1.3]">{title}</p>}
          <p className="mt-1 text-[15px] leading-[1.7] text-muted-foreground">Fotografii doplníme.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden', plain ? 'bg-secondary' : 'duotone', className)}
      style={{ aspectRatio: aspect }}
    >
      <Media htmlElement={null} resource={resource} fill imgClassName="object-cover" priority={priority} size={size} />
      {(eyebrow || title) && (
        <div
          className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-[34px]"
          style={{ backgroundImage: CAPTION_GRADIENT }}
        >
          {eyebrow && <p className="eyebrow text-white/70">{eyebrow}</p>}
          {title && <p className="mt-2 text-[19px] font-semibold leading-[1.3] text-white">{title}</p>}
        </div>
      )}
    </div>
  )
}
