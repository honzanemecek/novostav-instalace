// Build-time public API of the pages domain (Payload block configs).
// Config consumers must not import the UI barrel (index.ts) — it pulls the
// React component tree into the Payload CLI's module graph.
export { Brands as BrandsBlockConfig } from './blocks/Brands/config'
export { CallToAction as CallToActionBlockConfig } from './blocks/CallToAction/config'
export { ContactDetails as ContactDetailsBlockConfig } from './blocks/ContactDetails/config'
export { Content as ContentBlockConfig } from './blocks/Content/config'
export { FAQ as FAQBlockConfig } from './blocks/FAQ/config'
export { FeatureGrid as FeatureGridBlockConfig } from './blocks/FeatureGrid/config'
export { Process as ProcessBlockConfig } from './blocks/Process/config'
export { Stats as StatsBlockConfig } from './blocks/Stats/config'
export { Testimonials as TestimonialsBlockConfig } from './blocks/Testimonials/config'
export { TextWithImage as TextWithImageBlockConfig } from './blocks/TextWithImage/config'
