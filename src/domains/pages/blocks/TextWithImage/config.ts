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
      type: 'row',
      fields: [
        {
          name: 'fullBleed',
          type: 'checkbox',
          label: { cs: 'Přes celou šířku', en: 'Full bleed' },
          defaultValue: true,
          admin: {
            width: '50%',
            description: {
              cs: 'Fotografie a textový panel vedle sebe od kraje ke kraji, dělené vlasovou linkou.',
              en: 'Photo and text panel edge to edge, split by a hairline.',
            },
          },
        },
        {
          name: 'duotone',
          type: 'checkbox',
          label: { cs: 'Duotón', en: 'Duotone' },
          defaultValue: false,
          admin: {
            width: '50%',
            description: {
              cs: 'Fotografie tištěná do modři. Jen jako akcentní moment.',
              en: 'The photo printed into the brand blue. An accent moment only.',
            },
          },
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
