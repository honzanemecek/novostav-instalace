import React from 'react'

import { LocalizedLink } from '@/shared/components/LocalizedLink'
import { cn } from '@/shared/utils/ui'

type Tone = 'muted' | 'accent'

type Props = {
  /** `muted` = statický popisný štítek, `accent` = řemeslo u realizace (odkaz). */
  tone?: Tone
  href?: string | null
  onSlab?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Štítek. Dva tóny téhož atomu — ne „chip“: `muted` není nikdy interaktivní a
 * `accent` sedí uvnitř už tak velké karty realizace, takže ani jeden nepotřebuje
 * 44px dotykový cíl. Ten má `Chip`.
 */
export const Tag: React.FC<Props> = ({ tone = 'muted', href, onSlab = false, className, children }) => {
  const classes = cn(
    'inline-block leading-none transition-colors duration-150',
    tone === 'muted' &&
      cn(
        'rounded-none border px-[9px] py-[7px] text-[11px] font-medium tracking-[0.08em]',
        onSlab ? 'border-slab-line text-slab-muted' : 'border-border text-muted-foreground',
      ),
    tone === 'accent' &&
      cn(
        'text-[11px] font-semibold uppercase tracking-[0.12em] no-underline',
        onSlab ? 'text-slab-foreground' : 'text-accent hover:text-accent-hover',
      ),
    className,
  )

  if (href) {
    return (
      <LocalizedLink href={href} className={classes}>
        {children}
      </LocalizedLink>
    )
  }

  return <span className={classes}>{children}</span>
}
