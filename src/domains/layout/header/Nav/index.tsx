'use client'

import { Menu, Phone, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { Header as HeaderType } from '@/payload/payload-types'

import { ActionRow } from '@/shared/components/ActionRow/ActionRow'
import { CMSLink, cmsLinkHref } from '@/shared/components/Link'
import { PhoneLink } from '@/shared/components/PhoneLink/PhoneLink'
import { useLocalizeHref } from '@/shared/components/LocaleProvider'
import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/ui'

type Props = {
  data: HeaderType
  phone?: string | null
  availabilityNote?: string | null
}

export const HeaderNav: React.FC<Props> = ({ data, phone, availabilityNote }) => {
  const navItems = data?.navItems || []
  const cta = data?.cta
  const localizeHref = useLocalizeHref()
  const pathname = usePathname()

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

  /**
   * Aktivní položka = 2px akcentní linka pod textem. Neaktivní nese průhlednou
   * linku téže tloušťky, aby při přejezdu nic neposkočilo.
   */
  const isActive = (link: Parameters<typeof cmsLinkHref>[0]): boolean => {
    const target = cmsLinkHref(link)
    if (!target || !target.startsWith('/')) return false
    const href = localizeHref(target.split('#')[0])
    return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="flex items-center gap-2 md:gap-4" ref={containerRef}>
      <nav aria-label="Hlavní navigace" className="hidden items-center gap-6 md:flex">
        {navItems.map(({ link }, i) => (
          <CMSLink
            key={i}
            {...link}
            appearance="inline"
            className={cn(
              'border-b-2 pb-1 text-[15px] font-medium leading-none no-underline transition-colors duration-150',
              isActive(link)
                ? 'border-accent text-accent'
                : 'border-transparent text-foreground hover:text-accent',
            )}
          />
        ))}
      </nav>

      {phone && (
        <>
          <Button asChild variant="outline" phone className="hidden md:inline-flex">
            <PhoneLink phone={phone} tone="inherit" />
          </Button>
          {/* Telefon je konverze — na mobilu nikdy nemizí do menu a drží 44px. */}
          <Button asChild variant="outline" size="icon" className="border-accent text-accent md:hidden">
            <PhoneLink phone={phone} tone="inherit">
              <Phone aria-hidden className="size-5" />
              <span className="sr-only">Zavolat {phone}</span>
            </PhoneLink>
          </Button>
        </>
      )}

      {!!cta?.length && <ActionRow links={cta} className="hidden md:flex" />}

      {navItems.length > 0 && (
        <button
          aria-controls="mobile-nav"
          aria-expanded={open}
          className="inline-flex size-11 items-center justify-center border border-border md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span className="sr-only">{open ? 'Zavřít menu' : 'Otevřít menu'}</span>
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </button>
      )}

      {open && (
        <div
          className="absolute inset-x-0 top-full z-30 border-b border-border bg-background md:hidden"
          id="mobile-nav"
          // Closing on the click that navigates avoids a pathname effect and
          // also handles a link back to the page you are already on.
          onClick={close}
        >
          <nav aria-label="Hlavní navigace" className="container">
            <ul className="flex flex-col">
              {navItems.map(({ link }, i) => (
                <li className="border-b border-border" key={i}>
                  <CMSLink
                    className={cn(
                      'flex min-h-14 items-center text-[17px] font-semibold no-underline',
                      isActive(link) ? 'text-accent' : 'text-foreground',
                    )}
                    {...link}
                    appearance="inline"
                  />
                </li>
              ))}
            </ul>
          </nav>
          <div className="container flex flex-col gap-4 py-6">
            {!!cta?.length && <ActionRow links={cta} full />}
            {availabilityNote && (
              <p className="text-sm leading-[1.7] text-muted-foreground">{availabilityNote}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
