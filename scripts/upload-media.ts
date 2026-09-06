/**
 * Nahraje do knihovny médií JEDNU fotografii z `design-media.ts`.
 *
 * Proč jednu na jedno spuštění: v tomhle projektu se přes Local API zapíše do
 * Vercel Blobu jen první upload v procesu. Druhý a další skončí tak, že Payload
 * dokument založí, adaptér chybu spolkne a v knihovně zůstane médium bez
 * souboru — web na něm pak vrací 404. Ověřeno: první soubor 200, druhý 404,
 * a to i s novým názvem, pauzou i opakováním. Zápis přes REST API Blobu přitom
 * projde pokaždé, takže úložiště v pořádku je.
 *
 * `populate-design-content.ts` proto tenhle skript spouští jako samostatný
 * proces pro každou fotku. Ručně:
 *
 *   NODE_ENV=production pnpm tsx scripts/upload-media.ts sluzba-strechy
 *   NODE_ENV=production pnpm tsx scripts/upload-media.ts --list
 *
 * Idempotentní: pokud médium existuje a soubor v úložišti opravdu je, nedělá nic.
 * Návratový kód 1 znamená „fotka se nenahrála“.
 */
import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import { MEDIA } from './design-media'

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

const key = process.argv[2]

if (key === '--list') {
  console.log(MEDIA.map((item) => item.key).join('\n'))
  process.exit(0)
}

if (process.env.NODE_ENV !== 'production') {
  console.error('Refusing to run: set NODE_ENV=production.')
  process.exit(1)
}

const item = MEDIA.find((media) => media.key === key)

if (!item) {
  console.error(`Neznámá fotka „${key}“. Seznam: pnpm tsx scripts/upload-media.ts --list`)
  process.exit(1)
}

const { default: config } = await import('../src/payload/payload.config')
const payload = await getPayload({ config })
const context = { disableRevalidate: true }
const filename = `${item.key}.jpg`

const blobToken = process.env.BLOB_READ_WRITE_TOKEN

/**
 * Je soubor opravdu v úložišti?
 *
 * Ptáme se výpisu úložiště, ne veřejné adresy: ta chvíli po zápisu vrací 404,
 * i když soubor v Blobu leží. Ověřovat přes ni znamená prohlásit povedený
 * upload za chybu — a v předchozí verzi tohohle skriptu to vedlo k tomu, že
 * čerstvě nahranou fotku rovnou smazal.
 */
const stored = async (name: string): Promise<boolean> => {
  if (!blobToken) return true

  for (let attempt = 1; attempt <= 3; attempt++) {
    const url = new URL('https://blob.vercel-storage.com')
    url.searchParams.set('prefix', name)
    url.searchParams.set('limit', '10')
    const res = await fetch(url, { headers: { authorization: `Bearer ${blobToken}` } })

    if (res.ok) {
      const body = (await res.json()) as { blobs: { pathname: string }[] }
      if (body.blobs.some((blob) => blob.pathname === name)) return true
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 2000))
  }

  return false
}

const found = await payload.find({
  collection: 'media',
  depth: 0,
  limit: 1,
  pagination: false,
  where: { filename: { equals: filename } },
})
const existing = found.docs[0]

if (existing && (await stored(filename))) {
  console.log(`${filename} — už v knihovně je`)
  process.exit(0)
}

/*
 * Médium v databázi je, ale soubor v úložišti chybí. Dokument musí pryč —
 * jinak by Payload nový upload pojmenoval „…-1.jpg“. Smazat a hned nahrát
 * ve stejném procesu ale nejde: mazání v Blobu doběhne až po novém zápisu
 * a smaže rovnou tu čerstvou fotku (ověřeno — soubor pak vrací 404).
 * Uklidíme tedy tady a nahráváme v novém procesu.
 */
if (existing) {
  await payload.delete({ collection: 'media', id: existing.id, context })

  if (process.argv[3] === '--after-reset') {
    console.error(`${filename} — úklid nepomohl`)
    process.exit(1)
  }

  await new Promise((resolve) => setTimeout(resolve, 5000))

  const retry = spawnSync('pnpm', ['tsx', 'scripts/upload-media.ts', key, '--after-reset'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  })
  process.exit(retry.status ?? 1)
}

const res = await fetch(item.url)

if (!res.ok) {
  console.error(`${filename} — zdroj vrátil ${res.status}`)
  process.exit(1)
}

const data = Buffer.from(await res.arrayBuffer())

const doc = await payload.create({
  collection: 'media',
  depth: 0,
  context,
  data: {
    alt: item.alt,
    caption: {
      root: {
        type: 'root',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            textFormat: 0,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
                text: `Stock fotografie (${item.credit}). Nahraďte vlastní fotografií hotové práce.`,
              },
            ],
          },
        ],
      },
    } as never,
  },
  file: { name: filename, data, mimetype: 'image/jpeg', size: data.byteLength },
})

/*
 * Dokument po neúspěchu NEMAŽEME: mazání v Blobu doběhne se zpožděním a
 * shodilo by i soubor, který se mezitím zapsal. Radši zůstane médium
 * k ověření v administraci než ztracená fotka.
 */
if (doc.filename !== filename || !(await stored(filename))) {
  console.error(`${filename} — úložiště zápis nepotvrdilo (dokument ${doc.id} nechávám ke kontrole)`)
  process.exit(1)
}

console.log(`${filename} — nahráno (${doc.id})`)
process.exit(0)
