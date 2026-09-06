import React from 'react'

import type { ServicesGridBlock as Props } from '@/payload/payload-types'

import { getProjectCountsByService } from '@/domains/projects'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { TradeList } from '@/shared/components/TradeList/TradeList'
import { getServices } from '../../queries/getServices'
import { serviceToTradeItem } from '../../ui/toTradeItems'

/**
 * Řemesla na vlasových linkách. Blok je jen mapovač dat — rozvržení nese
 * `TradeList`, který obsluhuje i všechny ostatní řádkové plochy webu.
 */
export const ServicesGridBlock: React.FC<Props> = async ({
  eyebrow,
  heading,
  lead,
  layout,
  columns,
  source,
  services: selected,
}) => {
  const [all, { byService }] = await Promise.all([getServices(), getProjectCountsByService()])

  const services =
    source === 'selected' && selected?.length
      ? // keep the editor's chosen order, not the collection's
        selected
          .map((item) => {
            const id = typeof item === 'object' ? item.id : item
            return all.find((service) => service.id === id)
          })
          .filter((service) => service !== undefined)
      : all

  if (!services.length) return null

  const rows = layout === 'rows'

  return (
    <section className="container py-14 md:py-[104px]">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} align={rows ? 'split' : 'stack'} />
      <TradeList
        className="mt-12"
        items={services.map((service) => serviceToTradeItem(service, byService))}
        layout={rows ? 'row' : 'column'}
        columns={columns === '2' ? 2 : 3}
        headingAs={rows ? 'h2' : 'h3'}
      />
    </section>
  )
}
