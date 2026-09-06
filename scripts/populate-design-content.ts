/**
 * Naplní CMS textem z návrhu („Bílá hala + Modrotisk“, `docs/REDESIGN-PLAN.md`)
 * a fotografiemi, aby web odpovídal artboardům.
 *
 * Co dělá:
 *   1. nahraje fotografie do kolekce Média (jednou, podle názvu souboru);
 *   2. přepíše texty domovské stránky, /o-nas a /kontakt podle artboardů 02, 06, 07;
 *   3. složí detail každé služby: „Rozsah práce“, prohlídka, realizace, navazující
 *      řemesla (artboardy 03 a 09);
 *   4. založí realizace z artboardů 04 a 05 a publikuje je.
 *
 * POZOR — realizace jsou UKÁZKOVÝ obsah z návrhu, ne ověřené zakázky. Místa,
 * termíny i popisy si klient musí přepsat podle skutečných prací; fotografie
 * jsou licencovaný stock (Pexels), který má nahradit vlastní fotodokumentace.
 * Do té doby se web nesmí tvářit, že tyhle konkrétní zakázky proběhly.
 *
 * Idempotentní: hledá podle slugu, aktualizuje na místě, nic nemaže.
 *
 * MUSÍ běžet s NODE_ENV=production — Postgres adaptér v dev režimu pushuje
 * schéma a zapíše `dev` značku do payload_migrations.
 *
 * Spuštění: NODE_ENV=production pnpm tsx scripts/populate-design-content.ts
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import type { Page, Project, Service } from '../src/payload/payload-types'

// Env načteme dřív, než se vyhodnotí Payload config.
for (const name of ['.env', '.env.local']) {
  const envPath = path.resolve(process.cwd(), name)
  if (!fs.existsSync(envPath)) continue
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

const PHONE = '+420 602 323 095'
const PHONE_HREF = 'tel:+420602323095'

/** Minimální lexical dokument: nadpis a odstavce. */
const richText = (heading: string | null, paragraphs: string[], tag: 'h1' | 'h2' | 'h3' = 'h2') => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      ...(heading
        ? [
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
          ]
        : []),
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

/** Dvojice tlačítek pod nadpisem: akce a telefon. Návrh je má na každé obrazovce. */
const actions = (label: string, url = '/kontakt') => [
  { link: { type: 'custom' as const, label, url } },
  { link: { type: 'custom' as const, label: `Zavolat ${PHONE}`, url: PHONE_HREF, appearance: 'outline' as const } },
]

/*
 * Fotografie. Stock z Pexels (licence dovoluje komerční užití bez uvedení
 * autora); autora přesto vedeme v popisku média, ať je v administraci vidět,
 * co je cizí fotka a co vlastní. `alt` je česky — čte ho odečítač i vyhledávač.
 */
const MEDIA: { key: string; url: string; alt: string; credit: string }[] = [
  {
    key: 'sluzba-stavebni-prace',
    url: 'https://images.pexels.com/photos/19688828/pexels-photo-19688828.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Zedník pokládá cihlu do maltového lože na rozestavěné zdi',
    credit: 'Pexels — Ron Lach',
  },
  {
    key: 'sluzba-strechy',
    url: 'https://images.pexels.com/photos/27806097/pexels-photo-27806097.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Pálená krytina na sedlové střeše zblízka',
    credit: 'Pexels',
  },
  {
    key: 'sluzba-elektroinstalace',
    url: 'https://images.pexels.com/photos/8961695/pexels-photo-8961695.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Elektrikář vede chráničku s vodiči po zdi rozestavěného domu',
    credit: 'Pexels — Mikael Blomkvist',
  },
  {
    key: 'sluzba-vodoinstalace',
    url: 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Instalatér montuje potrubí a šroubení pod zařizovacím předmětem',
    credit: 'Pexels',
  },
  {
    key: 'sluzba-topeni',
    url: 'https://images.pexels.com/photos/20046689/pexels-photo-20046689.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Technická místnost s akumulačními nádržemi a jednotkou tepelného čerpadla',
    credit: 'Pexels',
  },
  {
    key: 'sluzba-podlahy',
    url: 'https://images.pexels.com/photos/7031616/pexels-photo-7031616.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Prázdný pokoj s položenou plovoucí podlahou a velkým oknem',
    credit: 'Pexels — Max Vakhtbovycn',
  },
  {
    key: 'projekt-bytove-jadro',
    url: 'https://images.pexels.com/photos/8143708/pexels-photo-8143708.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Zrekonstruovaná koupelna se sprchovým koutem a šedým obkladem',
    credit: 'Pexels',
  },
  {
    key: 'projekt-krov',
    url: 'https://images.pexels.com/photos/15456627/pexels-photo-15456627.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Nový dřevěný krov s vazníky proti modré obloze',
    credit: 'Pexels',
  },
  {
    key: 'projekt-podlaha',
    url: 'https://images.pexels.com/photos/7031621/pexels-photo-7031621.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Pokoj s čerstvě položenou plovoucí podlahou a bílými stěnami',
    credit: 'Pexels — Max Vakhtbovycn',
  },
  {
    key: 'projekt-tepelne-cerpadlo',
    url: 'https://images.pexels.com/photos/38067300/pexels-photo-38067300.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Venkovní jednotka tepelného čerpadla u zdi rodinného domu',
    credit: 'Pexels',
  },
  {
    key: 'projekt-elektro-byt',
    url: 'https://images.pexels.com/photos/7937305/pexels-photo-7937305.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Řada instalačních krabic s vodiči zapuštěná ve zdi',
    credit: 'Pexels',
  },
  {
    key: 'projekt-novostavba',
    url: 'https://images.pexels.com/photos/31406334/pexels-photo-31406334.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Dokončený rodinný dům s cihlovou fasádou a garáží',
    credit: 'Pexels',
  },
  {
    key: 'projekt-krytina',
    url: 'https://images.pexels.com/photos/37677394/pexels-photo-37677394.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Pokrývač pokládá novou krytinu na střeše rodinného domu',
    credit: 'Pexels',
  },
  {
    key: 'o-nas-parta',
    url: 'https://images.pexels.com/photos/8961555/pexels-photo-8961555.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Dva řemeslníci na stavbě rodinného domu při práci',
    credit: 'Pexels — Mikael Blomkvist',
  },
]

/**
 * „Rozsah práce“ — blok Přehled vlastností. Čtyři skupiny na vlasových linkách
 * místo jedné odrážkové řady; štítky nesou materiály a značky (artboard 03).
 */
const SCOPE: Record<string, { title: string; description: string; tags: string[] }[]> = {
  'stavebni-prace': [
    {
      title: 'Novostavby rodinných domů',
      description:
        'Od základů po fasádu. Hrubou stavbu i dokončení vedeme sami, protože další řemesla máme vlastní.',
      tags: ['ZÁKLADY', 'HRUBÁ STAVBA', 'FASÁDY'],
    },
    {
      title: 'Rekonstrukce',
      description:
        'Celé domy i jednotlivé místnosti. Po prohlídce řekneme, co má smysl zachovat a co se vyplatí vybourat.',
      tags: ['DOMY', 'BYTY', 'PŘÍSTAVBY'],
    },
    {
      title: 'Bytová jádra',
      description:
        'Bourání, nové rozvody, obklady a sanita v jednom termínu — voda, elektro i podlaha jsou naše.',
      tags: ['BOURÁNÍ', 'OBKLADY', 'SANITA'],
    },
    {
      title: 'Chatky a pergoly',
      description:
        'Dřevěné chatky, pergoly a přístřešky. Architektonické řešení i formality na úřadech vyřídíme za vás.',
      tags: ['DŘEVOSTAVBY', 'PERGOLY', 'FORMALITY'],
    },
  ],
  strechy: [
    {
      title: 'Krovy a tesařské práce',
      description:
        'Veškeré střešní konstrukce — nové krovy, výměny poškozených prvků, pergoly a dřevěné chatky. Formality vyřídíme za vás.',
      tags: ['NOVÝ KROV', 'VÝMĚNA PRVKŮ', 'PERGOLY'],
    },
    {
      title: 'Krytiny a izolace',
      description:
        'Betonová i pálená krytina, šindel. U plochých střech řešíme izolaci včetně detailů, kde střecha nejčastěji teče.',
      tags: ['BETONOVÁ', 'PÁLENÁ', 'ŠINDEL', 'PLOCHÉ STŘECHY'],
    },
    {
      title: 'Klempířské práce',
      description:
        'Žlaby, svody, oplechování, lemování komínů a prostupů. Materiál vybíráme podle domu a rozpočtu, ne podle skladu.',
      tags: ['Cu', 'TiZn', 'FeZn', 'Al'],
    },
    {
      title: 'Střešní okna Velux',
      description:
        'Montáž i dodatečné prořezání do stávající střechy, včetně zateplení ostění a vnitřního zapravení.',
      tags: ['VELUX', 'DODATEČNÁ MONTÁŽ'],
    },
  ],
  elektroinstalace: [
    {
      title: 'Kompletní rozvody',
      description:
        'Novostavby, panelové domy i rekonstrukce. Nový rozvaděč, jištění a rozvody podle projektu — nebo podle toho, jak dům opravdu užíváte.',
      tags: ['NOVOSTAVBY', 'PANELOVÉ DOMY', 'ROZVADĚČE'],
    },
    {
      title: 'Hromosvody',
      description:
        'Návrh, montáž i výměna hromosvodu včetně uzemnění. Předáváme s revizní zprávou.',
      tags: ['MONTÁŽ', 'UZEMNĚNÍ'],
    },
    {
      title: 'Slaboproud',
      description:
        'Datové rozvody, domácí telefony, televizní a zabezpečovací kabeláž. Taháme je zároveň se silnoproudem, ať se zeď otevírá jednou.',
      tags: ['DATA', 'ZVONKY', 'TV', 'EZS'],
    },
    {
      title: 'Revize',
      description:
        'Výchozí i pravidelné revize. Elektro předáváme s revizní zprávou, ne se slibem, že se dodá.',
      tags: ['VÝCHOZÍ', 'PRAVIDELNÉ'],
    },
  ],
  vodoinstalace: [
    {
      title: 'Rozvody vody',
      description:
        'Plastové potrubí PPR a lisované spoje Alpex včetně elektrotvarovek. Tlaková zkouška je součástí dodávky.',
      tags: ['PPR', 'ALPEX', 'TLAKOVÁ ZKOUŠKA'],
    },
    {
      title: 'Odpady',
      description:
        'Vnitřní odpady typu HT a ležatá kanalizace KG, včetně napojení na přípojku a spádování.',
      tags: ['HT', 'KG'],
    },
    {
      title: 'Montáže sanity',
      description:
        'Vany, sprchové kouty, umyvadla a předstěnové systémy. Montujeme až po obkladači, na hotovo.',
      tags: ['VANY', 'SPRCHY', 'PŘEDSTĚNY'],
    },
    {
      title: 'Stoupačky a výměny',
      description:
        'Výměny stoupaček v panelových domech a bytových jádrech. Vodu odstavujeme na co nejkratší dobu a dopředu řekneme na jak dlouho.',
      tags: ['STOUPAČKY', 'PANELOVÉ DOMY'],
    },
  ],
  topeni: [
    {
      title: 'Plynové kotle a ohřívače',
      description:
        'Dodávka a montáž kotlů a ohřívačů včetně napojení na komín a uvedení do provozu.',
      tags: ['KOTLE', 'OHŘÍVAČE', 'UVEDENÍ DO PROVOZU'],
    },
    {
      title: 'Tepelná čerpadla',
      description:
        'Stiebel Eltron — návrh výkonu podle domu, montáž vnitřní i venkovní jednotky a napojení na stávající otopnou soustavu.',
      tags: ['STIEBEL ELTRON', 'VZDUCH–VODA'],
    },
    {
      title: 'Solární ohřev',
      description:
        'Panely Vaillant a Quantum na ohřev vody, včetně akumulace a zapojení do systému.',
      tags: ['VAILLANT', 'QUANTUM'],
    },
    {
      title: 'Rozvody a regulace',
      description:
        'Radiátory i podlahové topení, ekvitermní regulace a termostatické hlavice. Aby se topilo tam, kde bydlíte.',
      tags: ['PODLAHOVÉ TOPENÍ', 'RADIÁTORY', 'REGULACE'],
    },
  ],
  podlahy: [
    {
      title: 'Pokládka plovoucích podlah',
      description:
        'Parador — laminát i dřevo. Pokládáme včetně podložky, dilatací a lišt.',
      tags: ['PARADOR', 'LAMINÁT', 'DŘEVO'],
    },
    {
      title: 'Příprava podkladu',
      description:
        'Vyrovnání nivelační stěrkou a měření vlhkosti. Bez rovného a suchého podkladu podlaha do roka vrže.',
      tags: ['NIVELACE', 'MĚŘENÍ VLHKOSTI'],
    },
    {
      title: 'Lišty a přechody',
      description:
        'Soklové lišty, přechodové profily a zapravení k zárubním. Detail, podle kterého se pozná hotová práce.',
      tags: ['SOKLY', 'PŘECHODY'],
    },
    {
      title: 'Vzorkovna v Kladně',
      description:
        'Vzory podlah Parador máme vystavené v kanceláři ve Švýcarské ulici. Přijďte se podívat po telefonické dohodě.',
      tags: ['VZORKOVNA', 'KLADNO'],
    },
  ],
}

/** Perex pod nadpisem služby (artboardy 03 a 09). */
const SHORT: Record<string, string> = {
  'stavebni-prace':
    'Novostavby rodinných domů, rekonstrukce, bytová jádra, fasády a zateplení. Vyřídíme i formality kolem povolení.',
  strechy:
    'Postavíme krov, položíme krytinu a doděláme klempířinu — od výměny staré střechy po novostavbu. Střešní okna Velux montujeme jako součást dodávky, ne jako subdodávku.',
  elektroinstalace:
    'Kompletní elektroinstalace novostaveb, panelových domů i rekonstrukcí, hromosvody, slaboproud a revize.',
  vodoinstalace:
    'Rozvody vody a odpadů, montáže sanity. Plastové potrubí PPR, lisované spoje Alpex, odpady HT a KG.',
  topeni:
    'Plynové kotle a ohřívače, tepelná čerpadla, solární ohřev a regulace topných systémů.',
  podlahy:
    'Pokládka podlah Parador včetně vyrovnání podkladu. Vzorky k nahlédnutí v kanceláři v Kladně.',
}

/** Prohlídka uprostřed detailu služby — jediný slab na stránce (artboard 03). */
const VISIT: Record<string, { heading: string; lead: string; label: string }> = {
  'stavebni-prace': {
    heading: 'Přijedeme se na stavbu podívat',
    lead: 'Prohlídka je bez poplatku. Řekneme, co se dá zachránit a co ne, a pošleme položkovou nabídku písemně.',
    label: 'Sjednat prohlídku',
  },
  strechy: {
    heading: 'Přijedeme se na střechu podívat',
    lead: 'Prohlídka je bez poplatku. Řekneme, co se dá zachránit a co ne, a pošleme položkovou nabídku písemně.',
    label: 'Sjednat prohlídku',
  },
  elektroinstalace: {
    heading: 'Přijedeme se na rozvody podívat',
    lead: 'Prohlídka je bez poplatku. Řekneme, co je potřeba vyměnit a co vydrží, a pošleme položkovou nabídku písemně.',
    label: 'Sjednat prohlídku',
  },
  vodoinstalace: {
    heading: 'Přijedeme se na rozvody podívat',
    lead: 'Prohlídka je bez poplatku. Řekneme, kudy povedou trubky a co bude potřeba otevřít, a pošleme položkovou nabídku písemně.',
    label: 'Sjednat prohlídku',
  },
  topeni: {
    heading: 'Přijedeme se na kotelnu podívat',
    lead: 'Prohlídka je bez poplatku. Spočítáme, jaký zdroj tepla dům opravdu potřebuje, a pošleme položkovou nabídku písemně.',
    label: 'Sjednat prohlídku',
  },
  podlahy: {
    heading: 'Přijedeme podklad změřit',
    lead: 'Prohlídka je bez poplatku. Změříme vlhkost a rovinnost podkladu a pošleme položkovou nabídku písemně.',
    label: 'Sjednat prohlídku',
  },
}

/** „Často navazuje“ — co se s řemeslem obvykle řeší v jednom termínu (artboard 03). */
const RELATED: Record<string, { slug: string; note: string }[]> = {
  'stavebni-prace': [
    { slug: 'strechy', note: 'Krov a krytina na přístavbě nebo novostavbě.' },
    { slug: 'vodoinstalace', note: 'Nové rozvody vody a odpadů v jádře.' },
    { slug: 'podlahy', note: 'Podlahy jako poslední krok rekonstrukce.' },
  ],
  strechy: [
    { slug: 'stavebni-prace', note: 'Zateplení, fasáda a zapravení po střeše.' },
    { slug: 'elektroinstalace', note: 'Hromosvod včetně revize.' },
    { slug: 'topeni', note: 'Solární panely a napojení na topení.' },
  ],
  elektroinstalace: [
    { slug: 'stavebni-prace', note: 'Drážky a zapravení po rozvodech.' },
    { slug: 'topeni', note: 'Napojení tepelného čerpadla a regulace.' },
    { slug: 'vodoinstalace', note: 'Elektro a voda v jednom otevřeném jádře.' },
  ],
  vodoinstalace: [
    { slug: 'stavebni-prace', note: 'Bourání jádra, obklady a zapravení.' },
    { slug: 'topeni', note: 'Ohřev vody a napojení na kotel nebo čerpadlo.' },
    { slug: 'podlahy', note: 'Podlaha až po tlakové zkoušce.' },
  ],
  topeni: [
    { slug: 'elektroinstalace', note: 'Přívod a jištění pro tepelné čerpadlo.' },
    { slug: 'vodoinstalace', note: 'Rozvody a ohřev teplé vody.' },
    { slug: 'strechy', note: 'Solární panely na střeše.' },
  ],
  podlahy: [
    { slug: 'stavebni-prace', note: 'Vyrovnání podkladu a zapravení.' },
    { slug: 'vodoinstalace', note: 'Podlaha přijde na řadu po instalacích.' },
    { slug: 'elektroinstalace', note: 'Rozvody v podlaze dopředu.' },
  ],
}

/** Nadpis pásu realizací na detailu služby (přebírá populate-projects.ts). */
const SHOWCASE: Record<string, string> = {
  'stavebni-prace': 'Co jsme postavili',
  strechy: 'Realizace se střechami',
  elektroinstalace: 'Elektroinstalace, které jsme udělali',
  vodoinstalace: 'Vodoinstalace, které jsme udělali',
  topeni: 'Topení a plyn v praxi',
  podlahy: 'Podlahy, které jsme položili',
}

/**
 * Realizace z artboardů 04 a 05. Ukázkový obsah návrhu — než se web pustí na
 * ostrou doménu, musí je klient přepsat na skutečné zakázky.
 */
const PROJECTS: {
  slug: string
  title: string
  summary: string
  location: string
  completedAt: string
  services: string[]
  featured?: boolean
  media?: string
  facts: { label: string; value: string }[]
  body: string[]
}[] = [
  {
    slug: 'rekonstrukce-bytoveho-jadra-praha-6',
    title: 'Rekonstrukce bytového jádra',
    summary:
      'Bourání, nové rozvody vody a odpadů, obklady, sanita a plovoucí podlaha v jednom termínu.',
    location: 'Praha 6',
    completedAt: '2025-09-18',
    services: ['vodoinstalace', 'podlahy', 'stavebni-prace'],
    featured: true,
    media: 'projekt-bytove-jadro',
    facts: [
      { label: 'Doba realizace', value: '3 týdny' },
      { label: 'Rozsah', value: 'Jádro na klíč' },
      { label: 'Řemesla v dodávce', value: 'Voda, elektro, obklady, podlaha' },
    ],
    body: [
      'Umakartové jádro šlo celé pryč. Postavili jsme nové příčky, vedli nové rozvody vody a odpadů a přidali samostatný přívod pro pračku.',
      'Následoval obklad a dlažba, montáž sanity a předstěnového systému. Elektro jsme dělali zároveň s vodou, aby se zeď otevírala jednou.',
      'Poslední přišla na řadu plovoucí podlaha v navazující chodbě. Celkem tři týdny, byt byl po celou dobu obyvatelný.',
    ],
  },
  {
    slug: 'novy-krov-a-palena-krytina',
    title: 'Nový krov a pálená krytina rodinného domu',
    summary:
      'Kompletní krov, pálená krytina, klempířina z TiZn a dvě střešní okna Velux.',
    location: 'Praha-západ',
    completedAt: '2025-07-22',
    services: ['strechy', 'stavebni-prace'],
    featured: true,
    media: 'projekt-krov',
    facts: [
      { label: 'Doba realizace', value: '7 týdnů' },
      { label: 'Krytina', value: 'Pálená' },
      { label: 'Klempířina', value: 'TiZn' },
    ],
    body: [
      'Stará střecha zatékala do pozednice. Po sundání krytiny se ukázalo, že zatékání poškodilo pozednici na dvou místech a tři krokve. Vyměnili jsme je za nové, zbytek krovu ošetřili a ponechali — nemá smysl bourat, co drží.',
      'Následovalo laťování, pálená krytina a klempířské prvky z TiZn: žlaby, svody, lemování komína a oplechování prostupů. Do zadní strany jsme dodatečně prořezali dvě okna Velux a zateplili ostění.',
      'Celkem sedm týdnů včetně čekání na krytinu. Předali jsme s protokolem a fotodokumentací skrytých částí.',
    ],
  },
  {
    slug: 'vymena-kotle-za-tepelne-cerpadlo',
    title: 'Výměna kotle za tepelné čerpadlo',
    summary:
      'Demontáž plynového kotle, čerpadlo Stiebel Eltron, nová regulace a napojení na topný systém.',
    location: 'Kladno',
    completedAt: '2025-05-14',
    services: ['topeni', 'elektroinstalace'],
    featured: true,
    media: 'projekt-tepelne-cerpadlo',
    facts: [
      { label: 'Doba realizace', value: '5 dnů' },
      { label: 'Zdroj tepla', value: 'Stiebel Eltron, vzduch–voda' },
      { label: 'Součástí', value: 'Regulace a revize' },
    ],
    body: [
      'Plynový kotel dosloužil a majitel chtěl přejít na čerpadlo. Spočítali jsme tepelnou ztrátu domu a podle ní navrhli výkon — ne podle katalogu.',
      'Demontovali jsme kotel, usadili venkovní i vnitřní jednotku a napojili je na stávající otopnou soustavu s radiátory. Přívod a jištění jsme řešili sami, takže na elektrikáře se nečekalo.',
      'Nakonec ekvitermní regulace a zaškolení. Topná sezona běžela bez zásahu.',
    ],
  },
  {
    slug: 'plovouci-podlaha-parador',
    title: 'Plovoucí podlaha Parador, 78 m²',
    summary:
      'Vyrovnání podkladu, podložka a pokládka ve třech pokojích a na chodbě.',
    location: 'Kladno',
    completedAt: '2025-06-10',
    services: ['podlahy'],
    media: 'projekt-podlaha',
    facts: [
      { label: 'Plocha', value: '78 m²' },
      { label: 'Materiál', value: 'Parador, laminát' },
      { label: 'Doba realizace', value: '4 dny' },
    ],
    body: [
      'Původní podlaha byla nerovná a v jednom pokoji vlhká. Změřili jsme vlhkost, počkali na vyschnutí a podklad srovnali nivelační stěrkou.',
      'Pak podložka, pokládka a soklové lišty ve třech pokojích a na chodbě. Přechody k dlažbě jsme řešili profily v barvě podlahy.',
      'Vzor si majitelé vybrali v naší kanceláři v Kladně, kde máme vzorky Parador vystavené.',
    ],
  },
  {
    slug: 'nova-elektroinstalace-bytu',
    title: 'Nová elektroinstalace bytu',
    summary: 'Kompletní rozvody, nový rozvaděč, slaboproud a revizní zpráva.',
    location: 'Praha 5',
    completedAt: '2025-03-20',
    services: ['elektroinstalace'],
    media: 'projekt-elektro-byt',
    facts: [
      { label: 'Doba realizace', value: '2 týdny' },
      { label: 'Rozsah', value: 'Byt 3+1' },
      { label: 'Předáno', value: 'S revizní zprávou' },
    ],
    body: [
      'Byt měl hliníkové rozvody z šedesátých let a rozvaděč bez proudového chrániče. Vyměnili jsme všechno až po rozvodnou skříň.',
      'Nové okruhy jsme navrhli podle toho, jak se byt užívá — kuchyň dostala samostatné jištění, ložnice datový rozvod. Slaboproud jsme táhli zároveň, aby se zeď otevírala jednou.',
      'Předali jsme s revizní zprávou a schématem rozvaděče v rozvodnici.',
    ],
  },
  {
    slug: 'novostavba-rodinneho-domu',
    title: 'Novostavba rodinného domu',
    summary:
      'Od hrubé stavby po podlahy — pět řemesel v jedné dodávce, jedna parta.',
    location: 'Středočeský kraj',
    completedAt: '2024-10-15',
    services: ['stavebni-prace', 'strechy', 'elektroinstalace', 'vodoinstalace', 'podlahy'],
    media: 'projekt-novostavba',
    facts: [
      { label: 'Doba realizace', value: '11 měsíců' },
      { label: 'Rozsah', value: 'Hrubá stavba až po podlahy' },
      { label: 'Řemesla v dodávce', value: 'Pět' },
    ],
    body: [
      'Zakázka, na které je vidět, co znamená „jeden dodavatel“: základy, hrubá stavba, krov a krytina, instalace, podlahy. Investor koordinoval jednu firmu, ne pět.',
      'Elektro a plyn jsme předali s revizemi, střechu s protokolem. Termíny profesí na sebe navazovaly bez prostojů, protože je plánoval jeden člověk.',
      'Dům jsme předali před zimou a zůstali na telefonu — u domu, který jsme stavěli, se to čeká.',
    ],
  },
  {
    slug: 'vymena-krytiny-a-zlabu',
    title: 'Výměna krytiny a žlabů',
    summary: 'Betonová krytina, nové žlaby a svody z FeZn, lemování komína.',
    location: 'Středočeský kraj',
    completedAt: '2024-08-28',
    services: ['strechy'],
    media: 'projekt-krytina',
    facts: [
      { label: 'Doba realizace', value: '3 týdny' },
      { label: 'Krytina', value: 'Betonová' },
      { label: 'Klempířina', value: 'FeZn' },
    ],
    body: [
      'Krytina byla popraskaná a žlaby prorezlé. Krov byl v pořádku, takže se neměnil — jen se doplnily laťování a pojistná hydroizolace.',
      'Nová betonová krytina, žlaby a svody z FeZn a nové lemování komína. Prostupy jsme oplechovali znovu, protože právě tam střecha zatékala.',
      'Práce probíhaly za provozu domu, lešení stálo tři týdny.',
    ],
  },
  {
    slug: 'izolace-ploche-strechy-garaze',
    title: 'Izolace ploché střechy garáže',
    summary:
      'Odstranění staré izolace, nové vrstvy a nové oplechování atiky.',
    location: 'Kladno',
    completedAt: '2025-04-11',
    services: ['strechy'],
    // Bez fotky schválně: ukazuje stav „Fotografii doplníme“ tak, jak ho návrh
    // počítá — než klient dodá vlastní fotodokumentaci.
    facts: [
      { label: 'Doba realizace', value: '4 dny' },
      { label: 'Rozsah', value: 'Plochá střecha 42 m²' },
    ],
    body: [
      'Do garáže zatékalo u atiky. Starou izolaci jsme odstranili až na podklad a zjistili, že spád byl od začátku malý.',
      'Doplnili jsme spádové klíny, natavili nové vrstvy a udělali nové oplechování atiky. Detail u prostupu jsme řešili zvlášť.',
      'Čtyři dny práce. Od té doby suchá.',
    ],
  },
]

const payload = await getPayload({ config })

/*
 * Hooky kolekcí volají revalidatePath, což mimo Next request spadne. Redeploy,
 * který po skriptu následuje, vykreslí všechny stránky znovu.
 */
const context = { disableRevalidate: true }

/* ------------------------------------------------------------------ média -- */

payload.logger.info('— Fotografie...')

const mediaIds = new Map<string, number>()

for (const item of MEDIA) {
  const filename = `${item.key}.jpg`
  const found = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { filename: { equals: filename } },
  })

  if (found.docs[0]) {
    mediaIds.set(item.key, found.docs[0].id)
    payload.logger.info(`  ${filename} už v knihovně je`)
    continue
  }

  const res = await fetch(item.url)
  if (!res.ok) {
    payload.logger.warn(`  ${filename} se nepodařilo stáhnout (${res.status}) — přeskakuji`)
    continue
  }
  const data = Buffer.from(await res.arrayBuffer())

  const created = await payload.create({
    collection: 'media',
    depth: 0,
    context,
    data: {
      alt: item.alt,
      caption: richText(null, [
        `Stock fotografie (${item.credit}). Nahraďte vlastní fotografií hotové práce.`,
      ]) as never,
    },
    file: { name: filename, data, mimetype: 'image/jpeg', size: data.byteLength },
  })

  mediaIds.set(item.key, created.id)
  payload.logger.info(`  nahráno ${filename}`)
}

/* ---------------------------------------------------------------- služby -- */

payload.logger.info('— Detail služeb...')

const services = await payload.find({
  collection: 'services',
  depth: 0,
  limit: 100,
  pagination: false,
})
const serviceBySlug = new Map(services.docs.map((doc) => [doc.slug, doc]))

for (const service of services.docs) {
  const scope = SCOPE[service.slug]
  if (!scope) continue

  const visit = VISIT[service.slug]
  const related = (RELATED[service.slug] ?? [])
    .map(({ slug, note }) => {
      const target = serviceBySlug.get(slug)
      return target ? { service: target.id, note } : null
    })
    .filter((item) => item !== null)

  /*
   * Pořadí z artboardu 03: rozsah práce → prohlídka → realizace → navazující
   * řemesla. Pás realizací už na stránce je (populate-projects.ts) — přebíráme
   * ho i s nastavením, aby se nezaložil podruhé.
   */
  const existingShowcase = (service.layout ?? []).find(
    (block) => block.blockType === 'projectShowcase',
  )

  const layout: NonNullable<Service['layout']> = [
    {
      blockType: 'featureGrid',
      // Artboard 03: „Rozsah práce“ je nadpis sekce, ne eyebrow nad nadpisem.
      heading: 'Rozsah práce',
      columns: '2',
      items: scope.map((item) => ({
        title: item.title,
        description: item.description,
        tags: item.tags.map((label) => ({ label })),
      })),
    },
    {
      blockType: 'cta',
      variant: 'slab',
      richText: richText(visit.heading, [visit.lead]) as never,
      links: actions(visit.label),
    },
    {
      ...(existingShowcase ?? {
        blockType: 'projectShowcase' as const,
        source: 'service' as const,
        service: service.id,
        limit: 3,
        links: [
          {
            link: {
              type: 'custom' as const,
              label: 'Všechny realizace',
              url: `/realizace/sluzba/${service.slug}`,
              appearance: 'outline' as const,
            },
          },
        ],
      }),
      eyebrow: 'Reference',
      heading: SHOWCASE[service.slug] ?? 'Vybrané realizace',
    },
    ...(related.length
      ? [
          {
            blockType: 'relatedServices' as const,
            eyebrow: 'Často navazuje',
            heading: 'S tímhle se to obvykle řeší zároveň',
            lead: 'Uděláme to v jednom termínu — nemusíte shánět další firmu.',
            variant: 'plain' as const,
            items: related,
          },
        ]
      : []),
  ]

  await payload.update({
    collection: 'services',
    id: service.id,
    depth: 0,
    context,
    data: {
      shortDescription: SHORT[service.slug] ?? service.shortDescription,
      image: mediaIds.get(`sluzba-${service.slug}`) ?? service.image,
      layout,
    },
  })
  payload.logger.info(`  /sluzby/${service.slug}`)
}

/* ------------------------------------------------------------- realizace -- */

payload.logger.info('— Realizace...')

const existingProjects = await payload.find({
  collection: 'projects',
  depth: 0,
  limit: 200,
  pagination: false,
  draft: true,
})

for (const project of PROJECTS) {
  const serviceIds = project.services
    .map((slug) => serviceBySlug.get(slug)?.id)
    .filter((id): id is number => typeof id === 'number')

  const data = {
    slug: project.slug,
    _status: 'published' as const,
    title: project.title,
    summary: project.summary,
    location: project.location,
    completedAt: new Date(project.completedAt).toISOString(),
    publishedAt: new Date(project.completedAt).toISOString(),
    services: serviceIds,
    featured: project.featured ?? false,
    coverImage: project.media ? (mediaIds.get(project.media) ?? null) : null,
    facts: project.facts,
    layout: [
      {
        blockType: 'content' as const,
        columns: [
          {
            size: 'twoThirds' as const,
            richText: richText('Průběh', project.body) as never,
            enableLink: false,
          },
        ],
      },
    ],
  } satisfies Partial<Project> & { slug: string }

  const match = existingProjects.docs.find((doc) => doc.slug === project.slug)

  if (match) {
    await payload.update({ collection: 'projects', id: match.id, data, depth: 0, context })
    payload.logger.info(`  aktualizováno /realizace/${project.slug}`)
  } else {
    await payload.create({ collection: 'projects', data, depth: 0, context })
    payload.logger.info(`  založeno /realizace/${project.slug}`)
  }
}

/* --------------------------------------------------------------- stránky -- */

const findPage = async (slug: string) => {
  const found = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    pagination: false,
    draft: true,
    where: { slug: { equals: slug } },
  })
  return found.docs[0]
}

const updatePage = async (slug: string, data: Partial<Page>) => {
  const page = await findPage(slug)
  if (!page) {
    payload.logger.warn(`  stránka /${slug} neexistuje — přeskakuji`)
    return
  }
  await payload.update({ collection: 'pages', id: page.id, data: data as never, depth: 0, context })
  payload.logger.info(`  /${slug}`)
}

payload.logger.info('— Stránky...')

const home = await findPage('home')
const homeLayout = (home?.layout ?? []) as NonNullable<Page['layout']>
const keepBlock = (type: string) => homeLayout.find((block) => block.blockType === type)

await updatePage('home', {
  hero: {
    type: 'lowImpact',
    eyebrow: 'Rodinná firma od roku 1993',
    richText: richText(
      'Stavíme, rekonstruujeme a instalujeme od roku 1993',
      [
        'Stavební práce, střechy, elektroinstalace, voda, topení i podlahy — jeden dodavatel na celý dům. Působíme v Praze a Středočeském kraji.',
      ],
      'h1',
    ) as never,
    // Starter šablona tu nechala odkazy „All posts“ a „Contact“ — návrh má
    // poptávku a telefon.
    links: actions('Nezávazná poptávka'),
    facts: home?.hero?.facts ?? [],
  },
  layout: [
    {
      ...(keepBlock('servicesGrid') ?? { blockType: 'servicesGrid' as const, source: 'all' as const }),
      eyebrow: 'Co děláme',
      heading: 'Šest řemesel pod jednou střechou',
      lead: 'Nemusíte hledat pět firem a hlídat, kdo na koho čeká. Domluvíte se s námi jednou, koordinaci profesí řešíme my a předáme hotové dílo s revizemi.',
    },
    keepBlock('stats') ?? {
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
      variant: 'slab' as const,
      steps: [
        {
          title: 'Poptávka',
          description: 'Zavoláte nebo napíšete. Ozveme se týž den, i mimo pracovní dobu.',
        },
        {
          title: 'Návrh a cena',
          description: 'Přijedeme se podívat, změříme a pošleme položkovou nabídku.',
        },
        {
          title: 'Realizace',
          description: 'Jeden termín, jedna parta, koordinaci profesí řešíme my.',
        },
        {
          title: 'Předání a servis',
          description: 'Předáme dílo s revizemi a zůstaneme na telefonu.',
        },
      ],
    },
    {
      ...(keepBlock('projectShowcase') ?? {
        blockType: 'projectShowcase' as const,
        source: 'featured' as const,
        limit: 3,
      }),
      eyebrow: 'Reference',
      heading: 'Co jsme naposledy dokončili',
      links: [
        {
          link: {
            type: 'custom' as const,
            label: 'Všechny realizace',
            url: '/realizace',
            appearance: 'outline' as const,
          },
        },
      ],
    },
    keepBlock('photoStrip') ?? {
      blockType: 'photoStrip' as const,
      source: 'latest' as const,
      limit: '3' as const,
      plain: true,
    },
    {
      ...(keepBlock('brands') ?? {
        blockType: 'brands' as const,
        items: [
          { name: 'Velux' },
          { name: 'Vaillant' },
          { name: 'Stiebel Eltron' },
          { name: 'Parador' },
          { name: 'Quantum' },
          { name: 'Alpex' },
        ],
      }),
      eyebrow: 'Pracujeme s materiály',
      heading: null,
      lead: null,
    },
    {
      blockType: 'cta' as const,
      variant: 'slab' as const,
      richText: richText('Řekneme cenu, než začneme', [
        'Napište, co potřebujete, nebo zavolejte. Prohlídka na místě je bez poplatku.',
      ]) as never,
      links: actions('Napsat poptávku'),
    },
  ] as never,
})

const about = await findPage('o-nas')
const aboutLayout = (about?.layout ?? []) as NonNullable<Page['layout']>
const aboutBlock = (type: string) => aboutLayout.find((block) => block.blockType === type)
const teamPhoto = mediaIds.get('o-nas-parta')

await updatePage('o-nas', {
  hero: {
    type: 'lowImpact',
    eyebrow: 'Od roku 1993',
    richText: richText(
      'Rodinná firma, která dům dotáhne do konce',
      [
        'Za firmou stojí Václav Novotný. Začínali jsme instalacemi, dnes pokrýváme šest řemesel — a to je celý rozdíl: nekoordinujete pět dodavatelů, mluvíte s jedním.',
      ],
      'h1',
    ) as never,
    links: actions('Nezávazná poptávka'),
    facts: about?.hero?.facts ?? [],
  },
  layout: [
    ...(teamPhoto
      ? [
          {
            blockType: 'textWithImage' as const,
            image: teamPhoto,
            imagePosition: 'right' as const,
            richText: richText('Jak pracujeme', [
              'Na stavbě je jedna parta, kterou znáte. Cenu dáváme položkově a písemně, aby bylo vidět, za co se platí. Když se v průběhu něco najde, řekneme to hned a ne až na faktuře.',
              'Elektro a plyn předáváme s revizí. Po předání zůstáváme na telefonu — u domu, který jsme stavěli, se to čeká.',
            ]) as never,
          },
        ]
      : []),
    aboutBlock('photoStrip') ?? {
      blockType: 'photoStrip' as const,
      source: 'featured' as const,
      limit: '3' as const,
      plain: true,
    },
    {
      ...(aboutBlock('facts') ?? { blockType: 'facts' as const, autoFromCompany: true }),
      eyebrow: 'Čísla a fakta',
      heading: 'Kdo jsme',
      lead: 'Údaje se berou z firemního profilu, takže nikde nezestárnou.',
    },
    {
      blockType: 'faq' as const,
      eyebrow: 'Časté dotazy',
      heading: 'Na co se ptáte nejčastěji',
      anchor: 'caste-dotazy',
      defaultOpenFirst: true,
      items: [
        {
          question: 'Kolik bude stát moje zakázka?',
          answer:
            'Bez prohlídky vám cenu neřekneme — u střech a rekonstrukcí se skutečný rozsah pozná až na místě. Prohlídka je bez poplatku a nabídku posíláme položkově, písemně.',
        },
        {
          question: 'Za jak dlouho můžete začít?',
          answer:
            'Podle řemesla a ročního období. Na prohlídku se dostaneme obvykle do několika dnů a termín realizace řekneme rovnou u nabídky. Když nestíháme, řekneme to hned — ne až v půlce léta.',
        },
        {
          question: 'Uděláte celou rekonstrukci, nebo jen jedno řemeslo?',
          answer:
            'Obojí. Šest řemesel máme vlastních, takže zvládneme celou rekonstrukci v jedné dodávce. Klidně ale přijedeme jen vyměnit kotel nebo položit podlahu.',
        },
        {
          question: 'Dodáváte revize na elektro a plyn?',
          answer:
            'Ano. Elektro i plyn předáváme s revizní zprávou — je součástí dodávky, ne příplatek.',
        },
        {
          question: 'Kam všude jezdíte?',
          answer:
            'Praha a Středočeský kraj. Do 30 km od Kladna jezdíme na prohlídku běžně do dvou dnů, dál se domluvíme podle rozsahu zakázky.',
        },
        {
          question: 'Vyřídíte i papíry a povolení?',
          answer:
            'U větších akcí ano — od architektonického řešení po vyřízení formalit na úřadech.',
        },
      ],
    },
    {
      blockType: 'cta' as const,
      variant: 'slab' as const,
      richText: richText('Zbytek doladíme po telefonu', [
        'Zavolejte kdykoli — nemáme pevnou pracovní dobu. Prohlídka na místě je bez poplatku.',
      ]) as never,
      links: actions('Napsat poptávku'),
    },
  ] as never,
})

const contact = await findPage('kontakt')

await updatePage('kontakt', {
  hero: {
    type: 'lowImpact',
    eyebrow: 'Kontakt',
    richText: richText(
      'Zavolejte, jsme tu i po pracovní době',
      ['Nemáme pevnou pracovní dobu. Když se nedovoláte, ozveme se zpět týž den.'],
      'h1',
    ) as never,
    facts: contact?.hero?.facts ?? [],
  },
})

/*
 * Starter šablona nechala v kolekci vlastní stránku /contact (a jednu bez
 * názvu). Nemažeme je — jen je stáhneme z publikovaných, aby web neměl dvě
 * kontaktní stránky. Smazat je může klient v administraci.
 */
payload.logger.info('— Zbytky starter šablony...')

for (const slug of ['contact']) {
  const page = await findPage(slug)
  if (page && page._status === 'published') {
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { _status: 'draft' },
      depth: 0,
      context,
    })
    payload.logger.info(`  /${slug} stažena z publikovaných`)
  }
}

payload.logger.info('Hotovo.')
process.exit(0)
