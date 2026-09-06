import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

export const Brands: Block = {
  slug: 'brands',
  interfaceName: 'BrandsBlock',
  labels: {
    singular: { cs: 'Značky a dodavatelé', en: 'Brands' },
    plural: { cs: 'Značky a dodavatelé', en: 'Brands' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'items',
      type: 'array',
      label: { cs: 'Značky', en: 'Brands' },
      minRows: 1,
      admin: {
        initCollapsed: true,
        description: {
          cs: 'Logo je lepší než text. Bez loga se vypíše jen název.',
          en: 'A logo beats text. Without one the name is rendered.',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: { cs: 'Název', en: 'Name' },
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: { cs: 'Logo', en: 'Logo' },
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
