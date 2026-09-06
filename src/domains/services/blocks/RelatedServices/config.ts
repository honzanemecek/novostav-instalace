import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

/**
 * „Často navazuje“ / „Kombinace řemesel“ — the cross-sell that makes the
 * one-contractor argument concrete. The trades come from the collection, so the
 * list can never name a service the firm no longer offers.
 */
export const RelatedServices: Block = {
  slug: 'relatedServices',
  interfaceName: 'RelatedServicesBlock',
  labels: {
    singular: { cs: 'Navazující řemesla', en: 'Related trades' },
    plural: { cs: 'Navazující řemesla', en: 'Related trades' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'variant',
      type: 'radio',
      label: { cs: 'Podklad', en: 'Ground' },
      defaultValue: 'plain',
      options: [
        { label: { cs: 'Bílý podklad', en: 'Plain' }, value: 'plain' },
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
    {
      name: 'items',
      type: 'array',
      label: { cs: 'Řemesla', en: 'Trades' },
      minRows: 1,
      maxRows: 6,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          label: { cs: 'Služba', en: 'Service' },
          required: true,
        },
        {
          name: 'note',
          type: 'textarea',
          label: { cs: 'Proč navazuje', en: 'Why it follows' },
          maxLength: 200,
          admin: {
            description: {
              cs: 'Jedna věta. Bez ní se použije krátký popis služby.',
              en: 'One sentence. Falls back to the service short description.',
            },
          },
        },
      ],
    },
  ],
}
