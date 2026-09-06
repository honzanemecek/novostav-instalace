import React from 'react'

import type { ButtonProps } from '@/shared/ui/button'

import { CMSLink, type CMSLinkType } from '@/shared/components/Link'
import { cn } from '@/shared/utils/ui'

export type ActionRowLink = {
  link?: CMSLinkType | null
  id?: string | null
}

type Props = {
  links?: ActionRowLink[] | null
  size?: ButtonProps['size']
  onSlab?: boolean
  /** Tlačítka přes celou šířku na mobilu. */
  full?: boolean
  className?: string
}

/**
 * Skupina tlačítek z Payload `linkGroup`.
 *
 * **Mechanicky vynucuje systémové pravidlo č. 3:** na obrazovce je jedna
 * akcentní akce. První odkaz je `accent`, druhý `outline`, třetí a další
 * `quiet`. Kdyby o variantě rozhodoval redaktor, skončí web se třemi modrými
 * tlačítky vedle sebe.
 */
export const ActionRow: React.FC<Props> = ({ links, size = 'default', onSlab = false, full = false, className }) => {
  const items = (links ?? []).filter((item): item is ActionRowLink & { link: CMSLinkType } => Boolean(item?.link))
  if (!items.length) return null

  const variantAt = (index: number): ButtonProps['variant'] => {
    if (index === 0) return onSlab ? 'onSlab' : 'accent'
    if (index === 1) return onSlab ? 'onSlabOutline' : 'outline'
    return 'quiet'
  }

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4', className)}>
      {items.map(({ link, id }, i) => (
        <CMSLink
          key={id ?? i}
          {...link}
          appearance={variantAt(i)}
          size={size}
          phone={link.type === 'custom' && Boolean(link.url?.startsWith('tel:'))}
          full={full}
          className={full ? 'sm:w-auto' : undefined}
        />
      ))}
    </div>
  )
}
