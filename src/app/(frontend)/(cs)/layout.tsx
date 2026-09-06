import React from 'react'
import { Footer, Header, MobileBar } from '@/domains/layout'

export default function CzechLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <MobileBar />
    </>
  )
}
