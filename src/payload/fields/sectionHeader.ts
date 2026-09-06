import type { Field } from 'payload'

/**
 * The eyebrow / heading / lead trio that opens most marketing sections.
 * Shared so every block renders an identical header and the client sees the
 * same three fields wherever they are.
 */
export const sectionHeaderFields = (): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'eyebrow',
        type: 'text',
        label: { cs: 'Nadtitulek', en: 'Eyebrow' },
        admin: {
          width: '40%',
          description: {
            cs: 'Krátké slovo nad nadpisem, např. „Naše služby“.',
            en: 'Short label above the heading.',
          },
        },
      },
      {
        name: 'heading',
        type: 'text',
        label: { cs: 'Nadpis', en: 'Heading' },
        admin: { width: '60%' },
      },
    ],
  },
  {
    name: 'lead',
    type: 'textarea',
    label: { cs: 'Úvodní text', en: 'Lead' },
    maxLength: 300,
    admin: {
      description: {
        cs: 'Jedna až dvě věty pod nadpisem. České texty jsou delší — držte se krátce.',
        en: 'One or two sentences under the heading.',
      },
    },
  },
]
