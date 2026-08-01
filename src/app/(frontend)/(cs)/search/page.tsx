import type { Metadata } from 'next/types'

import React from 'react'
import { SearchPage } from '@/domains/search'
import { siteConfig } from '@/shared/config/site'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  return <SearchPage query={query} />
}

export function generateMetadata(): Metadata {
  return {
    title: `Search | ${siteConfig.name}`,
  }
}
