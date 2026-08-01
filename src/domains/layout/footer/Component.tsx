import { getCachedGlobal } from '../queries/getGlobals'
import Link from 'next/link'
import React from 'react'
import { type TypedLocale } from 'payload'

import { ThemeSelector } from '../providers/Theme/ThemeSelector'
import { CMSLink } from '@/shared/components/Link'
import { Logo } from '@/shared/components/Logo/Logo'
import { localizeHref } from '@/shared/utils/locale'

export async function Footer({ locale = 'cs' }: { locale?: TypedLocale } = {}) {
  const footerData = await getCachedGlobal('footer', 1, locale)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href={localizeHref('/', locale)}>
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
