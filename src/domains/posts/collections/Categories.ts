import type { CollectionConfig } from 'payload'

import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: { cs: 'Kategorie', en: 'Category' },
    plural: { cs: 'Kategorie', en: 'Categories' },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
