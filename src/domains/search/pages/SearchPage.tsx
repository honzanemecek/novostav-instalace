import React from 'react'
import { type TypedLocale } from 'payload'

import { CollectionArchive, type CardPostData } from '@/domains/posts'
import { Search } from '../ui/Search'
import { searchPosts } from '../queries/searchPosts'
import SearchPageClient from './SearchPageClient'

export async function SearchPage({
  query,
  locale = 'cs',
}: {
  query?: string
  locale?: TypedLocale
}) {
  const posts = await searchPosts(query, locale)

  return (
    <div className="pt-24 pb-24">
      <SearchPageClient />
      <div className="container mb-16">
        <div className="prose max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}
