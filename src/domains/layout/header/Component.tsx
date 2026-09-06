import React from 'react'
import { type TypedLocale } from 'payload'

import { getCompany } from '@/domains/company'
import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '../queries/getGlobals'

export async function Header({ locale = 'cs' }: { locale?: TypedLocale } = {}) {
  const [headerData, company] = await Promise.all([
    getCachedGlobal('header', 1, locale)(),
    getCompany(locale),
  ])

  return <HeaderClient data={headerData} phone={company.phone} />
}
