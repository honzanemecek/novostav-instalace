import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/payload/fields/linkGroup'

export const TextWithImage: Block = {
  slug: 'textWithImage',
  interfaceName: 'TextWithImageBlock',
  labels: {
    singular: { cs: 'Text s obrázkem', en: 'Text with image' },
    plural: { cs: 'Texty s obrázkem', en: 'Text with image' },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: { cs: 'Obrázek', en: 'Image' },
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'imagePosition',
          type: 'select',
          label: { cs: 'Obrázek vlevo/vpravo', en: 'Image side' },
          defaultValue: 'right',
          options: [
            { label: { cs: 'Vlevo', en: 'Left' }, value: 'left' },
            { label: { cs: 'Vpravo', en: 'Right' }, value: 'right' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      label: { cs: 'Text', en: 'Text' },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: { maxRows: 2 },
    }),
  ],
}
