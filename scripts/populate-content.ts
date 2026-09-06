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
const richText = (heading: string, paragraphs: string[], tag: 'h1' | 'h2' = 'h1') => ({
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
 * `company` is a `Partial<Company>`, so every one of these can legitimately be
 * missing. A fact with no value is not rendered at all rather than rendered
 * empty — the site never states something it does not know.
 */
const serviceArea = company.serviceArea ?? ''
const availability = company.availabilityNote ?? ''
const officeLine = [company.office?.street, company.office?.city].filter(Boolean).join(', ')
const seatLine = [
  company.registeredSeat?.street,
  [company.registeredSeat?.zip, company.registeredSeat?.city].filter(Boolean).join(' '),
]
  .filter(Boolean)
  .join(', ')

/** Kde pracujeme / kancelář / kdy voláte — sloupec faktů u hlavičky stránky. */
const companyFacts = [
  serviceArea ? { label: 'Kde pracujeme', value: serviceArea } : null,
  officeLine ? { label: 'Kancelář', value: officeLine } : null,
  availability ? { label: 'Kdy voláte', value: availability } : null,
].filter((fact) => fact !== null)

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
    eyebrow: 'Rodinná firma od roku 1993',
    richText: richText('Stavíme, rekonstruujeme a instalujeme od roku 1993', [
      'Stavební práce, střechy, elektroinstalace, voda, topení i podlahy — jeden dodavatel na celý dům. Působíme v Praze a Středočeském kraji.',
    ]),
    /*
     * Klient si vymínil, že animovaná čísla na úvodu zůstanou (blok „stats“),
     * takže „let v oboru“ a „řemesel“ nese ten blok a sloupec faktů je
     * neopakuje — jinak by stránka řekla totéž dvakrát.
     */
    facts: companyFacts,
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
      // Bez fotek v CMS se vykreslí stav „Fotografii doplníme.“ ve stejném
      // poměru stran — nikdy prázdná díra a nikdy stocková fotka.
      blockType: 'photoStrip' as const,
      source: 'latest' as const,
      limit: '3' as const,
      plain: true,
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
      blockType: 'cta' as const,
      variant: 'slab' as const,
      richText: richText('Řekněte nám, co potřebujete', ['Ozveme se týž den. Prohlídka i nabídka jsou nezávazné.'], 'h2'),
      links: [{ link: { type: 'custom' as const, label: 'Nezávazná poptávka', url: '/kontakt' } }],
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

/**
 * Upsert a page by slug. Never overwrites a page the client has since edited
 * unless it is one this script owns (the homepage above is the exception, and
 * it says so on the tin).
 */
const ensurePage = async (data: Record<string, unknown> & { slug: string }) => {
  const found = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: data.slug } },
  })
  if (found.docs[0]) {
    payload.logger.info(`  ${data.slug} already exists — left alone`)
    return found.docs[0].id
  }
  const created = await payload.create({ collection: 'pages', data: data as never, depth: 0, context })
  payload.logger.info(`  created /${data.slug}`)
  return created.id
}

payload.logger.info('— Inquiry form...')
const forms = await payload.find({
  collection: 'forms',
  depth: 0,
  limit: 1,
  pagination: false,
  where: { title: { equals: 'Poptávka' } },
})

/*
 * The wizard block stores its answers under these exact names. They are fields
 * on one form document; the wizard posts all four steps at once, at the end.
 * None of them is `required` — the wizard validates before it submits, and a
 * server-side required field the wizard cannot fill would deadlock it.
 */
const inquiryFields = [
  { blockType: 'text', name: 'sluzby', label: 'Řemesla', width: 100 },
  { blockType: 'text', name: 'misto', label: 'Místo', width: 50 },
  { blockType: 'text', name: 'termin', label: 'Termín', width: 50 },
  { blockType: 'textarea', name: 'zprava', label: 'Zpráva', width: 100 },
  { blockType: 'text', name: 'jmeno', label: 'Jméno', width: 100 },
  { blockType: 'text', name: 'telefon', label: 'Telefon', width: 50 },
  { blockType: 'email', name: 'email', label: 'E-mail', width: 50 },
]

const inquiryFormData = {
  title: 'Poptávka',
  fields: inquiryFields,
  confirmationType: 'message' as const,
  confirmationMessage: richText('Máme to. Ozveme se vám.', [
    'Poptávku jsme dostali a ozveme se týž den. Pokud to spěchá, zavolejte rovnou.',
  ], 'h2'),
  submitButtonLabel: 'Odeslat poptávku',
}

const inquiryFormId = forms.docs[0]
  ? (await payload.update({
      collection: 'forms',
      id: forms.docs[0].id,
      data: inquiryFormData as never,
      depth: 0,
      context,
    })).id
  : (await payload.create({ collection: 'forms', data: inquiryFormData as never, depth: 0, context })).id
payload.logger.info(`  form "Poptávka" ready (${inquiryFormId})`)

payload.logger.info('— Pages...')

await ensurePage({
  slug: 'kontakt',
  _status: 'published',
  title: 'Kontakt',
  hero: {
    type: 'lowImpact',
    eyebrow: 'Kontakt',
    richText: richText('Zavolejte, nebo napište', [
      'Nemáme pevnou pracovní dobu — telefon bereme, kdykoli to jde. Prohlídka i nabídka jsou nezávazné.',
    ]),
  },
  layout: [
    {
      blockType: 'contactDetails',
      showPhone: true,
      showEmail: true,
      showAddress: true,
      showServiceArea: true,
      showBigPhone: true,
      showMap: true,
    },
    {
      blockType: 'inquiry',
      eyebrow: 'Poptávka',
      heading: 'Čtyři kroky, dvě minuty',
      lead: 'Odpovědi nám stačí přibližné — zbytek doladíme po telefonu.',
      form: inquiryFormId,
    },
  ],
})

await ensurePage({
  slug: 'o-nas',
  _status: 'published',
  title: 'O nás',
  hero: {
    type: 'lowImpact',
    eyebrow: 'O firmě',
    richText: richText('Rodinná firma, která staví od roku 1993', [
      'Vedeme stavby sami a koordinujeme jednotlivá řemesla, takže nemusíte shánět pět dodavatelů a hlídat, kdo na koho čeká.',
    ]),
    facts: companyFacts,
  },
  layout: [
    { blockType: 'photoStrip', source: 'featured', limit: '3', plain: true },
    // `facts` s autoFromCompany drží rok založení, roky praxe a plátcovství DPH
    // na jednom místě — v globálu Firma, ne v textu stránky.
    {
      blockType: 'facts',
      eyebrow: 'Čísla a fakta',
      heading: 'Kdo jsme',
      lead: 'Údaje se berou z firemního profilu, takže nikde nezestárnou.',
      autoFromCompany: true,
    },
    {
      blockType: 'faq',
      eyebrow: 'Časté dotazy',
      heading: 'Na co se ptáte nejčastěji',
      anchor: 'caste-dotazy',
      defaultOpenFirst: true,
      items: [
        {
          question: 'Děláte i malé zakázky?',
          answer:
            'Ano. Vyměnit baterii i zrekonstruovat celý dům — rozsah práce nerozhoduje o tom, jestli se ozveme.',
        },
        {
          question: 'Kolik to bude stát?',
          answer:
            'Cenu řekneme až po prohlídce. Nabídka je nezávazná a rozepsaná po položkách, ať víte, za co platíte.',
        },
        {
          question: 'Kde všude pracujete?',
          answer: `Působíme v oblasti: ${serviceArea}. Mimo ni se domluvíme podle rozsahu zakázky.`,
        },
        {
          question: 'Zajistíte i papírování?',
          answer:
            'U větších akcí ano — od architektonického řešení po vyřízení formalit na úřadech.',
        },
      ],
    },
    {
      blockType: 'cta',
      variant: 'slab',
      richText: richText('Máte podobný dům?', ['Řekněte nám, co potřebujete. Ozveme se týž den.'], 'h2'),
      links: [{ link: { type: 'custom', label: 'Nezávazná poptávka', url: '/kontakt' } }],
    },
  ],
})

/*
 * Ochrana osobních údajů vzniká jako **koncept**. Text zásad je právní
 * dokument — vymyslet ho by bylo horší než ho nemít, a proto se stránka
 * nezveřejňuje a nelinkuje z patičky, dokud ji klient nedoplní a nevydá.
 */
await ensurePage({
  slug: 'ochrana-osobnich-udaju',
  _status: 'draft',
  title: 'Ochrana osobních údajů',
  hero: {
    type: 'lowImpact',
    richText: richText('Ochrana osobních údajů', []),
  },
  layout: [
    {
      blockType: 'content',
      columns: [
        {
          size: 'twoThirds',
          richText: richText(
            'Správce údajů',
            [
              `Správcem osobních údajů je ${company.legalName ?? ''}${seatLine ? `, ${seatLine}` : ''}.`,
              'Doplňte prosím celé znění zásad zpracování osobních údajů a stránku poté vydejte. Do té doby zůstává jako koncept a v patičce se neobjeví.',
            ],
            'h2',
          ),
          enableLink: false,
        },
      ],
    },
  ],
})

payload.logger.info('— Navigation...')
await payload.updateGlobal({
  slug: 'header',
  data: {
    /*
     * Pět položek. „Časté dotazy“ jsou kotva do /o-nas, ne vlastní stránka —
     * jedna otázka a odpověď nezaslouží celou obrazovku.
     */
    navItems: [
      { link: { type: 'custom', label: 'Služby', url: '/sluzby' } },
      { link: { type: 'custom', label: 'Realizace', url: '/realizace' } },
      { link: { type: 'custom', label: 'O nás', url: '/o-nas' } },
      { link: { type: 'custom', label: 'Časté dotazy', url: '/o-nas#caste-dotazy' } },
      { link: { type: 'custom', label: 'Kontakt', url: '/kontakt' } },
    ],
    cta: [{ link: { type: 'custom', label: 'Poptávka', url: '/kontakt' } }],
  },
  context,
})

await payload.updateGlobal({
  slug: 'footer',
  data: {
    tagline:
      'Rodinná firma z Kladna. Stavby, střechy, elektro, voda, topení a podlahy — jeden dodavatel na celý dům.',
    // Sloupec „Firma“. Sloupec „Služby“ se bere z kolekce služeb, aby patička
    // nikdy nezaostávala za nabídkou.
    navItems: [
      { link: { type: 'custom', label: 'O nás', url: '/o-nas' } },
      { link: { type: 'custom', label: 'Realizace', url: '/realizace' } },
      { link: { type: 'custom', label: 'Časté dotazy', url: '/o-nas#caste-dotazy' } },
      { link: { type: 'custom', label: 'Kontakt', url: '/kontakt' } },
    ],
    // legalLinks zůstávají prázdné, dokud nejsou zásady zpracování vydané.
    legalLinks: [],
  },
  context,
})

payload.logger.info('Done.')
process.exit(0)
