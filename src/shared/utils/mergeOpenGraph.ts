import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { siteConfig } from '@/shared/config/site'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: siteConfig.description.cs,
  images: [
    {
      url: `${getServerSideURL()}${siteConfig.ogImage}`,
    },
  ],
  siteName: siteConfig.name,
  title: siteConfig.name,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
