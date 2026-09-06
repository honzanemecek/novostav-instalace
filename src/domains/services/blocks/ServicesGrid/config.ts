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
