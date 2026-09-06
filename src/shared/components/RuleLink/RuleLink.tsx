import React from 'react'

import { LocalizedLink } from '@/shared/components/LocalizedLink'
import { cn } from '@/shared/utils/ui'

type Props = {
  href: string
  onSlab?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Textový odkaz „dál“ — „Všechny realizace“, „Detail služby“, „Zpět na přehled“.
 *
 * Záměrně **není** globální styl `a`: ten kreslí `text-decoration` 3 px pod
 * účařím, tenhle kreslí `border-bottom` s 3px odsazením — silnější a dál od
 * písma. Kdyby se stavěl ručně na dvanácti místech, vznikne dvanáct různých
 * podtržení.
 */
export const RuleLink: React.FC<Props> = ({ href, onSlab = false, className, children }) => (
  <LocalizedLink
    href={href}
    className={cn(
      'inline-block pb-[3px] text-[15px] font-semibold leading-none no-underline',
      'border-b transition-colors duration-150 hover:border-current',
      onSlab
        ? 'border-b-[color-mix(in_oklch,var(--slab-foreground)_45%,transparent)] text-slab-foreground'
        : 'border-b-[color-mix(in_oklch,var(--accent)_35%,transparent)] text-accent hover:text-accent-hover',
      className,
    )}
  >
    {children}
  </LocalizedLink>
)
