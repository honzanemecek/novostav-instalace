import { searchPlugin } from '@payloadcms/plugin-search'

import { beforeSyncWithSearch } from './beforeSync'
import { searchFields } from './fieldOverrides'

export const searchPluginConfig = searchPlugin({
  collections: ['posts'],
  beforeSync: beforeSyncWithSearch,
  searchOverrides: {
    labels: {
      singular: { cs: 'Výsledek vyhledávání', en: 'Search Result' },
      plural: { cs: 'Výsledky vyhledávání', en: 'Search Results' },
    },
    fields: ({ defaultFields }) => {
      return [...defaultFields, ...searchFields]
    },
  },
})
