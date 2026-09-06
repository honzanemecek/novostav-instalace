import React, { Fragment } from 'react'

import type { Page, Project, Service } from '@/payload/payload-types'

import { ArchiveBlock } from '@/domains/posts'
import { BeforeAfterBlock } from '@/shared/components/RichText/blocks/BeforeAfter/Component'
import { BrandsBlock } from './Brands/Component'
import { CallToActionBlock } from './CallToAction/Component'
import { ContactDetailsBlock } from './ContactDetails/Component'
import { ContentBlock } from './Content/Component'
import { FAQBlock } from './FAQ/Component'
import { FeatureGridBlock } from './FeatureGrid/Component'
import { FormBlock } from '@/domains/forms'
import { GalleryBlock } from '@/shared/components/RichText/blocks/Gallery/Component'
import { MediaBlock } from '@/shared/components/RichText/blocks/MediaBlock/Component'
import { ProcessBlock } from './Process/Component'
import { ProjectShowcaseBlock } from '@/domains/projects'
import { ServicesGridBlock } from '@/domains/services'
import { StatsBlock } from './Stats/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { TextWithImageBlock } from './TextWithImage/Component'

const blockComponents = {
  archive: ArchiveBlock,
  beforeAfter: BeforeAfterBlock,
  brands: BrandsBlock,
  contactDetails: ContactDetailsBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faq: FAQBlock,
  featureGrid: FeatureGridBlock,
  formBlock: FormBlock,
  gallery: GalleryBlock,
  mediaBlock: MediaBlock,
  process: ProcessBlock,
  projectShowcase: ProjectShowcaseBlock,
  servicesGrid: ServicesGridBlock,
  stats: StatsBlock,
  testimonials: TestimonialsBlock,
  textWithImage: TextWithImageBlock,
}

/** Any block a composed document can hold — pages, services and projects share the palette. */
type LayoutBlock =
  | NonNullable<Page['layout']>[number]
  | NonNullable<Service['layout']>[number]
  | NonNullable<Project['layout']>[number]

export const RenderBlocks: React.FC<{
  blocks?: LayoutBlock[] | null
}> = ({ blocks }) => {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType as keyof typeof blockComponents]

          if (Block) {
            return (
              <div className="my-16" key={index}>
                {/* @ts-expect-error there may be some mismatch between the expected types here */}
                <Block {...block} disableInnerContainer />
              </div>
            )
          }
        }
        return null
      })}
    </Fragment>
  )
}
