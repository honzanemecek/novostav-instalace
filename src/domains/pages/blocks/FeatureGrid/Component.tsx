import React from 'react'

import type { FeatureGridBlock as Props } from '@/payload/payload-types'

import { SectionHeader } from '@/shared/components/SectionHeader'
import { TradeList } from '@/shared/components/TradeList/TradeList'

/**
 * „Rozsah práce“ — číslované skupiny na vlasových linkách, pod každou technické
 * štítky. Žádné karty a žádné ikony (pravidla systému 2 a 8): pole `icon`
 * v CMS zůstává, ale nevykresluje se.
 */
export const FeatureGridBlock: React.FC<Props> = ({ eyebrow, heading, lead, columns, items }) => {
  if (!items?.length) return null

  const columnCount = columns === '2' ? 2 : columns === '4' ? 4 : 3

  return (
    <section className="container py-14 md:py-[104px]">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
      <TradeList
        className="mt-12"
        items={items.map((item) => ({
          title: item.title,
          text: item.description,
          tags: item.tags?.map((tag) => tag.label) ?? null,
        }))}
        columns={columnCount}
        showLinks={false}
      />
    </section>
  )
}
