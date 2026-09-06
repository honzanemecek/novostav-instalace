'use client'

import React from 'react'

import { LocalizedLink } from '@/shared/components/LocalizedLink'
import { cn } from '@/shared/utils/ui'

type Props = {
  active?: boolean
  href?: string | null
  onClick?: () => void
  size?: 'sm' | 'md'
  /** Počet položek za štítkem — „VŠE (18)“. */
  count?: number | null
  className?: string
  children: React.ReactNode
}

/**
 * Interaktivní volič: filtr realizací, výběr řemesel v poptávce, řemesla na
 * detailu realizace.
 *
 * Hranatý — **žádné `rounded-full`**, to je starý systém. Vždy `min-h-11`,
 * protože jako jediný ze štítků se do něj klepe.
 */
export const Chip: React.FC<Props> = ({
  active = false,
  href,
  onClick,
  size = 'md',
  count,
  className,
  children,
}) => {
  const classes = cn(
    'inline-flex min-h-11 items-center gap-2 rounded-none border text-[13px] leading-none tracking-[0.06em]',
    'no-underline transition-colors duration-150',
    size === 'sm' ? 'px-3' : 'px-4',
    active
      ? 'border-accent bg-accent font-semibold text-accent-foreground'
      : 'border-input font-medium text-foreground hover:border-foreground/40',
    className,
  )

  const content = (
    <>
      {children}
      {typeof count === 'number' && (
        <span className={cn('tabular', active ? 'opacity-70' : 'text-muted-foreground')}>({count})</span>
      )}
    </>
  )

  if (href) {
    return (
      <LocalizedLink href={href} className={classes} aria-current={active ? 'page' : undefined}>
        {content}
      </LocalizedLink>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-pressed={active}>
      {content}
    </button>
  )
}
