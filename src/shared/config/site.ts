/**
 * Single source of truth for site identity.
 */
export const siteConfig = {
  name: 'Novostav-Instalace',
  description: {
    cs: 'Stavební práce, střechy, elektroinstalace, voda, topení i podlahy — jeden dodavatel na celý dům. Rodinná firma od roku 1993, Praha a Středočeský kraj.',
    en: 'Building work, roofs, electrical, plumbing, heating and floors — one contractor for the whole house. Family firm since 1993, Prague and Central Bohemia.',
  },
  /** Production domain, no protocol, no trailing slash. */
  domain: 'novostav-instalace.cz',
  phone: '+420 602 323 095',
  phoneHref: 'tel:+420602323095',
  email: 'info@novostav-instalace.cz',
  /** Kancelář — sem chodí zákazník, sem míří mapa a LocalBusiness. */
  office: 'Švýcarská 2432, 272 01 Kladno 1-Kročehlavy',
  /** Sídlo — jen do patičky k legální řádce. */
  seat: 'Svárovská 213, 273 51 Červený Újezd',
  founded: 1993,
  /** Path under /public used as the default OpenGraph image. */
  ogImage: '/website-template-OG.webp',
}

export type SiteConfig = typeof siteConfig
