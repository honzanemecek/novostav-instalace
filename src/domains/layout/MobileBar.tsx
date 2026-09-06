import React from 'react'
import { type TypedLocale } from 'payload'

import { getCompany } from '@/domains/company'
import { ActionRow } from '@/shared/components/ActionRow/ActionRow'
import { PhoneLink } from '@/shared/components/PhoneLink/PhoneLink'
import { Button } from '@/shared/ui/button'
import { getCachedGlobal } from './queries/getGlobals'

/**
 * Pruh u spodní hrany na mobilu: poptávka a telefon, vždy na dosah palce.
 *
 * `<body>` má kvůli němu `pb-[68px] md:pb-0`, aby pruh nepřekrýval konec
 * patičky.
 */
export async function MobileBar({ locale = 'cs' }: { locale?: TypedLocale } = {}) {
  const [headerData, company] = await Promise.all([
    getCachedGlobal('header', 1, locale)(),
    getCompany(locale),
  ])

  const cta = headerData?.cta
  if (!cta?.length && !company.phone) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-5 py-3 backdrop-blur md:hidden">
      <div className="flex gap-3">
        {!!cta?.length && <ActionRow links={cta.slice(0, 1)} full className="flex-1" />}
        {company.phone && (
          <Button asChild variant="ink" full className="flex-1">
            <PhoneLink phone={company.phone} tone="inherit">
              Zavolat
            </PhoneLink>
          </Button>
        )}
      </div>
    </div>
  )
}
