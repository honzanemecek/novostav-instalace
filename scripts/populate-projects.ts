/**
 * Additive population of the portfolio:
 *
 *   1. one `projects` (Realizace) draft per service, so every trade has an
 *      entry waiting to be filled in;
 *   2. a `projectShowcase` block on each service's layout, filtered to that
 *      service, so /sluzby/<slug> lists its own realizace.
 *
 * Deliberately writes NO invented references. docs/PROJECT.md lists named
 * projects, addresses, dates and photography of completed work as open
 * questions marked "do not invent", so each entry ships as an unpublished
 * draft with visible `[Doplňte]` placeholders instead of a plausible-looking
 * fake job. The client replaces the copy and hits Publish; the structure,
 * service tagging and URLs are already correct.
 *
 * Idempotent: matches on slug, updates in place, deletes nothing.
 *
 * MUST run with NODE_ENV=production — the Postgres adapter pushes schema in dev
 * mode, which writes a `dev` marker into payload_migrations and makes a later
 * `payload migrate` refuse to run non-interactively.
 *
 * Run: NODE_ENV=production pnpm tsx scripts/populate-projects.ts
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import type { Service } from '../src/payload/payload-types'

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

/** Minimal lexical document: one heading plus paragraphs. */
const richText = (heading: string, paragraphs: string[], tag: 'h1' | 'h2' = 'h2') => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'heading',
        tag,
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

/**
 * One entry per trade. `prompt` is the trade-specific hint the client reads in
 * the editor — the only part that differs between the six.
 */
const templates: {
  service: string
  slug: string
  trade: string
  prompt: string
  showcaseHeading: string
}[] = [
  {
    service: 'stavebni-prace',
    slug: 'sablona-stavebni-prace',
    showcaseHeading: 'Co jsme postavili',
    trade: 'Stavební práce',
    prompt:
      'Např. přístavba, hrubá stavba, rekonstrukce bytového jádra. Napište, v jakém stavu jste dům přebírali, co jste udělali a jak dlouho to trvalo.',
  },
  {
    service: 'strechy',
    slug: 'sablona-strechy',
    showcaseHeading: 'Střechy, které jsme udělali',
    trade: 'Střechy',
    prompt:
      'Např. výměna krytiny, nová střecha na přístavbě, střešní okna. Uveďte typ krytiny a plochu — u střech to lidi zajímá nejvíc.',
  },
  {
    service: 'elektroinstalace',
    slug: 'sablona-elektroinstalace',
    showcaseHeading: 'Elektroinstalace, které jsme udělali',
    trade: 'Elektroinstalace',
    prompt:
      'Např. kompletní rozvody v novostavbě, výměna hliníkových rozvodů, nový rozvaděč. Zmiňte revizi, pokud jste ji zajišťovali.',
  },
  {
    service: 'vodoinstalace',
    slug: 'sablona-vodoinstalace',
    showcaseHeading: 'Vodoinstalace, které jsme udělali',
    trade: 'Vodoinstalace',
    prompt:
      'Např. koupelna na klíč, výměna stoupaček, rozvody v novostavbě. Napište, co všechno bylo součástí dodávky.',
  },
  {
    service: 'topeni',
    slug: 'sablona-topeni',
    showcaseHeading: 'Topení a plyn v praxi',
    trade: 'Topení a plyn',
    prompt:
      'Např. výměna plynového kotle, podlahové topení, nové rozvody. U plynu zmiňte oprávnění a revizi.',
  },
  {
    service: 'podlahy',
    slug: 'sablona-podlahy',
    showcaseHeading: 'Podlahy, které jsme položili',
    trade: 'Plovoucí podlahy',
    prompt:
      'Např. plovoucí podlaha v bytě, vyrovnání podkladu, přechodové lišty. Uveďte materiál a plochu.',
  },
]

const payload = await getPayload({ config })

/**
 * Collection hooks call revalidatePath, which throws outside a Next request.
 * The redeploy that follows this script re-renders every page.
 */
const context = { disableRevalidate: true }

payload.logger.info('— Services (for tagging)...')
const services = await payload.find({
  collection: 'services',
  depth: 0,
  limit: 100,
  pagination: false,
})
const serviceIdBySlug = new Map(services.docs.map((doc) => [doc.slug, doc.id]))

payload.logger.info('— Realizace...')
const existing = await payload.find({
  collection: 'projects',
  depth: 0,
  limit: 200,
  pagination: false,
  draft: true,
})

for (const template of templates) {
  const serviceId = serviceIdBySlug.get(template.service)

  if (!serviceId) {
    payload.logger.warn(`  skipped ${template.slug} — no service "${template.service}" in the database`)
    continue
  }

  const data = {
    slug: template.slug,
    // Draft on purpose: nothing here is a real reference yet.
    _status: 'draft' as const,
    title: `[Šablona] ${template.trade} — doplňte skutečnou realizaci`,
    summary:
      '[Doplňte] Dvě věty na kartu do přehledu realizací — co to bylo za zakázku a co z ní zákazník měl.',
    services: [serviceId],
    featured: false,
    // location, completedAt and coverImage are left empty on purpose —
    // inventing a place, a date or a photo would fake a reference.
    facts: [
      { label: 'Doba realizace', value: '[Doplňte]' },
      { label: 'Rozsah', value: '[Doplňte]' },
    ],
    layout: [
      {
        blockType: 'content' as const,
        columns: [
          {
            size: 'full' as const,
            richText: richText('Průběh realizace', [
              template.prompt,
              'Až budete mít fotky hotové práce, nahrajte je do bloku Galerie nebo Porovnání před/po a doplňte úvodní fotku v záložce „O realizaci“. Potom šablonu přejmenujte, upravte URL a publikujte.',
            ]),
            enableLink: false,
          },
        ],
      },
    ],
  }

  const match = existing.docs.find((doc) => doc.slug === template.slug)
  let id: number | string

  if (match) {
    await payload.update({ collection: 'projects', id: match.id, data, depth: 0, context, draft: true })
    id = match.id
    payload.logger.info(`  updated ${template.slug}`)
  } else {
    const created = await payload.create({ collection: 'projects', data, depth: 0, context, draft: true })
    id = created.id
    payload.logger.info(`  created ${template.slug}`)
  }

  /**
   * `create` with `draft: true` still leaves a published version behind on this
   * collection (drafts + autosave), so the placeholder would be live on
   * /realizace. Unpublishing explicitly is the only thing that sticks — and it
   * is a no-op once the entry is already a draft. Verified: anonymous reads
   * return 0 projects afterwards.
   *
   * Note this runs on every pass, so re-running the script UNPUBLISHES a
   * realizace the client has since published. Delete its template entry from
   * `templates` above once the real content lands.
   */
  await payload.update({ collection: 'projects', id, data: { _status: 'draft' }, depth: 0, context })
}

payload.logger.info('— Showcase block on each service page...')

for (const template of templates) {
  const service = services.docs.find((doc) => doc.slug === template.service)

  if (!service) continue

  const showcase = {
    blockType: 'projectShowcase' as const,
    eyebrow: 'Reference',
    heading: template.showcaseHeading,
    source: 'service' as const,
    service: service.id,
    limit: 3,
    links: [
      {
        link: {
          type: 'custom' as const,
          label: 'Všechny realizace',
          url: `/realizace/sluzba/${template.service}`,
          appearance: 'outline' as const,
        },
      },
    ],
  }

  // Idempotent: replace the showcase we added last time rather than stacking
  // a second one, but leave any other block the editor added alone.
  const layout: NonNullable<Service['layout']> = [...(service.layout ?? [])]
  const index = layout.findIndex(
    (block) => block.blockType === 'projectShowcase' && block.source === 'service',
  )

  if (index === -1) {
    layout.push(showcase)
  } else {
    layout[index] = { ...showcase, id: layout[index].id }
  }

  await payload.update({
    collection: 'services',
    id: service.id,
    data: { layout },
    depth: 0,
    context,
  })
  payload.logger.info(`  ${index === -1 ? 'added to' : 'updated on'} /sluzby/${template.service}`)
}

payload.logger.info(
  'Done. The six realizace are DRAFTS — each service page stays quiet until you publish one.',
)
process.exit(0)
