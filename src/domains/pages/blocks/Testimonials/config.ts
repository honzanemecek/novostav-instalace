import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: { cs: 'Reference zákazníků', en: 'Testimonials' },
    plural: { cs: 'Reference zákazníků', en: 'Testimonials' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'items',
      type: 'array',
      label: { cs: 'Reference', en: 'Testimonials' },
      minRows: 1,
      admin: {
        initCollapsed: true,
        description: {
          cs: 'Jen skutečné citace od skutečných zákazníků. Vymyšlená reference je horší než žádná.',
          en: 'Real quotes from real customers only.',
        },
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: { cs: 'Citace', en: 'Quote' },
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'author',
              type: 'text',
              label: { cs: 'Jméno', en: 'Author' },
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'context',
              type: 'text',
              label: { cs: 'Upřesnění', en: 'Context' },
              admin: {
                width: '50%',
                description: {
                  cs: 'Např. „rekonstrukce bytu, Kladno 2024“.',
                  en: 'E.g. "flat renovation, Kladno 2024".',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
