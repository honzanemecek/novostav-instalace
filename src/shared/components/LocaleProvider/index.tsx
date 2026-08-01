'use client'
import React, { createContext, useContext } from 'react'
import { DEFAULT_LOCALE, localizeHref, type Locale } from '@/shared/utils/locale'

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

export const LocaleProvider: React.FC<{ children: React.ReactNode; locale: Locale }> = ({
  children,
  locale,
}) => <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>

export const useLocale = (): Locale => useContext(LocaleContext)
export const useLocalizeHref = (): ((href: string) => string) => {
  const locale = useLocale()
  return (href) => localizeHref(href, locale)
}
