import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: { cs: 'Časté dotazy', en: 'FAQ' },
    plural: { cs: 'Časté dotazy', en: 'FAQs' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'items',
      type: 'array',
      label: { cs: 'Dotazy', en: 'Questions' },
      minRows: 1,
      admin: {
        initCollapsed: true,
        description: {
          cs: 'Pište skutečné dotazy zákazníků — cena, termín, záruka.',
          en: 'Use real customer questions — price, timeline, warranty.',
        },
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          label: { cs: 'Otázka', en: 'Question' },
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          label: { cs: 'Odpověď', en: 'Answer' },
          required: true,
        },
      ],
    },
  ],
}
