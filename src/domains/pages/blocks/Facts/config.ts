import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

/**
 * An authorable FactList — label → value on hairline rows. `/o-nas` and
 * `/kontakt` both need one and no block rendered one before.
 */
export const Facts: Block = {
  slug: 'facts',
  interfaceName: 'FactsBlock',
  labels: {
    singular: { cs: 'Fakta', en: 'Facts' },
    plural: { cs: 'Fakta', en: 'Facts' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'autoFromCompany',
          type: 'checkbox',
          label: { cs: 'Doplnit z globálu Firma', en: 'Fill from the Company global' },
          defaultValue: true,
          admin: {
            width: '50%',
            description: {
              cs: 'Rok založení, let v oboru, kde pracujeme, plátce DPH — klient je mění na jednom místě.',
              en: 'Founding year, years in the trade, service area, VAT — edited in one place.',
            },
          },
        },
        {
          name: 'onSlab',
          type: 'checkbox',
          label: { cs: 'Na modré ploše', en: 'On a blue slab' },
          defaultValue: false,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: { cs: 'Vlastní řádky', en: 'Own rows' },
      admin: { initCollapsed: true },
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
  ],
}
