import type { Block } from 'payload'

import { linkGroup } from '@/payload/fields/linkGroup'
import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

export const ProjectShowcase: Block = {
  slug: 'projectShowcase',
  interfaceName: 'ProjectShowcaseBlock',
  labels: {
    singular: { cs: 'Ukázky realizací', en: 'Project showcase' },
    plural: { cs: 'Ukázky realizací', en: 'Project showcases' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          label: { cs: 'Které realizace', en: 'Which projects' },
          defaultValue: 'featured',
          options: [
            { label: { cs: 'Vybrané', en: 'Featured' }, value: 'featured' },
            { label: { cs: 'Nejnovější', en: 'Latest' }, value: 'latest' },
            { label: { cs: 'Podle služby', en: 'By service' }, value: 'service' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'limit',
          type: 'number',
          label: { cs: 'Kolik zobrazit', en: 'How many' },
          defaultValue: 3,
          min: 1,
          max: 12,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: { cs: 'Služba', en: 'Service' },
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'service',
      },
    },
    linkGroup({
      appearances: ['outline'],
      overrides: { maxRows: 1, label: { cs: 'Odkaz na všechny', en: 'Link to all' } },
    }),
  ],
}
