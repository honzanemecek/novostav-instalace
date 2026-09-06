import React from 'react'

import { HairlineRow } from '@/shared/components/HairlineRow/HairlineRow'
import { cn } from '@/shared/utils/ui'

export type Fact = {
  label: string
  value: React.ReactNode
}

type Props = {
  items: Fact[]
  onSlab?: boolean
  /** Zarovnání hodnoty. Vpravo je výchozí — sloupec faktů u hlavičky stránky. */
  align?: 'left' | 'right'
  className?: string
}

/**
 * Fakta jako řádky na vlasových linkách: štítek → hodnota.
 *
 * **Žádná nafouknutá čísla, žádné ikony.** Nejčastěji pravý sloupec hlavičky
 * stránky.
 */
export const FactList: React.FC<Props> = ({ items, onSlab = false, align = 'right', className }) => {
  if (!items.length) return null


  return (
    <dl className={cn('w-full', className)}>
      {items.map((item, i) => (
        <HairlineRow
          key={`${item.label}-${i}`}
          index={i}
          stagger={0.04}
          onSlab={onSlab}
          bottomRule={i === items.length - 1}
          className="flex items-baseline justify-between gap-6 py-[15px]"
        >
          <dt className={cn('shrink-0 text-xs', onSlab ? 'text-slab-muted' : 'text-muted-foreground')}>
            {item.label}
          </dt>
          <dd
            className={cn(
              'max-w-[22ch] text-[15px] font-semibold leading-[1.4]',
              align === 'right' ? 'text-right' : 'text-left',
            )}
          >
            {item.value}
          </dd>
        </HairlineRow>
      ))}
    </dl>
  )
}
