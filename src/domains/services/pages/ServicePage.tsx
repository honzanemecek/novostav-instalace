import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import type { TypedLocale } from 'payload'

import { getCompany } from '@/domains/company'
import { getProjectCountsByService } from '@/domains/projects'
import { RenderBlocks } from '@/domains/pages'
import { DuoPhoto } from '@/shared/components/DuoPhoto/DuoPhoto'
import { LivePreviewListener } from '@/shared/components/LivePreviewListener'
import { PageHero } from '@/shared/components/PageHero/PageHero'
import { getServiceBySlug } from '../queries/getServiceBySlug'

export async function ServicePage({
  slug,
  locale = 'cs',
}: {
  slug: string
  locale?: TypedLocale
}) {
  const { isEnabled: draft } = await draftMode()
  const service = await getServiceBySlug(slug, locale)

  if (!service) notFound()

  const [counts, company] = await Promise.all([
    getProjectCountsByService(locale),
    getCompany(locale),
  ])
  const count = counts[service.id] ?? 0

  /*
   * Sloupec faktů nahradil odrážky pod perexem. Nic se tu nedopočítává —
   * `highlights` se čtou jako štítky v bloku „Rozsah práce“, kde nesou víc než
   * seznam, a všechno ostatní jde z globálu Firma.
   */
  const facts = [
    count ? { label: 'Realizace', value: String(count) } : null,
    company.serviceArea ? { label: 'Kde pracujeme', value: company.serviceArea } : null,
    company.availabilityNote ? { label: 'Kdy voláte', value: company.availabilityNote } : null,
  ].filter((fact) => fact !== null)

  return (
    <article>
      {draft && <LivePreviewListener />}

      <PageHero
        breadcrumb={[
          { label: 'Služby', href: '/sluzby' },
          { label: service.title },
        ]}
        eyebrow="Řemeslo"
        heading={service.title}
        lead={service.shortDescription}
        facts={facts}
        railWidth="md"
        className="pb-10 md:pb-14"
      />

      {/* Jedna skutečná fotografie služby. Dvoj- a trojpásy si redaktor přidá
          blokem „Pás fotografií“, který tahá z realizací — nevymýšlíme sloty,
          pro které nejsou data. */}
      {service.image && (
        <DuoPhoto plain resource={service.image} aspect="16 / 7" priority size="100vw" />
      )}

      <RenderBlocks blocks={service.layout} />
    </article>
  )
}
