import type { GlobalConfig } from 'payload'

import { revalidateCompany } from './hooks/revalidateCompany'

/**
 * Every fact about the business, editable by the client.
 *
 * Nothing here may be hardcoded in markup — the header, footer, contact page,
 * ContactBlock and the LocalBusiness structured data all read from this global.
 * Site *identity* (name, domain, OG image) stays in shared/config/site.ts; this
 * is the *business* behind it.
 */
export const Company: GlobalConfig = {
  slug: 'company',
  label: { cs: 'Údaje o firmě', en: 'Company details' },
  access: {
    read: () => true,
  },
  admin: {
    group: { cs: 'Nastavení', en: 'Settings' },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { cs: 'Kontakt', en: 'Contact' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  label: { cs: 'Telefon', en: 'Phone' },
                  required: true,
                  defaultValue: '+420 602 323 095',
                  admin: {
                    width: '50%',
                    description: {
                      cs: 'Zobrazí se v hlavičce, patičce a u každé výzvy k akci.',
                      en: 'Shown in the header, footer and every call to action.',
                    },
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  label: { cs: 'E-mail', en: 'E-mail' },
                  required: true,
                  defaultValue: 'info@novostav-instalace.cz',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'availabilityNote',
              type: 'text',
              label: { cs: 'Poznámka k dostupnosti', en: 'Availability note' },
              defaultValue: 'Nemáme pevnou pracovní dobu, jsme tu pro vás stále.',
              admin: {
                description: {
                  cs: 'Krátká věta vedle telefonu. Silný argument — nechte ji pravdivou.',
                  en: 'One line next to the phone number. Keep it true.',
                },
              },
            },
            {
              name: 'social',
              type: 'array',
              label: { cs: 'Sociální sítě', en: 'Social profiles' },
              admin: {
                initCollapsed: true,
                description: {
                  cs: 'Nechte prázdné, dokud profil skutečně neexistuje.',
                  en: 'Leave empty until a profile actually exists.',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      label: { cs: 'Síť', en: 'Platform' },
                      required: true,
                      admin: { width: '40%' },
                      options: [
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'LinkedIn', value: 'linkedin' },
                      ],
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: { cs: 'Odkaz', en: 'URL' },
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
          label: { cs: 'Adresy', en: 'Addresses' },
          fields: [
            {
              name: 'office',
              type: 'group',
              label: { cs: 'Kancelář', en: 'Office' },
              admin: {
                description: {
                  cs: 'Kam za vámi zákazník skutečně přijede. Tato adresa jde na kontakt a do mapy.',
                  en: 'Where customers actually come. This address drives the contact page and map.',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'street',
                      type: 'text',
                      label: { cs: 'Ulice a číslo', en: 'Street' },
                      defaultValue: 'Švýcarská 2432',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'city',
                      type: 'text',
                      label: { cs: 'Město', en: 'City' },
                      defaultValue: 'Kladno 1-Kročehlavy',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'zip',
                      type: 'text',
                      label: { cs: 'PSČ', en: 'ZIP' },
                      defaultValue: '272 01',
                      admin: { width: '20%' },
                    },
                  ],
                },
                {
                  name: 'mapUrl',
                  type: 'text',
                  label: { cs: 'Odkaz na mapu', en: 'Map link' },
                  admin: {
                    description: {
                      cs: 'Odkaz na Google/Mapy.cz — otevře se v novém okně.',
                      en: 'Google/Mapy.cz link — opens in a new tab.',
                    },
                  },
                },
                {
                  name: 'note',
                  type: 'text',
                  label: { cs: 'Poznámka', en: 'Note' },
                  admin: {
                    description: {
                      cs: 'Např. „Vzorky podlah Parador jsou vystaveny v kanceláři.“',
                      en: 'E.g. "Parador floor samples are on display in the office."',
                    },
                  },
                },
              ],
            },
            {
              name: 'registeredSeat',
              type: 'group',
              label: { cs: 'Sídlo firmy', en: 'Registered seat' },
              admin: {
                description: {
                  cs: 'Fakturační sídlo. Patří do patičky k IČO, ne na kontaktní stránku.',
                  en: 'The legal seat. Belongs in the footer next to the IČO, not on the contact page.',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'street',
                      type: 'text',
                      label: { cs: 'Ulice a číslo', en: 'Street' },
                      defaultValue: 'Svárovská 213',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'city',
                      type: 'text',
                      label: { cs: 'Město', en: 'City' },
                      defaultValue: 'Červený Újezd',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'zip',
                      type: 'text',
                      label: { cs: 'PSČ', en: 'ZIP' },
                      defaultValue: '273 51',
                      admin: { width: '20%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'serviceArea',
              type: 'text',
              label: { cs: 'Oblast působnosti', en: 'Service area' },
              defaultValue: 'Praha a Středočeský kraj',
            },
          ],
        },
        {
          label: { cs: 'Firemní údaje', en: 'Legal' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'legalName',
                  type: 'text',
                  label: { cs: 'Jméno podnikatele', en: 'Legal name' },
                  defaultValue: 'Václav Novotný',
                  admin: { width: '50%' },
                },
                {
                  name: 'foundedYear',
                  type: 'number',
                  label: { cs: 'Rok založení', en: 'Founded' },
                  defaultValue: 1993,
                  admin: {
                    width: '50%',
                    description: {
                      cs: 'Roky v oboru se dopočítají samy — nikde je nepiště ručně.',
                      en: 'Years in business are derived from this — never hardcode them.',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ico',
                  type: 'text',
                  label: { cs: 'IČO', en: 'IČO' },
                  admin: { width: '50%' },
                },
                {
                  name: 'dic',
                  type: 'text',
                  label: { cs: 'DIČ', en: 'DIČ' },
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'vatPayer',
              type: 'checkbox',
              label: { cs: 'Plátce DPH', en: 'VAT registered' },
              defaultValue: true,
            },
            {
              name: 'certifications',
              type: 'array',
              label: { cs: 'Oprávnění a certifikace', en: 'Certifications' },
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: { cs: 'Název', en: 'Title' },
                  required: true,
                },
                {
                  name: 'issuedBy',
                  type: 'text',
                  label: { cs: 'Vydal', en: 'Issued by' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCompany],
  },
}
