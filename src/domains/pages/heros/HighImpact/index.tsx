import React from 'react'

import type { Page } from '@/payload/payload-types'

import { DuoPhoto } from '@/shared/components/DuoPhoto/DuoPhoto'
import { PageHero } from '@/shared/components/PageHero/PageHero'
import { heroActions, heroContent, heroFacts } from '../shared/heroContent'

/**
 * Nejsilnější otevření: hlavička a pod ní duotónová fotografie přes celou šířku.
 *
 * Fotografie je LCP — proto `priority` a **žádná animace při vstupu**. Hlavička
 * na ní neleží: nová hlavička webu je vlasová linka na bílé, takže tu není co
 * překlápět (dřívější `-mt-[10.4rem]` a `setHeaderTheme('dark')` jsou pryč).
 */
export const HighImpactHero: React.FC<Page['hero']> = ({
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
    <DuoPhoto resource={media} aspect="16 / 7" priority size="100vw" />
  </>
)
