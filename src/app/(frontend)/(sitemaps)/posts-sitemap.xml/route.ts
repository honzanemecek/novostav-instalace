import { getServerSideSitemap } from 'next-sitemap'
import { getPostsSitemap } from '@/domains/posts'

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
