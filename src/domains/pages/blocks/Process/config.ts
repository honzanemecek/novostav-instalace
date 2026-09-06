import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

export const Process: Block = {
  slug: 'process',
  interfaceName: 'ProcessBlock',
  labels: {
    singular: { cs: 'Jak to probíhá', en: 'Process' },
    plural: { cs: 'Jak to probíhá', en: 'Processes' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'steps',
      type: 'array',
      label: { cs: 'Kroky', en: 'Steps' },
      minRows: 2,
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description: {
          cs: 'Čísla se doplní sama podle pořadí. Např. poptávka → návrh → realizace → servis.',
          en: 'Numbers are generated from the order.',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: { cs: 'Nadpis kroku', en: 'Step title' },
          required: true,
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
