import type { Metadata } from 'next/types'

import React from 'react'
import { PostsArchivePage } from '@/domains/posts'
import { siteConfig } from '@/shared/config/site'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  return <PostsArchivePage locale="en" />
}

export function generateMetadata(): Metadata {
  return {
    title: `Posts | ${siteConfig.name}`,
  }
}
