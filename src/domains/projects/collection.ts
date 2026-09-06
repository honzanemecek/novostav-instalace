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
import { projectLayoutBlocks } from '@/payload/blocks'
import { revalidateDelete, revalidateProject } from './hooks/revalidateProject'

/**
 * A completed job — the portfolio. Categorised by `services` rather than a
 * separate taxonomy, so "ukázky našich střech" is a query, not hand-curation.
 */
export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  labels: {
    singular: { cs: 'Realizace', en: 'Project' },
    plural: { cs: 'Realizace', en: 'Projects' },
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
    summary: true,
    coverImage: true,
    location: true,
    completedAt: true,
    services: true,
  },
  admin: {
    defaultColumns: ['title', 'location', 'completedAt', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, locale, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'projects',
          locale: locale.code,
          req,
        }),
    },
    preview: (data, { locale, req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'projects',
        locale,
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { cs: 'Název realizace', en: 'Title' },
      required: true,
      admin: {
        description: {
          cs: 'Konkrétně: „Rekonstrukce bytového jádra, Kladno“ řekne víc než „Realizace 12“.',
          en: 'Be concrete — "Bathroom renovation, Kladno" beats "Project 12".',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: { cs: 'O realizaci', en: 'Overview' },
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: { cs: 'Úvodní fotka', en: 'Cover photo' },
              admin: {
                description: {
                  cs: 'Zobrazí se na kartě v přehledu i nahoře na stránce.',
                  en: 'Used on the card and at the top of the page.',
                },
              },
            },
            {
              name: 'summary',
              type: 'textarea',
              label: { cs: 'Krátké shrnutí', en: 'Summary' },
              maxLength: 300,
              admin: {
                description: {
                  cs: 'Dvě věty na kartu do přehledu realizací.',
                  en: 'Two sentences for the project card.',
                },
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'location',
                  type: 'text',
                  label: { cs: 'Místo', en: 'Location' },
                  admin: {
                    width: '50%',
                    description: { cs: 'Např. „Kladno“.', en: 'E.g. "Kladno".' },
                  },
                },
                {
                  name: 'completedAt',
                  type: 'date',
                  label: { cs: 'Dokončeno', en: 'Completed' },
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'monthOnly', displayFormat: 'MM/yyyy' },
                  },
                },
              ],
            },
            {
              name: 'facts',
              type: 'array',
              label: { cs: 'Parametry', en: 'Key facts' },
              admin: {
                initCollapsed: true,
                description: {
                  cs: 'Dvojice název + hodnota, např. „Doba realizace / 6 týdnů“.',
                  en: 'Label + value pairs, e.g. "Duration / 6 weeks".',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: { cs: 'Název', en: 'Label' },
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
          ],
        },
        {
          label: { cs: 'Obsah', en: 'Content' },
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: false,
              blocks: projectLayoutBlocks,
              admin: {
                initCollapsed: true,
                description: {
                  cs: 'Poskládejte průběh stavby — text, galerie, porovnání před/po.',
                  en: 'Compose the story — text, galleries, before/after.',
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
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: { cs: 'Služby', en: 'Services' },
      admin: {
        position: 'sidebar',
        description: {
          cs: 'Které řemeslo tato realizace ukazuje. Podle toho se filtruje přehled.',
          en: 'Which trades this project shows. Drives filtering.',
        },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: { cs: 'Vybraná realizace', en: 'Featured' },
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: {
          cs: 'Vybrané realizace lze zobrazit na úvodní stránce.',
          en: 'Featured projects can be pulled onto the homepage.',
        },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProject],
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
