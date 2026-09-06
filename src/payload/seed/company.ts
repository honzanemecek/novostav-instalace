import type { Company } from '@/payload/payload-types'

/**
 * Business details as verified in docs/PROJECT.md.
 *
 * `ico` and `dic` are deliberately left empty — they could not be found in
 * ARES and must come from the client. Do not invent them; they are a legal
 * requirement in the footer and a wrong number is worse than a missing one.
 */
export const company: Partial<Company> = {
  phone: '+420 602 323 095',
  email: 'info@novostav-instalace.cz',
  availabilityNote: 'Nemáme pevnou pracovní dobu, jsme tu pro vás stále.',
  office: {
    street: 'Švýcarská 2432',
    city: 'Kladno 1-Kročehlavy',
    zip: '272 01',
    note: 'Vzory podlah Parador jsou vystavené u nás v kanceláři.',
  },
  registeredSeat: {
    street: 'Svárovská 213',
    city: 'Červený Újezd',
    zip: '273 51',
  },
  serviceArea: 'Praha a Středočeský kraj',
  legalName: 'Václav Novotný',
  foundedYear: 1993,
  vatPayer: true,
}
