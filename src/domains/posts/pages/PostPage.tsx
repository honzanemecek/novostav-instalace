import { draftMode } from 'next/headers'
import React from 'react'
import { type TypedLocale } from 'payload'

import RichText from '@/shared/components/RichText'
import { PayloadRedirects } from '@/shared/components/PayloadRedirects'
import { LivePreviewListener } from '@/shared/components/LivePreviewListener'
import { localizeHref } from '@/shared/utils/locale'
import { RelatedPosts } from '../blocks/RelatedPosts/Component'
import { PostHero } from '../ui/PostHero'
import { getPostBySlug } from '../queries/getPostBySlug'
import PostPageClient from './PostPageClient'

export async function PostPage({
  slug,
  locale = 'cs',
}: {
  slug: string
  locale?: TypedLocale
}) {
  const { isEnabled: draft } = await draftMode()
  const url = localizeHref('/posts/' + slug, locale)
  const post = await getPostBySlug(slug, locale)

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PostPageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}
