import type { Company } from '@/payload/payload-types'

// `telHref` lives in shared/ so `PhoneLink` can use it (shared/ may not import
// domains/). Re-exported here so the company domain's public API is unchanged.
export { telHref } from '@/shared/utils/tel'

/** Years in the trade, derived from `foundedYear` so it is never stale. */
export const yearsInBusiness = (foundedYear?: number | null): number | null =>
  foundedYear ? new Date().getFullYear() - foundedYear : null

/** "Švýcarská 2432, 272 01 Kladno 1-Kročehlavy" — skips missing parts. */
export const formatAddress = (
  address?: { street?: string | null; city?: string | null; zip?: string | null } | null,
): string => {
  if (!address) return ''
  const cityLine = [address.zip, address.city].filter(Boolean).join(' ')
  return [address.street, cityLine].filter(Boolean).join(', ')
}

export type CompanyAddress = NonNullable<Company['office']>
