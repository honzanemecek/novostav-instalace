import React from 'react'

import type { Page } from '@/payload/payload-types'

import type { Fact } from '@/shared/components/FactList/FactList'

import { ActionRow } from '@/shared/components/ActionRow/ActionRow'
import RichText from '@/shared/components/RichText'

type Hero = Page['hero']

/**
 * Nadpis a perex nesou rich text z CMS. Šířky řádku se drží stejné jako
 * v `PageHero` — nadpis 22 znaků, text 44 — aby se hero z rich textu neroztáhlo.
 */
export const heroContent = (richText: Hero['richText']): React.ReactNode =>
  richText ? (
    <RichText
      data={richText}
      enableGutter={false}
      enableProse={false}
      className="max-w-none [&_h1]:max-w-[22ch] [&_h2]:max-w-[22ch] [&_p]:mt-6 [&_p]:max-w-[44ch] [&_p]:text-[19px] [&_p]:leading-[1.7] [&_p]:text-muted-foreground"
    />
  ) : null

export const heroFacts = (facts: Hero['facts']): Fact[] =>
  (facts ?? []).map((fact) => ({ label: fact.label, value: fact.value }))

export const heroActions = (links: Hero['links']): React.ReactNode =>
  links?.length ? <ActionRow links={links} size="lg" /> : null
