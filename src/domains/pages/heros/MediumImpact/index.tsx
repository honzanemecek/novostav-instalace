import React from 'react'

import type { Page } from '@/payload/payload-types'

import { DuoPhoto } from '@/shared/components/DuoPhoto/DuoPhoto'
import { PageHero } from '@/shared/components/PageHero/PageHero'
import { heroActions, heroContent, heroFacts } from '../shared/heroContent'

/** Hlavička plus pás fotografie přes celou šířku okna pod ní. */
export const MediumImpactHero: React.FC<Page['hero']> = ({
  eyebrow,
  facts,
  links,
  media,
  richText,
}) => (
  <>
    <PageHero
      eyebrow={eyebrow}
      content={heroContent(richText)}
      facts={heroFacts(facts)}
      actions={heroActions(links)}
      className="pb-10 md:pb-14"
    />
    <DuoPhoto plain resource={media} aspect="16 / 7" priority size="100vw" />
  </>
)
