import React from 'react'
import { Footer, Header } from '@/domains/layout'
import { LocaleProvider } from '@/shared/components/LocaleProvider'

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider locale="en">
      {/* Root layout hardcodes lang="cs"; correct it before hydration for /en. */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='en'" }} />
      <Header locale="en" />
      {children}
      <Footer locale="en" />
    </LocaleProvider>
  )
}
