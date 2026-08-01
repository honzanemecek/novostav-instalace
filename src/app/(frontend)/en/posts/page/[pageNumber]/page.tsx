import type { Metadata } from 'next/types'

import React from 'react'
import { notFound } from 'next/navigation'
import { PostsArchivePage, getPostsPageCount } from '@/domains/posts'
import { siteConfig } from '@/shared/config/site'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  return <PostsArchivePage page={sanitizedPageNumber} locale="en" />
}

export function generateMetadata(): Metadata {
  return {
    title: `Posts | ${siteConfig.name}`,
  }
}

export async function generateStaticParams() {
  const totalPages = await getPostsPageCount()

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
