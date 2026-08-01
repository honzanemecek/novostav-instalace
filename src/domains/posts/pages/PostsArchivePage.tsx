import React from 'react'
import { type TypedLocale } from 'payload'

import { CollectionArchive } from '../ui/CollectionArchive'
import { PageRange } from '@/shared/components/PageRange'
import { Pagination } from '@/shared/components/Pagination'
import { getPostsArchive, POSTS_PER_PAGE } from '../queries/getPostsArchive'
import PostsArchivePageClient from './PostsArchivePageClient'

export async function PostsArchivePage({
  page = 1,
  locale = 'cs',
}: {
  page?: number
  locale?: TypedLocale
}) {
  const posts = await getPostsArchive(page, locale)

  return (
    <div className="pt-24 pb-24">
      <PostsArchivePageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={POSTS_PER_PAGE}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}
