import type { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

import { authenticated } from '@/payload/access/authenticated'
import { authenticatedOrPublished } from '@/payload/access/authenticatedOrPublished'
import { generatePreviewPath } from '@/shared/utils/generatePreviewPath'
import { populatePublishedAt } from '@/payload/hooks/populatePublishedAt'
import { serviceIconOptions } from './icons'
import { serviceLayoutBlocks } from '@/payload/blocks'
import { revalidateDelete, revalidateService } from './hooks/revalidateService'

/**
 * A trade the firm sells (stavební práce, střechy, elektroinstalace, …).
 *
 * Doubles as the taxonomy for `projects` — a realizace is tagged with the
 * services it involved, which is what makes "ukázky prací" filterable per trade
 * without a second category collection.
 */
export const Services: CollectionConfig<'services'> = {
  slug: 'services',
  labels: {
    singular: { cs: 'Služba', en: 'Service' },
    plural: { cs: 'Služby', en: 'Services' },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    icon: true,
    shortDescription: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'order', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, locale, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'services',
          locale: locale.code,
          req,
        }),
    },
    preview: (data, { locale, req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'services',
        locale,
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { cs: 'Název', en: 'Title' },
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: { cs: 'Přehled', en: 'Overview' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: { cs: 'Ikona', en: 'Icon' },
                  options: serviceIconOptions,
                  defaultValue: 'wrench',
                  admin: { width: '50%' },
                },
                {
                  name: 'order',
                  type: 'number',
                  label: { cs: 'Pořadí', en: 'Order' },
                  defaultValue: 0,
                  admin: {
                    width: '50%',
                    description: {
                      cs: 'Nižší číslo se zobrazí dřív.',
                      en: 'Lower numbers come first.',
                    },
                  },
                },
              ],
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: { cs: 'Krátký popis', en: 'Short description' },
              maxLength: 200,
              admin: {
                description: {
                  cs: 'Jedna až dvě věty na kartu v přehledu služeb.',
                  en: 'One or two sentences for the service card.',
                },
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: { cs: 'Hlavní fotka', en: 'Cover image' },
            },
            {
              name: 'highlights',
              type: 'array',
              label: { cs: 'Co konkrétně děláme', en: 'What we do' },
              admin: {
                initCollapsed: false,
                description: {
                  cs: 'Odrážky — konkrétní práce, materiály, značky. Např. „montáž střešních oken Velux“.',
                  en: 'Bullets — concrete work, materials, brands.',
                },
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: { cs: 'Text', en: 'Text' },
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: { cs: 'Obsah stránky', en: 'Page content' },
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: false,
              blocks: serviceLayoutBlocks,
              admin: {
                initCollapsed: true,
                description: {
                  cs: 'Poskládejte stránku z bloků. Přidat blok → vybrat typ → vyplnit.',
                  en: 'Compose the page from blocks.',
                },
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateService],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
