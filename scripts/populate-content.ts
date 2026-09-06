/**
 * Additive content population — safe to run against a live database.
 *
 * Unlike `src/payload/seed`, this deletes NOTHING. It upserts the company
 * global, the six services, and replaces the starter template's demo homepage
 * with one composed from this project's own blocks.
 *
 * MUST run with NODE_ENV=production: the Postgres adapter pushes schema in dev
 * mode, which writes a `dev` marker into payload_migrations and makes a later
 * `payload migrate` refuse to run non-interactively.
 *
 * Run: NODE_ENV=production pnpm tsx scripts/populate-content.ts
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

// Load .env before the Payload config is evaluated.
const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  console.error('Refusing to run: set NODE_ENV=production (see the note above).')
  process.exit(1)
}

const { default: config } = await import('../src/payload/payload.config')
const { company } = await import('../src/payload/seed/company')
const { services } = await import('../src/payload/seed/services')

/** Minimal lexical document: one heading plus paragraphs. */
const richText = (heading: string, paragraphs: string[]) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'heading',
        tag: 'h1',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: heading, version: 1 },
        ],
      },
      ...paragraphs.map((text) => ({
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        textFormat: 0,
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
        ],
      })),
    ],
  },
})

const payload = await getPayload({ config })

/**
 * Collection/global hooks call revalidatePath, which throws outside a Next
 * request. The redeploy that follows this script re-renders every page, so
 * skipping revalidation here costs nothing.
 */
const context = { disableRevalidate: true }

payload.logger.info('— Company details...')
await payload.updateGlobal({ slug: 'company', data: company, depth: 0, context })

payload.logger.info('— Services...')
const existing = await payload.find({
  collection: 'services',
  depth: 0,
  limit: 100,
  pagination: false,
})

for (const service of services) {
  const match = existing.docs.find((doc) => doc.slug === service.slug)

  if (match) {
    await payload.update({ collection: 'services', id: match.id, data: service, depth: 0, context })
    payload.logger.info(`  updated ${service.slug}`)
  } else {
    await payload.create({ collection: 'services', data: service, depth: 0, context })
    payload.logger.info(`  created ${service.slug}`)
  }
}

payload.logger.info('— Homepage...')
const homes = await payload.find({
  collection: 'pages',
  depth: 0,
  limit: 1,
  pagination: false,
  where: { slug: { equals: 'home' } },
})

const homeData = {
  slug: 'home',
  _status: 'published' as const,
  title: 'Domů',
  hero: {
    type: 'lowImpact' as const,
    richText: richText('Stavíme, rekonstruujeme a instalujeme od roku 1993', [
      'Stavební práce, střechy, elektroinstalace, voda, topení i podlahy — jeden dodavatel na celý dům. Působíme v Praze a Středočeském kraji.',
    ]),
  },
  layout: [
    {
      blockType: 'servicesGrid' as const,
      eyebrow: 'Co děláme',
      heading: 'Šest řemesel pod jednou střechou',
      lead: 'Nemusíte shánět pět firem a hlídat, kdo na koho čeká. Domluvíte se na jednom místě.',
      source: 'all' as const,
    },
    {
      blockType: 'stats' as const,
      items: [
        { autoYearsSince: 1993, label: 'let v oboru', value: 0 },
        { value: 6, label: 'řemesel pod jednou střechou' },
      ],
    },
    {
      blockType: 'process' as const,
      eyebrow: 'Jak to probíhá',
      heading: 'Od poptávky po předání',
      steps: [
        { title: 'Poptávka', description: 'Ozvete se telefonem nebo formulářem. Domluvíme si prohlídku.' },
        { title: 'Návrh a cena', description: 'Připravíme nezávaznou nabídku. U větších akcí i architektonické řešení včetně vyřízení formalit.' },
        { title: 'Realizace', description: 'Práce vedeme sami, včetně koordinace jednotlivých řemesel.' },
        { title: 'Předání a servis', description: 'Předáme hotové dílo a zůstáváme k dispozici.' },
      ],
    },
    {
      blockType: 'projectShowcase' as const,
      eyebrow: 'Reference',
      heading: 'Vybrané realizace',
      source: 'featured' as const,
      limit: 3,
    },
    {
      blockType: 'brands' as const,
      eyebrow: 'Značky',
      heading: 'S čím pracujeme',
      items: [
        { name: 'Velux' },
        { name: 'Vaillant' },
        { name: 'Stiebel Eltron' },
        { name: 'Parador' },
        { name: 'Quantum' },
        { name: 'Alpex' },
      ],
    },
    {
      blockType: 'contactDetails' as const,
      eyebrow: 'Kontakt',
      heading: 'Ozvěte se',
      showPhone: true,
      showEmail: true,
      showAddress: true,
      showServiceArea: true,
    },
  ],
}

if (homes.docs[0]) {
  await payload.update({ collection: 'pages', id: homes.docs[0].id, data: homeData, depth: 0, context })
  payload.logger.info('  replaced the starter demo homepage')
} else {
  await payload.create({ collection: 'pages', data: homeData, depth: 0, context })
  payload.logger.info('  created homepage')
}

payload.logger.info('— Navigation...')
await payload.updateGlobal({
  slug: 'header',
  data: {
    navItems: [
      { link: { type: 'custom', label: 'Služby', url: '/sluzby' } },
      { link: { type: 'custom', label: 'Realizace', url: '/realizace' } },
      { link: { type: 'custom', label: 'Kontakt', url: '/contact' } },
    ],
  },
  context,
})

payload.logger.info('Done.')
process.exit(0)
