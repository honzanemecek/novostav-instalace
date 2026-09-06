import type { Block } from 'payload'

export const BeforeAfter: Block = {
  slug: 'beforeAfter',
  interfaceName: 'BeforeAfterBlock',
  labels: {
    singular: { cs: 'Před / po', en: 'Before / after' },
    plural: { cs: 'Před / po', en: 'Before / after' },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'before',
          type: 'upload',
          relationTo: 'media',
          label: { cs: 'Fotka „před“', en: 'Before photo' },
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'after',
          type: 'upload',
          relationTo: 'media',
          label: { cs: 'Fotka „po“', en: 'After photo' },
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'caption',
      type: 'text',
      label: { cs: 'Popisek', en: 'Caption' },
      admin: {
        description: {
          cs: 'Obě fotky musí být ze stejného místa a úhlu, jinak posuvník nedává smysl.',
          en: 'Both photos must share a viewpoint or the slider makes no sense.',
        },
      },
    },
  ],
}
