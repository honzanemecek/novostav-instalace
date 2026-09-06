import type { Block } from 'payload'

import { ArchiveBlockConfig } from '@/domains/posts/config'
import { FormBlockConfig } from '@/domains/forms/config'
import { ProjectShowcaseBlockConfig } from '@/domains/projects/config'
import { ServicesGridBlockConfig } from '@/domains/services/config'
import {
  BrandsBlockConfig,
  CallToActionBlockConfig,
  ContactDetailsBlockConfig,
  ContentBlockConfig,
  FAQBlockConfig,
  FeatureGridBlockConfig,
  ProcessBlockConfig,
  StatsBlockConfig,
  TestimonialsBlockConfig,
  TextWithImageBlockConfig,
} from '@/domains/pages/config'
import { BeforeAfter } from '@/shared/components/RichText/blocks/BeforeAfter/config'
import { Gallery } from '@/shared/components/RichText/blocks/Gallery/config'
import { MediaBlock } from '@/shared/components/RichText/blocks/MediaBlock/config'

/**
 * The block palettes each content type offers its editor.
 *
 * Assembled here rather than in any one domain: three collections share most of
 * the library, and `src/payload/` is the layer allowed to reach across domains.
 * Add a block once, and every collection that should offer it picks it up.
 */

/** Layout primitives every composed page gets. */
const foundation: Block[] = [
  ContentBlockConfig,
  TextWithImageBlockConfig,
  MediaBlock,
  Gallery,
  BeforeAfter,
]

/** Marketing sections. */
const marketing: Block[] = [
  FeatureGridBlockConfig,
  StatsBlockConfig,
  ProcessBlockConfig,
  FAQBlockConfig,
  TestimonialsBlockConfig,
  BrandsBlockConfig,
]

/** Blocks that pull live content from another collection. */
const dynamic: Block[] = [ServicesGridBlockConfig, ProjectShowcaseBlockConfig, ArchiveBlockConfig]

/** Blocks that ask the visitor to do something. */
const conversion: Block[] = [CallToActionBlockConfig, ContactDetailsBlockConfig, FormBlockConfig]

/** Everything — for ordinary pages, which can be anything. */
export const pageLayoutBlocks: Block[] = [
  ...foundation,
  ...marketing,
  ...dynamic,
  ...conversion,
]

/** A service page: sell the trade, prove it, then ask for the call. */
export const serviceLayoutBlocks: Block[] = [
  ...foundation,
  FeatureGridBlockConfig,
  ProcessBlockConfig,
  FAQBlockConfig,
  TestimonialsBlockConfig,
  BrandsBlockConfig,
  ProjectShowcaseBlockConfig,
  ...conversion,
]

/** A project page is mostly story and photographs. */
export const projectLayoutBlocks: Block[] = [
  ...foundation,
  ProjectShowcaseBlockConfig,
  ...conversion,
]
