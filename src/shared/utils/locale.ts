import type { TypedLocale } from 'payload'

export type Locale = TypedLocale // 'cs' | 'en', derived from generated payload-types
export const DEFAULT_LOCALE: Locale = 'cs'
export const LOCALES: Locale[] = ['cs', 'en']

/** '/x' -> '/en/x', '/' -> '/en' when locale is 'en'; identity for 'cs' and non-path hrefs. */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE || !href.startsWith('/')) return href
  return href === '/' ? `/${locale}` : `/${locale}${href}`
}
