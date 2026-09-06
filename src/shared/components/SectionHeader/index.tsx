import React from 'react'

import { cn } from '@/shared/utils/ui'

type Props = {
  eyebrow?: string | null
  heading?: string | null
  lead?: string | null
  /** `stack` = štítek → nadpis → perex; `split` = nadpis vlevo, perex vpravo. */
  align?: 'stack' | 'split'
  onSlab?: boolean
  /** Heading level — one `<h1>` per page, so sections default to `h2`. */
  as?: 'h1' | 'h2' | 'h3'
  /** Odkaz „dál“ na účaří hlavičky — typicky `<RuleLink>`. */
  action?: React.ReactNode
  className?: string
}

/**
 * Standardní otevření sekce. Používá ho každý blok, takže nadpisy drží jeden
 * rytmus místo toho, aby si každý blok vymýšlel vlastní škálu.
 *
 * `align="center"` v systému **není** — centrovaná výzva k akci si svůj `h2`
 * a perex vysází sama.
 */
export const SectionHeader: React.FC<Props> = ({
  eyebrow,
  heading,
  lead,
  align = 'stack',
  onSlab = false,
  as: Heading = 'h2',
  action,
  className,
}) => {
  if (!eyebrow && !heading && !lead && !action) return null

  const eyebrowClasses = cn('eyebrow', onSlab && 'text-slab-muted')
  const leadClasses = cn('text-[17px] leading-[1.7]', onSlab ? 'text-slab-muted' : 'text-muted-foreground')

  if (align === 'split') {
    return (
      <div
        className={cn(
          'grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,440px)] md:items-end md:gap-14',
          className,
        )}
      >
        <div>
          {eyebrow && <p className={cn(eyebrowClasses, 'mb-[18px]')}>{eyebrow}</p>}
          {heading && <Heading className="max-w-[22ch]">{heading}</Heading>}
        </div>
        {(lead || action) && (
          <div className="flex flex-col items-start gap-6">
            {lead && <p className={leadClasses}>{lead}</p>}
            {action}
          </div>
        )}
      </div>
    )
  }

  const stack = (
    <div className="max-w-[52ch]">
      {eyebrow && <p className={cn(eyebrowClasses, (heading || lead) && 'mb-[18px]')}>{eyebrow}</p>}
      {heading && <Heading>{heading}</Heading>}
      {lead && <p className={cn(leadClasses, heading && 'mt-5')}>{lead}</p>}
    </div>
  )

  if (!action) return <div className={className}>{stack}</div>

  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-6 md:gap-14', className)}>
      {stack}
      <div className="shrink-0">{action}</div>
    </div>
  )
}
