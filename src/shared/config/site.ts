/**
 * Single source of truth for site identity. The /setup skill rewrites these
 * values when a new project is initialized — edit here, never inline.
 */
export const siteConfig = {
  name: 'My Site',
  description: {
    cs: 'Nový web postavený na Payload CMS a Next.js.',
    en: 'A new website built with Payload CMS and Next.js.',
  },
  /** Production domain, no protocol, no trailing slash. */
  domain: 'example.com',
  /** Path under /public used as the default OpenGraph image. */
  ogImage: '/website-template-OG.webp',
}

export type SiteConfig = typeof siteConfig
