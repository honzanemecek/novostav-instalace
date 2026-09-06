import React from 'react'

import type { ContactDetailsBlock as Props } from '@/payload/payload-types'

import { formatAddress, getCompany } from '@/domains/company'
import { FactList } from '@/shared/components/FactList/FactList'
import { PhoneLink } from '@/shared/components/PhoneLink/PhoneLink'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { OfficeSchematic } from './OfficeSchematic'

/**
 * Renders whatever is in the `company` global. Nothing here is authored on the
 * block itself — the client changes their phone number once and every instance
 * of this block follows.
 *
 * Bez ikon (pravidlo systému č. 8): štítek řádku už říká, co v něm je.
 */
export const ContactDetailsBlock: React.FC<Props> = async ({
  eyebrow,
  heading,
  lead,
  showPhone,
  showEmail,
  showAddress,
  showServiceArea,
  showBigPhone,
  showMap,
}) => {
  const company = await getCompany()
  const officeAddress = formatAddress(company.office)

  const facts = [
    showPhone && company.phone
      ? {
          label: 'Telefon',
          value: <PhoneLink phone={company.phone} tone="inherit" size="inline" />,
        }
      : null,
    showEmail && company.email
      ? {
          label: 'E-mail',
          value: (
            <a className="no-underline" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          ),
        }
      : null,
    showAddress && officeAddress
      ? {
          label: 'Kancelář',
          value: company.office?.mapUrl ? (
            <a className="no-underline" href={company.office.mapUrl} rel="noreferrer" target="_blank">
              {officeAddress}
            </a>
          ) : (
            officeAddress
          ),
        }
      : null,
    showServiceArea && company.serviceArea
      ? { label: 'Působíme', value: company.serviceArea }
      : null,
    company.availabilityNote ? { label: 'Kdy voláte', value: company.availabilityNote } : null,
  ].filter((fact) => fact !== null)

  if (!facts.length) return null

  return (
    <>
      <section className="container py-14 md:py-[104px]">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_420px] md:items-start md:gap-20">
          <div>
            <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} as="h1" />
            {/* Telefon je konverze — na kontaktu je největším prvkem stránky. */}
            {showBigPhone !== false && company.phone && (
              <PhoneLink phone={company.phone} size="lg" className="mt-10 block" />
            )}
            {company.availabilityNote && showBigPhone !== false && (
              <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground">
                {company.availabilityNote}
              </p>
            )}
          </div>
          <FactList items={facts} />
        </div>
      </section>

      {showMap && (
        <OfficeSchematic
          address={officeAddress}
          note={company.office?.note}
          mapUrl={company.office?.mapUrl}
          serviceArea={company.serviceArea}
          availabilityNote={company.availabilityNote}
          phone={company.phone}
        />
      )}
    </>
  )
}
