import React from 'react'

import type { RelatedServicesBlock as Props, Service } from '@/payload/payload-types'

import { FactList } from '@/shared/components/FactList/FactList'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { Slab } from '@/shared/components/Slab/Slab'
import { TradeList } from '@/shared/components/TradeList/TradeList'

export const RelatedServicesBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  lead,
  variant,
  items,
}) => {
  const trades = (items ?? [])
    .map((item) => {
      const service = item.service
      if (typeof service !== 'object' || service === null) return null
      return { service: service as Service, note: item.note }
    })
    .filter((item) => item !== null)

  if (!trades.length) return null

  const onSlab = variant === 'slab'

  const list = (
    <TradeList
      items={trades.map(({ service, note }) => ({
        title: service.title,
        text: note || service.shortDescription,
        href: `/sluzby/${service.slug}`,
        linkLabel: 'Detail služby',
      }))}
      columns={3}
      numbered={false}
      onSlab={onSlab}
    />
  )

  if (onSlab) {
    return (
      <Slab pad="lg">
        <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} align="split" onSlab />
        {/* Na mobilu je mřížka tří nadpisů hlučná — zůstanou řádky faktů. */}
        <div className="mt-12 hidden md:block">{list}</div>
        <FactList
          className="mt-10 md:hidden"
          onSlab
          align="left"
          items={trades.map(({ service }) => ({
            label: 'Řemeslo',
            value: service.title,
          }))}
        />
      </Slab>
    )
  }

  /*
   * Bílá varianta: vlevo štítek a jedna věta ve sloupci 22 znaků, vpravo
   * samotná řemesla. Sekce začíná vlasovou linkou, ne nadpisem.
   */
  return (
    <section className="container py-14 md:py-[104px]">
      <div className="grid gap-8 border-t border-border pt-10 md:grid-cols-[22ch_minmax(0,1fr)] md:gap-14">
        <div>
          {eyebrow && <p className="eyebrow mb-[18px]">{eyebrow}</p>}
          {heading && <h2 className="text-[22px] leading-[1.3]">{heading}</h2>}
          {lead && <p className="mt-4 text-[15px] leading-[1.7] text-muted-foreground">{lead}</p>}
        </div>
        {list}
      </div>
    </section>
  )
}
