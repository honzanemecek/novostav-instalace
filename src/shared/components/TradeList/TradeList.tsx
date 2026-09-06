import React from 'react'

import { HairlineRow } from '@/shared/components/HairlineRow/HairlineRow'
import { RuleLink } from '@/shared/components/RuleLink/RuleLink'
import { Tag } from '@/shared/components/Tag/Tag'
import { cn } from '@/shared/utils/ui'

export type TradeListItem = {
  title: string
  text?: string | null
  href?: string | null
  /** Popisek odkazu; výchozí „Detail“. */
  linkLabel?: string | null
  /** Vlastní číslo řádku. Bez něj se čísluje podle pořadí. */
  no?: string | null
  tags?: string[] | null
  /** Drobný doplňkový údaj — např. počet realizací u služby. */
  meta?: { label: string; href?: string | null } | null
}

type Props = {
  items: TradeListItem[]
  columns?: 2 | 3 | 4
  /** `row` = široké řádky přehledu služeb; `column` = mřížka bez karet. */
  layout?: 'column' | 'row'
  numbered?: boolean
  headingAs?: 'h2' | 'h3' | 'h4'
  onSlab?: boolean
  showLinks?: boolean
  className?: string
}

const columnClasses: Record<2 | 3 | 4, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
}

/**
 * Číslovaná řemesla na vlasových linkách — nosná struktura celého webu.
 *
 * Jeden komponent obsluhuje šest ploch návrhu (řemesla na úvodu, postup na modré
 * ploše, „Rozsah práce“, přehled služeb, „Často navazuje“, „Kombinace řemesel“).
 * Čtyři bloky se na něj slévají a stávají se z nich tenké mapovače dat místo
 * vlastního rozvržení.
 */
export const TradeList: React.FC<Props> = ({
  items,
  columns = 3,
  layout = 'column',
  numbered = true,
  headingAs: Heading = 'h3',
  onSlab = false,
  showLinks = true,
  className,
}) => {
  if (!items.length) return null

  const muted = onSlab ? 'text-slab-muted' : 'text-muted-foreground'
  const numberTone = onSlab ? 'text-slab-foreground' : 'text-accent'
  const numberClasses = cn('block text-xs font-medium leading-none tracking-[0.1em]', numberTone)

  const numberFor = (item: TradeListItem, i: number) => item.no ?? String(i + 1).padStart(2, '0')

  const renderMeta = (item: TradeListItem) => {
    if (!item.meta) return null
    return item.meta.href ? (
      <RuleLink href={item.meta.href} onSlab={onSlab} className="text-[13px]">
        {item.meta.label}
      </RuleLink>
    ) : (
      <span className={cn('eyebrow', onSlab && 'text-slab-muted')}>{item.meta.label}</span>
    )
  }

  const renderTags = (item: TradeListItem) =>
    item.tags?.length ? (
      <ul className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <li key={tag}>
            <Tag tone="muted" onSlab={onSlab}>
              {tag}
            </Tag>
          </li>
        ))}
      </ul>
    ) : null

  const renderLink = (item: TradeListItem) =>
    showLinks && item.href ? (
      <RuleLink href={item.href} onSlab={onSlab}>
        {item.linkLabel ?? 'Detail'}
      </RuleLink>
    ) : null

  if (layout === 'row') {
    return (
      <ul className={className}>
        {items.map((item, i) => (
          <HairlineRow
            as="li"
            key={`${item.title}-${i}`}
            index={i}
            onSlab={onSlab}
            bottomRule={i === items.length - 1}
            className={cn(
              'grid grid-cols-1 gap-4 py-8 md:items-start md:gap-10',
              numbered
                ? 'md:grid-cols-[56px_minmax(0,1.1fr)_minmax(0,1fr)_200px]'
                : 'md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_200px]',
            )}
          >
            {numbered && <span className={numberClasses}>{numberFor(item, i)}</span>}
            <div>
              <Heading>{item.title}</Heading>
              {renderTags(item) && <div className="mt-4">{renderTags(item)}</div>}
            </div>
            <div>
              {item.text && <p className={cn('text-[15px] leading-[1.7]', muted)}>{item.text}</p>}
              {item.meta && <div className="mt-4">{renderMeta(item)}</div>}
            </div>
            <div className="md:pt-1">{renderLink(item)}</div>
          </HairlineRow>
        ))}
      </ul>
    )
  }

  return (
    <ul className={cn('grid grid-cols-1 gap-x-14 gap-y-[2px]', columnClasses[columns], className)}>
      {items.map((item, i) => (
        <HairlineRow
          as="li"
          key={`${item.title}-${i}`}
          index={i}
          onSlab={onSlab}
          className="flex flex-col items-start pb-[30px] pt-[26px]"
        >
          {numbered && <span className={cn(numberClasses, 'mb-[18px]')}>{numberFor(item, i)}</span>}
          <Heading>{item.title}</Heading>
          {item.text && <p className={cn('mt-3 text-[15px] leading-[1.7]', muted)}>{item.text}</p>}
          {item.tags?.length ? <div className="mt-4">{renderTags(item)}</div> : null}
          {item.meta && <div className="mt-4">{renderMeta(item)}</div>}
          {renderLink(item) && <div className="mt-5">{renderLink(item)}</div>}
        </HairlineRow>
      ))}
    </ul>
  )
}
