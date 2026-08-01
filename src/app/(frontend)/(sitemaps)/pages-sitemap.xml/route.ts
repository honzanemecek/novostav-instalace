import { getServerSideSitemap } from 'next-sitemap'
import { getPagesSitemap } from '@/domains/pages'

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
