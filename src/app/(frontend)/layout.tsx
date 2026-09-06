import type { Metadata } from 'next'

import { cn } from '@/shared/utils/ui'
import { IBM_Plex_Sans } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/domains/users'
import { Providers } from '@/domains/layout'
import { InitTheme } from '@/domains/layout'
import { mergeOpenGraph } from '@/shared/utils/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/shared/utils/getURL'

/** Jedna rodina písma na nadpisy, text, štítky i čísla. Latin-ext kvůli češtině. */
const plexSans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(plexSans.variable, 'font-sans')} lang="cs" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          {children}
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: { card: 'summary_large_image' },
}
