import React from 'react'

import { LocalizedLink } from '@/shared/components/LocalizedLink'
import { cn } from '@/shared/utils/ui'

export type BreadcrumbItem = {
  label: string
  /** Bez `href` = aktuální stránka (poslední položka). */
  href?: string | null
}

type Props = {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Drobečková navigace na detailu služby a realizace. Malá věc, ale jediné
 * místo, kde by se jinak improvizovala sémantika.
 */
export const Breadcrumb: React.FC<Props> = ({ items, className }) => {
  if (!items.length) return null

  return (
    <nav aria-label="Drobečková navigace" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <LocalizedLink
                  href={item.href}
                  className="eyebrow no-underline transition-colors duration-150 hover:text-accent"
                >
                  {item.label}
                </LocalizedLink>
              ) : (
                <span className={cn('eyebrow', isLast && 'text-accent')} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden className="eyebrow text-border">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
