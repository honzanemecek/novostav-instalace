import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/payload/fields/linkGroup'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'variant',
      type: 'radio',
      label: { cs: 'Podklad', en: 'Ground' },
      defaultValue: 'plain',
      options: [
        { label: { cs: 'Bílý, na střed', en: 'Plain, centred' }, value: 'plain' },
        { label: { cs: 'Modrá plocha', en: 'Blue slab' }, value: 'slab' },
      ],
      admin: {
        layout: 'horizontal',
        description: {
          cs: 'Na stránce mají být nejvýš dvě modré plochy.',
          en: 'At most two blue slabs per page.',
        },
      },
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
