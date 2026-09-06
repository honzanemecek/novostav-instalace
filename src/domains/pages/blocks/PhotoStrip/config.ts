import type { Block } from 'payload'

/**
 * The full-bleed row of photographs that separates two sections. Renders bare —
 * outside `.container` — so it bleeds to the window edges, with the hairline as
 * the gap between frames.
 */
export const PhotoStrip: Block = {
  slug: 'photoStrip',
  interfaceName: 'PhotoStripBlock',
  labels: {
    singular: { cs: 'Pás fotografií', en: 'Photo strip' },
    plural: { cs: 'Pásy fotografií', en: 'Photo strips' },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          label: { cs: 'Odkud fotografie', en: 'Where from' },
          defaultValue: 'latest',
          options: [
            { label: { cs: 'Poslední realizace', en: 'Latest projects' }, value: 'latest' },
            { label: { cs: 'Vybrané realizace', en: 'Featured projects' }, value: 'featured' },
            { label: { cs: 'Realizace jedné služby', en: 'Projects of one service' }, value: 'service' },
            { label: { cs: 'Ručně', en: 'Manual' }, value: 'manual' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'limit',
          type: 'select',
          label: { cs: 'Kolik', en: 'How many' },
          defaultValue: '3',
          options: [
            { label: '2', value: '2' },
            { label: '3', value: '3' },
          ],
          admin: {
            width: '25%',
            condition: (_, siblingData) => siblingData?.source !== 'manual',
          },
        },
        {
          name: 'plain',
          type: 'checkbox',
          label: { cs: 'Bez duotónu', en: 'No duotone' },
          defaultValue: true,
          admin: {
            width: '25%',
            description: {
              cs: 'Duotón patří jen na modrou plochu.',
              en: 'Duotone belongs on a blue slab only.',
            },
          },
        },
      ],
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: { cs: 'Služba', en: 'Service' },
      admin: { condition: (_, siblingData) => siblingData?.source === 'service' },
    },
    {
      name: 'items',
      type: 'array',
      label: { cs: 'Fotografie', en: 'Photos' },
      minRows: 2,
      maxRows: 3,
      admin: {
        initCollapsed: true,
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: { cs: 'Fotografie', en: 'Photo' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              label: { cs: 'Nadtitulek', en: 'Eyebrow' },
              admin: { width: '40%' },
            },
            {
              name: 'title',
              type: 'text',
              label: { cs: 'Popisek', en: 'Caption' },
              admin: { width: '60%' },
            },
          ],
        },
      ],
    },
  ],
}
