import type { GlobalConfig } from 'payload'

import { link } from '@/payload/fields/link'
import { linkGroup } from '@/payload/fields/linkGroup'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: { cs: 'Hlavička', en: 'Header' },
  access: {
    read: () => true,
  },
  fields: [
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
          RowLabel: '@/domains/layout/header/RowLabel#RowLabel',
        },
      },
    },
    // The one accent action in the header. A field, not markup — the client can
    // repoint it at a different page without a deploy (rule 6). An array with
    // `maxRows: 1` rather than a group, so it may legitimately be empty.
    linkGroup({
      appearances: false,
      overrides: {
        name: 'cta',
        maxRows: 1,
        label: { cs: 'Hlavní akce', en: 'Primary action' },
        admin: {
          initCollapsed: false,
          description: {
            cs: 'Jediné modré tlačítko v hlavičce. Telefon vedle něj se bere z globálu Firma.',
            en: 'The single accent button in the header. The phone beside it comes from the Company global.',
          },
        },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
