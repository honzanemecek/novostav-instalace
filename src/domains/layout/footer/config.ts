import type { GlobalConfig } from 'payload'

import { link } from '@/payload/fields/link'
import { linkGroup } from '@/payload/fields/linkGroup'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: { cs: 'Patička', en: 'Footer' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'tagline',
      type: 'textarea',
      label: { cs: 'Věta pod značkou', en: 'Line under the brand' },
      admin: {
        description: {
          cs: 'Jedna věta o firmě. Fakta (telefon, adresa, IČO) se berou z globálu Firma — nepiš je sem.',
          en: 'One sentence about the firm. Facts come from the Company global — do not repeat them here.',
        },
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/domains/layout/footer/RowLabel#RowLabel',
        },
      },
      label: { cs: 'Sloupec Firma', en: 'Company column' },
    },
    // Právní řádek vpravo — ochrana osobních údajů a spol.
    linkGroup({
      appearances: false,
      overrides: {
        name: 'legalLinks',
        maxRows: 2,
        label: { cs: 'Odkazy v právním řádku', en: 'Legal line links' },
        admin: { initCollapsed: true },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
