import type { CollectionConfig } from 'payload'

import { authenticated } from '@/payload/access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { cs: 'Uživatel', en: 'User' },
    plural: { cs: 'Uživatelé', en: 'Users' },
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
