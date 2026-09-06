import { getServerSideSitemap } from 'next-sitemap'
import { getServicesSitemap } from '@/domains/services'

export async function GET() {
  const sitemap = await getServicesSitemap()

  return getServerSideSitemap(sitemap)
}
