import React from 'react'

import type { ProcessBlock as Props } from '@/payload/payload-types'

import { FactList } from '@/shared/components/FactList/FactList'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { Slab } from '@/shared/components/Slab/Slab'
import { TradeList } from '@/shared/components/TradeList/TradeList'

/**
 * Postup ve čtyřech krocích. Na modré ploše přes celou šířku okna (výchozí),
 * nebo na bílém podkladu, když stránka už dvě plochy má.
 *
 * Na mobilu se čtyřsloupcová mřížka rozpadne na řádky faktů — čtyři nadpisy pod
 * sebou by byly zbytečně hlučné.
 */
export const ProcessBlock: React.FC<Props> = ({ eyebrow, heading, lead, steps, variant }) => {
  if (!steps?.length) return null

  const onSlab = variant !== 'plain'

  const body = (
    <>
      <SectionHeader
        eyebrow={eyebrow}
        heading={heading}
        lead={lead}
        align="split"
        onSlab={onSlab}
      />
      <TradeList
        className="mt-12 hidden md:grid"
        items={steps.map((step) => ({ title: step.title, text: step.description }))}
        columns={4}
        headingAs="h4"
        onSlab={onSlab}
        showLinks={false}
      />
      <FactList
        className="mt-10 md:hidden"
        onSlab={onSlab}
        align="left"
        items={steps.map((step, i) => ({
          label: String(i + 1).padStart(2, '0'),
          value: step.title,
        }))}
      />
    </>
  )

  if (onSlab) return <Slab pad="lg">{body}</Slab>

  return <section className="container py-14 md:py-[104px]">{body}</section>
}
