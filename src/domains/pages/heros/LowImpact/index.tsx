import React from 'react'

import type { Page } from '@/payload/payload-types'

import { PageHero } from '@/shared/components/PageHero/PageHero'
import { heroActions, heroContent, heroFacts } from '../shared/heroContent'

/** Výchozí otevření stránky — jen text a sloupec faktů, žádná fotografie. */
export const LowImpactHero: React.FC<Page['hero']> = ({ eyebrow, facts, links, richText }) => (
  <PageHero
    eyebrow={eyebrow}
    content={heroContent(richText)}
    facts={heroFacts(facts)}
    actions={heroActions(links)}
  />
)
