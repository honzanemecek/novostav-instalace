import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

export const ServicesGrid: Block = {
  slug: 'servicesGrid',
  interfaceName: 'ServicesGridBlock',
  labels: {
    singular: { cs: 'Přehled služeb', en: 'Services grid' },
    plural: { cs: 'Přehledy služeb', en: 'Services grids' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'radio',
          label: { cs: 'Rozvržení', en: 'Layout' },
          defaultValue: 'trades',
          options: [
            { label: { cs: 'Řemesla v mřížce', en: 'Trades grid' }, value: 'trades' },
            { label: { cs: 'Široké řádky', en: 'Wide rows' }, value: 'rows' },
          ],
          admin: { width: '60%' },
        },
        {
          name: 'columns',
          type: 'radio',
          label: { cs: 'Sloupce', en: 'Columns' },
          defaultValue: '3',
          options: [
            { label: '2', value: '2' },
            { label: '3', value: '3' },
          ],
          admin: {
            width: '40%',
            layout: 'horizontal',
            condition: (_, siblingData) => siblingData?.layout !== 'rows',
          },
        },
      ],
    },
    {
      name: 'source',
      type: 'radio',
      label: { cs: 'Které služby', en: 'Which services' },
      defaultValue: 'all',
      options: [
        { label: { cs: 'Všechny', en: 'All' }, value: 'all' },
        { label: { cs: 'Vybrané', en: 'Selected' }, value: 'selected' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: { cs: 'Služby', en: 'Services' },
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'selected',
      },
    },
  ],
}
