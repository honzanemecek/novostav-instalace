import Link from 'next/link'
import React from 'react'
import { type TypedLocale } from 'payload'

import { formatAddress, getCompany, telHref } from '@/domains/company'
import { CMSLink } from '@/shared/components/Link'
import { Logo } from '@/shared/components/Logo/Logo'
import { localizeHref } from '@/shared/utils/locale'
import { ThemeSelector } from '../providers/Theme/ThemeSelector'
import { getCachedGlobal } from '../queries/getGlobals'

export async function Footer({ locale = 'cs' }: { locale?: TypedLocale } = {}) {
  const [footerData, company] = await Promise.all([
    getCachedGlobal('footer', 1, locale)(),
    getCompany(locale),
  ])

  const navItems = footerData?.navItems || []
  const officeAddress = formatAddress(company.office)
  const seatAddress = formatAddress(company.registeredSeat)

  // The legal line: who is billing, from where, under which IČO.
  const legalParts = [
    company.legalName,
    seatAddress,
    company.ico ? `IČO ${company.ico}` : null,
    company.dic ? `DIČ ${company.dic}` : null,
    company.vatPayer ? 'Plátce DPH' : null,
  ].filter(Boolean)

  return (
    <footer className="mt-auto border-t border-border bg-black text-white dark:bg-card">
      <div className="container flex flex-col gap-10 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <Link className="flex items-center" href={localizeHref('/', locale)}>
              <Logo />
            </Link>
            <address className="flex flex-col gap-1 text-sm not-italic text-white/70">
              {company.phone && (
                <a className="hover:text-white" href={telHref(company.phone)}>
                  {company.phone}
                </a>
              )}
              {company.email && (
                <a className="hover:text-white" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              )}
              {officeAddress && <span>{officeAddress}</span>}
            </address>
          </div>

          <div className="flex flex-col-reverse items-start gap-6 md:flex-row md:items-start">
            <ThemeSelector />
            <nav className="flex flex-col gap-3">
              {navItems.map(({ link }, i) => (
                <CMSLink className="text-white" key={i} {...link} />
              ))}
            </nav>
          </div>
        </div>

        {legalParts.length > 0 && (
          <p className="border-t border-white/15 pt-6 text-xs text-white/50">
            {legalParts.join(' · ')}
          </p>
        )}
      </div>
    </footer>
  )
}
