import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/payload/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: { cs: 'Nadtitulek', en: 'Eyebrow' },
      admin: {
        condition: (_, { type } = {}) => type !== 'none',
        description: {
          cs: 'Krátké slovo nad nadpisem, např. „Stavby a instalace od roku 1993“.',
          en: 'Short label above the heading.',
        },
      },
    },
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
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'facts',
      type: 'array',
      label: { cs: 'Fakta vpravo', en: 'Facts rail' },
      maxRows: 5,
      admin: {
        initCollapsed: true,
        condition: (_, { type } = {}) => type !== 'none',
        description: {
          cs: 'Sloupec faktů vedle nadpisu — kde pracujeme, kancelář, kdy voláte. Neopakujte čísla, která už nese blok „Čísla“.',
          en: 'The facts rail beside the heading. Do not repeat numbers the stats block already carries.',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: { cs: 'Štítek', en: 'Label' },
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'value',
              type: 'text',
              label: { cs: 'Hodnota', en: 'Value' },
              required: true,
              admin: { width: '60%' },
            },
          ],
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      // Not required: lowImpact heroes have no photograph, and a required
      // column would block saving them.
    },
  ],
  label: false,
}
