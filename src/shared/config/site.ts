/**
 * Single source of truth for site identity. The /setup skill rewrites these
 * values when a new project is initialized — edit here, never inline.
 */
export const siteConfig = {
  name: 'Novostav - Instalace',
  description: {
    cs: 'Kompletní instalatérské práce pro novostavby i rekonstrukce — voda, topení, plyn.',
    en: 'Complete plumbing, heating and gas installations for new builds and renovations.',
  },
  /** Production domain, no protocol, no trailing slash. */
  domain: 'novostav-instalace.cz',
  /** Path under /public used as the default OpenGraph image. */
  ogImage: '/website-template-OG.webp',
}

export type SiteConfig = typeof siteConfig
