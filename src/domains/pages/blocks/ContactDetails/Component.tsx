import React from 'react'
import { Mail, MapPin, MapPinned, Phone } from 'lucide-react'

import type { ContactDetailsBlock as Props } from '@/payload/payload-types'

import { formatAddress, getCompany, telHref } from '@/domains/company'
import { SectionHeader } from '@/shared/components/SectionHeader'

/**
 * Renders whatever is in the `company` global. Nothing here is authored on the
 * block itself — the client changes their phone number once and every instance
 * of this block follows.
 */
export const ContactDetailsBlock: React.FC<Props> = async ({
  eyebrow,
  heading,
  lead,
  showPhone,
  showEmail,
  showAddress,
  showServiceArea,
}) => {
  const company = await getCompany()
  const officeAddress = formatAddress(company.office)

  const entries = [
    showPhone && company.phone
      ? {
          key: 'phone',
          icon: Phone,
          label: 'Telefon',
          value: company.phone,
          href: telHref(company.phone),
          note: company.availabilityNote,
        }
      : null,
    showEmail && company.email
      ? {
          key: 'email',
          icon: Mail,
          label: 'E-mail',
          value: company.email,
          href: `mailto:${company.email}`,
          note: null,
        }
      : null,
    showAddress && officeAddress
      ? {
          key: 'address',
          icon: MapPin,
          label: 'Kancelář',
          value: officeAddress,
          href: company.office?.mapUrl ?? null,
          note: company.office?.note,
        }
      : null,
    showServiceArea && company.serviceArea
      ? {
          key: 'area',
          icon: MapPinned,
          label: 'Působíme',
          value: company.serviceArea,
          href: null,
          note: null,
        }
      : null,
  ].filter((entry) => entry !== null)

  if (!entries.length) return null

  return (
    <section className="container">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
      <dl className="mt-10 grid gap-6 sm:grid-cols-2">
        {entries.map(({ key, icon: Icon, label, value, href, note }) => (
          <div key={key} className="flex gap-4 rounded-lg border border-border bg-card p-6">
            <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-lg font-medium">
                {href ? (
                  <a
                    className="underline-offset-4 hover:underline"
                    href={href}
                    {...(href.startsWith('http')
                      ? { target: '_blank', rel: 'noreferrer' }
                      : undefined)}
                  >
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
              {note && <p className="text-sm text-muted-foreground">{note}</p>}
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
