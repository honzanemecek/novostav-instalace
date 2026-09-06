import Link from 'next/link'
import React from 'react'
import { type TypedLocale } from 'payload'

import { formatAddress, getCompany } from '@/domains/company'
import { getServicesForNav } from '@/domains/services'
import { CMSLink } from '@/shared/components/Link'
import { Logo } from '@/shared/components/Logo/Logo'
import { PhoneLink } from '@/shared/components/PhoneLink/PhoneLink'
import { localizeHref } from '@/shared/utils/locale'
import { getCachedGlobal } from '../queries/getGlobals'

/** Nadpis sloupce — jediné verzálky v patičce. */
const ColumnHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="eyebrow text-[oklch(0.72_0.008_250)]">{children}</p>
)

const linkClasses = 'text-[15px] text-white/70 no-underline transition-colors duration-150 hover:text-white'

export async function Footer({ locale = 'cs' }: { locale?: TypedLocale } = {}) {
  const [footerData, company, services] = await Promise.all([
    getCachedGlobal('footer', 1, locale)(),
    getCompany(locale),
    getServicesForNav(locale)(),
  ])

  const navItems = footerData?.navItems || []
  const legalLinks = footerData?.legalLinks || []
  const officeAddress = formatAddress(company.office)
  const seatAddress = formatAddress(company.registeredSeat)

  /*
   * Právní řádek. Skládá se z globálu Firma — nikdy z konstant. IČO se objeví
   * teprve tehdy, až ho klient do CMS doplní (pravidlo „žádná vymyšlená data“).
   */
  const legalParts = [
    `© ${new Date().getFullYear()}`,
    company.legalName,
    company.ico ? `IČO ${company.ico}` : null,
    company.vatPayer ? 'plátce DPH' : null,
    seatAddress ? `sídlo ${seatAddress}` : null,
  ].filter(Boolean)

  return (
    <footer className="mt-auto bg-[oklch(0.185_0.008_250)] text-white dark:bg-card">
      <div className="container pb-7 pt-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <Link className="inline-flex" href={localizeHref('/', locale)}>
              <Logo variant="lockup" size={34} tone="onSlab" />
            </Link>
            {footerData?.tagline && (
              <p className="max-w-[34ch] text-[15px] leading-[1.7] text-white/70">{footerData.tagline}</p>
            )}
          </div>

          {services.length > 0 && (
            <nav aria-label="Služby" className="flex flex-col gap-4">
              <ColumnHead>Služby</ColumnHead>
              <ul className="flex flex-col gap-2.5">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link className={linkClasses} href={localizeHref(`/sluzby/${service.slug}`, locale)}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {navItems.length > 0 && (
            <nav aria-label="Firma" className="flex flex-col gap-4">
              <ColumnHead>Firma</ColumnHead>
              <ul className="flex flex-col gap-2.5">
                {navItems.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink className={linkClasses} {...link} appearance="inline" />
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="flex flex-col gap-4">
            <ColumnHead>Kontakt</ColumnHead>
            <address className="flex flex-col gap-2.5 not-italic">
              {/* Jediný barevný prvek v patičce. */}
              <PhoneLink phone={company.phone} tone="footer" size="md" className="md:text-[15px]" />
              {company.email && (
                <a className={linkClasses} href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              )}
              {officeAddress && <span className="text-[15px] text-white/70">{officeAddress}</span>}
              {company.availabilityNote && (
                <span className="text-[15px] text-white/70">{company.availabilityNote}</span>
              )}
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[oklch(1_0_0/0.16)] pt-6 text-[13px] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>{legalParts.join(' — ')}</p>
          {legalLinks.length > 0 && (
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {legalLinks.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink
                    className="text-white/50 no-underline transition-colors duration-150 hover:text-white"
                    {...link}
                    appearance="inline"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
