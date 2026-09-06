'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, Phone, SearchIcon, X } from 'lucide-react'

import type { Header as HeaderType } from '@/payload/payload-types'

import { CMSLink } from '@/shared/components/Link'
import { telHref } from '@/domains/company/client'
import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { useLocalizeHref } from '@/shared/components/LocaleProvider'

export const HeaderNav: React.FC<{ data: HeaderType; phone?: string | null }> = ({
  data,
  phone,
}) => {
  const navItems = data?.navItems || []
  const localizeHref = useLocalizeHref()

  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const close = React.useCallback(() => setOpen(false), [])
  useClickOutside(containerRef, close)

  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  return (
    <div className="flex items-center gap-2" ref={containerRef}>
      <nav aria-label="Hlavní navigace" className="hidden items-center gap-4 md:flex">
        {navItems.map(({ link }, i) => (
          <CMSLink key={i} {...link} appearance="link" />
        ))}
      </nav>

      <Link
        className="inline-flex size-11 items-center justify-center"
        href={localizeHref('/search')}
      >
        <span className="sr-only">Hledat</span>
        <SearchIcon aria-hidden className="w-5 text-primary" />
      </Link>

      {/* The phone number is the conversion on this site — it never collapses
          into the menu, and stays a 44px tap target on the smallest screen. */}
      {phone && (
        <a
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          href={telHref(phone)}
        >
          <Phone aria-hidden className="size-4" />
          <span className="hidden sm:inline">{phone}</span>
          <span className="sr-only sm:hidden">Zavolat {phone}</span>
        </a>
      )}

      {navItems.length > 0 && (
        <button
          aria-controls="mobile-nav"
          aria-expanded={open}
          className="inline-flex size-11 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span className="sr-only">{open ? 'Zavřít menu' : 'Otevřít menu'}</span>
          {open ? (
            <X aria-hidden className="size-5" />
          ) : (
            <Menu aria-hidden className="size-5" />
          )}
        </button>
      )}

      {open && (
        <nav
          aria-label="Hlavní navigace"
          className="absolute inset-x-0 top-full z-30 mx-4 rounded-lg border border-border bg-background p-2 shadow-lg md:hidden"
          id="mobile-nav"
          // Closing on the click that navigates avoids a pathname effect and
          // also handles a link back to the page you are already on.
          onClick={close}
        >
          <ul className="flex flex-col">
            {navItems.map(({ link }, i) => (
              <li className="border-b border-border last:border-b-0" key={i}>
                <CMSLink
                  className="flex min-h-12 items-center px-3 text-base"
                  {...link}
                  appearance="link"
                />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
