import type { Service } from '@/payload/payload-types'

import type { TradeListItem } from '@/shared/components/TradeList/TradeList'

/** „1 realizace“ / „3 realizace“ / „7 realizací“ — česká čísla se skloňují. */
const realizaceLabel = (count: number): string => {
  if (count === 1) return '1 realizace'
  if (count >= 2 && count <= 4) return `${count} realizace`
  return `${count} realizací`
}

/**
 * Služba jako řádek `TradeList`. Jedno mapování pro blok „Přehled služeb“
 * i pro stránku `/sluzby`, aby se obě nerozešly.
 */
export const serviceToTradeItem = (
  service: Service,
  counts?: Record<number, number>,
): TradeListItem => {
  const count = counts?.[service.id] ?? 0

  return {
    title: service.title,
    text: service.shortDescription,
    href: `/sluzby/${service.slug}`,
    linkLabel: 'Detail služby',
    tags: service.highlights?.map((highlight) => highlight.text).slice(0, 4) ?? null,
    meta: count
      ? { label: realizaceLabel(count), href: `/realizace/sluzba/${service.slug}` }
      : null,
  }
}
