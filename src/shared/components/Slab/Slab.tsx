import React from 'react'

import { cn } from '@/shared/utils/ui'

type Pad = 'sm' | 'md' | 'lg'

/**
 * Vodorovné odsazení odpovídá `.container` (20 px mobil / 56 px desktop) —
 * plocha jde přes celou šířku okna, obsah zůstává v rytmu stránky.
 */
const padding: Record<Pad, string> = {
  sm: 'px-5 py-8 md:px-8 md:py-8',
  md: 'px-5 py-11 md:px-14 md:py-12',
  lg: 'px-5 py-11 md:px-14 md:py-[76px]',
}

type Props = {
  pad?: Pad
  id?: string
  className?: string
  children: React.ReactNode
}

/**
 * Modrá plocha — akcentní moment stránky, přes celou šířku okna.
 *
 * Systémové pravidlo: **dvě plochy na stránku, tři je strop.** Nevynucuje to
 * kód, ale revize šablony stránky. Potomci potřebují jen `onSlab` varianty —
 * `.slab` v `globals.css` sám překlápí odkazy, linky a štítky na bílé.
 */
export const Slab: React.FC<Props> = ({ pad = 'lg', id, className, children }) => (
  <section id={id} className={cn('slab', padding[pad], className)}>
    {children}
  </section>
)
