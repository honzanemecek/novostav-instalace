import React from 'react'

import { cn } from '@/shared/utils/ui'

type Props = {
  eyebrow?: string | null
  heading?: string | null
  lead?: string | null
  align?: 'left' | 'center'
  /** Heading level — one `<h1>` per page, so sections default to `h2`. */
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

/**
 * The standard opening of a section. Every block uses it so headings keep one
 * rhythm across the site instead of each block inventing its own scale.
 */
export const SectionHeader: React.FC<Props> = ({
  eyebrow,
  heading,
  lead,
  align = 'left',
  as: Heading = 'h2',
  className,
}) => {
  if (!eyebrow && !heading && !lead) return null

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center mx-auto',
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
          {eyebrow}
        </p>
      )}
      {heading && (
        <Heading className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
          {heading}
        </Heading>
      )}
      {lead && (
        <p
          className={cn(
            'text-lg text-muted-foreground max-w-prose',
            align === 'center' && 'mx-auto',
          )}
        >
          {lead}
        </p>
      )}
    </div>
  )
}
