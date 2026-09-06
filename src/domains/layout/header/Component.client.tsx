'use client'
import Link from 'next/link'
import React from 'react'

import type { Header } from '@/payload/payload-types'

import { Logo } from '@/shared/components/Logo/Logo'
import { useLocalizeHref } from '@/shared/components/LocaleProvider'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  phone?: string | null
  availabilityNote?: string | null
}

/**
 * Vlasová linka na bílém podkladu, žádný stín. Hlavička nikdy nesedí na
 * fotografii, takže nepotřebuje překlápět téma — proto tu není `useHeaderTheme`.
 */
export const HeaderClient: React.FC<HeaderClientProps> = ({ data, phone, availabilityNote }) => {
  const localizeHref = useLocalizeHref()

  return (
    <header className="relative z-30 border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between gap-6 md:h-[92px]">
        <Link href={localizeHref('/')} aria-label="Novostav-Instalace — domů" className="shrink-0">
          <Logo variant="lockup" size={28} className="md:hidden" />
          <Logo variant="lockup" size={40} className="hidden md:flex" />
        </Link>
        <HeaderNav data={data} phone={phone} availabilityNote={availabilityNote} />
      </div>
    </header>
  )
}
