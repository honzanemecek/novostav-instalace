import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '../queries/getGlobals'
import React from 'react'
import { type TypedLocale } from 'payload'

export async function Header({ locale = 'cs' }: { locale?: TypedLocale } = {}) {
  const headerData = await getCachedGlobal('header', 1, locale)()

  return <HeaderClient data={headerData} />
}
