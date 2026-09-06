import type { Block } from 'payload'

export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: { cs: 'Galerie', en: 'Gallery' },
    plural: { cs: 'Galerie', en: 'Galleries' },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: { cs: 'Nadpis galerie', en: 'Gallery title' },
          admin: { width: '60%' },
        },
        {
          name: 'columns',
          type: 'select',
          label: { cs: 'Sloupce', en: 'Columns' },
          defaultValue: '3',
          options: [
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ],
          admin: { width: '40%' },
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: { cs: 'Fotky', en: 'Photos' },
      minRows: 1,
      labels: {
        singular: { cs: 'Fotka', en: 'Photo' },
        plural: { cs: 'Fotky', en: 'Photos' },
      },
      admin: {
        initCollapsed: true,
        description: {
          cs: 'Fotky lze přetahovat a měnit jim pořadí. Fáze se propíše jako štítek na fotce.',
          en: 'Drag to reorder. The phase renders as a badge on the photo.',
        },
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: { cs: 'Fotka', en: 'Photo' },
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'phase',
              type: 'select',
              label: { cs: 'Fáze', en: 'Phase' },
              admin: { width: '40%' },
              options: [
                { label: { cs: 'Před', en: 'Before' }, value: 'before' },
                { label: { cs: 'V průběhu', en: 'In progress' }, value: 'during' },
                { label: { cs: 'Hotovo', en: 'Finished' }, value: 'after' },
              ],
            },
            {
              name: 'caption',
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
