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
import { FormBlock, InquiryBlock } from '@/domains/forms'
import { GalleryBlock } from '@/shared/components/RichText/blocks/Gallery/Component'
import { MediaBlock } from '@/shared/components/RichText/blocks/MediaBlock/Component'
import { PhotoStripBlock } from './PhotoStrip/Component'
import { ProcessBlock } from './Process/Component'
import { ProjectShowcaseBlock } from '@/domains/projects'
import { RelatedServicesBlock, ServicesGridBlock } from '@/domains/services'
import { StatsBlock } from './Stats/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { TextWithImageBlock } from './TextWithImage/Component'

/**
 * `beforeAfter`, `gallery` a `mediaBlock` slouží zároveň uvnitř rich textu, kde
 * vlastní rytmus sekce nechtějí. Na úrovni layoutu jim ho dodá tenký obal —
 * jinde si každý blok svoji sekci i rytmus nese sám (viz níže).
 */
const asSection = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
  const Wrapped: React.FC<P> = (props) => (
    <section className="container py-14 md:py-[104px]">
      <Component {...props} />
    </section>
  )
  Wrapped.displayName = `asSection(${Component.displayName ?? Component.name ?? 'Block'})`
  return Wrapped
}

const blockComponents = {
  archive: ArchiveBlock,
  beforeAfter: asSection(BeforeAfterBlock),
  brands: BrandsBlock,
  contactDetails: ContactDetailsBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faq: FAQBlock,
  featureGrid: FeatureGridBlock,
  formBlock: FormBlock,
  inquiry: InquiryBlock,
  gallery: asSection(GalleryBlock),
  mediaBlock: asSection(MediaBlock),
  photoStrip: PhotoStripBlock,
  process: ProcessBlock,
  projectShowcase: ProjectShowcaseBlock,
  relatedServices: RelatedServicesBlock,
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
            /*
             * Bez obalu a bez marginu: každý blok si nese vlastní <section>,
             * vlastní svislý rytmus (`py-14 md:py-[104px]`) a sám rozhoduje,
             * jestli sedí v `.container`, nebo jde přes celou šířku okna
             * (modrá plocha, pás fotografií).
             */
            return (
              // @ts-expect-error there may be some mismatch between the expected types here
              <Block {...block} disableInnerContainer key={index} />
            )
          }
        }
        return null
      })}
    </Fragment>
  )
}
