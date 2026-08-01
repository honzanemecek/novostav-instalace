import { draftMode } from 'next/headers'
import React from 'react'
import { type RequiredDataFromCollectionSlug, type TypedLocale } from 'payload'

import { homeStatic } from '@/payload/seed/home-static'
import { PayloadRedirects } from '@/shared/components/PayloadRedirects'
import { LivePreviewListener } from '@/shared/components/LivePreviewListener'
import { localizeHref } from '@/shared/utils/locale'
import { RenderBlocks } from '../blocks/RenderBlocks'
import { RenderHero } from '../heros/RenderHero'
import { getPageBySlug } from '../queries/getPageBySlug'
import DynamicPageClient from './DynamicPageClient'

export async function DynamicPage({
  slug,
  locale = 'cs',
}: {
  slug: string
  locale?: TypedLocale
}) {
  const { isEnabled: draft } = await draftMode()
  const url = localizeHref('/' + slug, locale)
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await getPageBySlug(slug, locale)

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <DynamicPageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}
