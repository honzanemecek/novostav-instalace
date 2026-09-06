import { getServerSideSitemap } from 'next-sitemap'
import { getProjectsSitemap } from '@/domains/projects'

export async function GET() {
  const sitemap = await getProjectsSitemap()

  return getServerSideSitemap(sitemap)
}
