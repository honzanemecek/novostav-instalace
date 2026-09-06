import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'
import { serviceIconOptions } from '@/domains/services/config'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: {
    singular: { cs: 'Mřížka s ikonami', en: 'Feature grid' },
    plural: { cs: 'Mřížky s ikonami', en: 'Feature grids' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'columns',
      type: 'select',
      label: { cs: 'Sloupce', en: 'Columns' },
      defaultValue: '3',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: { cs: 'Položky', en: 'Items' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: { cs: 'Ikona', en: 'Icon' },
              options: serviceIconOptions,
              defaultValue: 'wrench',
              admin: { width: '40%' },
            },
            {
              name: 'title',
              type: 'text',
              label: { cs: 'Nadpis', en: 'Title' },
              required: true,
              admin: { width: '60%' },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          label: { cs: 'Popis', en: 'Description' },
        },
      ],
    },
  ],
}
