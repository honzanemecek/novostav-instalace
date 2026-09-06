import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

export const ContactDetails: Block = {
  slug: 'contactDetails',
  interfaceName: 'ContactDetailsBlock',
  labels: {
    singular: { cs: 'Kontaktní údaje', en: 'Contact details' },
    plural: { cs: 'Kontaktní údaje', en: 'Contact details' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      type: 'collapsible',
      label: { cs: 'Co zobrazit', en: 'What to show' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'showPhone',
              type: 'checkbox',
              label: { cs: 'Telefon', en: 'Phone' },
              defaultValue: true,
              admin: { width: '25%' },
            },
            {
              name: 'showEmail',
              type: 'checkbox',
              label: { cs: 'E-mail', en: 'E-mail' },
              defaultValue: true,
              admin: { width: '25%' },
            },
            {
              name: 'showAddress',
              type: 'checkbox',
              label: { cs: 'Adresa kanceláře', en: 'Office address' },
              defaultValue: true,
              admin: { width: '25%' },
            },
            {
              name: 'showServiceArea',
              type: 'checkbox',
              label: { cs: 'Oblast působnosti', en: 'Service area' },
              defaultValue: true,
              admin: { width: '25%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showBigPhone',
              type: 'checkbox',
              label: { cs: 'Telefon velkým písmem', en: 'Phone, large' },
              defaultValue: true,
              admin: {
                width: '50%',
                description: {
                  cs: 'Telefon jako největší prvek stránky. Na kontaktu ho nechte zapnutý.',
                  en: 'The phone as the largest element on the page.',
                },
              },
            },
            {
              name: 'showMap',
              type: 'checkbox',
              label: { cs: 'Schéma s kanceláří', en: 'Office schematic' },
              defaultValue: false,
              admin: {
                width: '50%',
                description: {
                  cs: 'Kreslené schéma, ne mapa třetí strany — žádné sledování a žádný klíč k API.',
                  en: 'A drawn schematic, not a third-party map — no tracking, no API key.',
                },
              },
            },
          ],
        },
      ],
      admin: {
        description: {
          cs: 'Údaje se berou z „Údaje o firmě“ — mění se na jednom místě pro celý web.',
          en: 'Values come from "Company details" — change them once for the whole site.',
        },
      },
    },
  ],
}
