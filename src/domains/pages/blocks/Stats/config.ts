import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: { cs: 'Čísla', en: 'Stats' },
    plural: { cs: 'Čísla', en: 'Stats' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'items',
      type: 'array',
      label: { cs: 'Údaje', en: 'Stats' },
      minRows: 1,
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'number',
              label: { cs: 'Číslo', en: 'Value' },
              required: true,
              admin: { width: '30%' },
            },
            {
              name: 'suffix',
              type: 'text',
              label: { cs: 'Přípona', en: 'Suffix' },
              admin: {
                width: '30%',
                description: { cs: 'Např. „+“ nebo „ let“.', en: 'E.g. "+" or " years".' },
              },
            },
            {
              name: 'label',
              type: 'text',
              label: { cs: 'Popisek', en: 'Label' },
              required: true,
              admin: { width: '40%' },
            },
          ],
        },
        {
          name: 'autoYearsSince',
          type: 'number',
          label: { cs: 'Dopočítat roky od', en: 'Auto years since' },
          admin: {
            description: {
              cs: 'Vyplňte rok (např. 1993) a číslo se spočítá samo — nezestárne.',
              en: 'Set a year (e.g. 1993) and the value is derived — it never goes stale.',
            },
          },
        },
      ],
    },
  ],
}
