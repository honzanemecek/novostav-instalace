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
      type: 'row',
      fields: [
        {
          name: 'anchor',
          type: 'text',
          label: { cs: 'Kotva', en: 'Anchor' },
          admin: {
            width: '60%',
            description: {
              cs: 'Id sekce pro odkaz v menu, např. „caste-dotazy“ → /o-nas#caste-dotazy.',
              en: 'Section id for a menu anchor, e.g. "caste-dotazy".',
            },
          },
        },
        {
          name: 'defaultOpenFirst',
          type: 'checkbox',
          label: { cs: 'První dotaz otevřený', en: 'First question open' },
          defaultValue: true,
          admin: { width: '40%' },
        },
      ],
    },
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
