import type { RequiredDataFromCollectionSlug } from 'payload'

/**
 * The six trades, transcribed from the firm's own previous website
 * (see docs/PROJECT.md). Deliberately no `layout` blocks — the page body is
 * for the client to compose in the admin; this seeds only the facts we can
 * actually source.
 */
export const services: RequiredDataFromCollectionSlug<'services'>[] = [
  {
    slug: 'stavebni-prace',
    _status: 'published',
    title: 'Stavební práce',
    icon: 'house',
    order: 1,
    shortDescription:
      'Výstavby rodinných domů, rekonstrukce a bytová jádra — od základů po fasádu.',
    highlights: [
      { text: 'Výstavby rodinných domů' },
      { text: 'Rekonstrukce' },
      { text: 'Bytová jádra' },
      { text: 'Výstavby dřevěných chatek a pergol' },
      { text: 'Fasády' },
    ],
  },
  {
    slug: 'strechy',
    _status: 'published',
    title: 'Střechy',
    icon: 'roof',
    order: 2,
    shortDescription:
      'Kompletní střešní konstrukce, tesařské i klempířské práce a montáž střešních oken.',
    highlights: [
      { text: 'Veškeré střešní konstrukce' },
      { text: 'Tesařské práce' },
      { text: 'Montáž střešních oken Velux' },
      { text: 'Betonová i pálená krytina, šindel' },
      { text: 'Izolace pro ploché střechy' },
      { text: 'Klempířské práce — Cu, TiZn, FeZn, Al' },
    ],
  },
  {
    slug: 'elektroinstalace',
    _status: 'published',
    title: 'Elektroinstalace',
    icon: 'zap',
    order: 3,
    shortDescription:
      'Kompletní elektroinstalace včetně hromosvodů a revizí — novostavby i rekonstrukce.',
    highlights: [
      { text: 'Kompletní elektroinstalace' },
      { text: 'Hromosvody a revize' },
      { text: 'Nové stavby, panelové domy, rekonstrukce' },
      { text: 'Slaboproudé rozvody' },
    ],
  },
  {
    slug: 'vodoinstalace',
    _status: 'published',
    title: 'Vodoinstalace',
    icon: 'droplets',
    order: 4,
    shortDescription: 'Rozvody vody, odpady a montáže sanity — vše na lisované spoje.',
    highlights: [
      { text: 'Plastové potrubí PPR' },
      { text: 'Lisované spoje Alpex a elektrotvarovky' },
      { text: 'Odpady typ HT a KG' },
      { text: 'Montáže sanity' },
    ],
  },
  {
    slug: 'topeni',
    _status: 'published',
    title: 'Topení a plyn',
    icon: 'flame',
    order: 5,
    shortDescription:
      'Plynové kotle, tepelná čerpadla i solární ohřev, včetně regulace topných systémů.',
    highlights: [
      { text: 'Dodávka a montáž plynových kotlů a ohřívačů' },
      { text: 'Tepelná čerpadla Stiebel Eltron' },
      { text: 'Solární panely Vaillant a Quantum' },
      { text: 'Regulace topných systémů' },
      { text: 'Moderní materiály Alpex a Cu, vše lisované spoje' },
    ],
  },
  {
    slug: 'podlahy',
    _status: 'published',
    title: 'Plovoucí podlahy',
    icon: 'layers',
    order: 6,
    shortDescription:
      'Pokládka podlah značky Parador. Vzory jsou vystavené u nás v kanceláři v Kladně.',
    highlights: [
      { text: 'Pokládka plovoucích podlah' },
      { text: 'Podlahy značky Parador' },
      { text: 'Vzory vystavené v kanceláři' },
    ],
  },
]
