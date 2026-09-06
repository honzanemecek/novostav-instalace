import type { Block } from 'payload'

import { sectionHeaderFields } from '@/payload/fields/sectionHeader'

/**
 * The four-step inquiry. It is a presentation layer over **one** form document:
 * the visitor answers four screens and the whole thing posts once, at the end.
 *
 * The trades in step one come from the `services` collection, not from form
 * fields, so the picker can never drift from what the firm actually offers.
 */
export const Inquiry: Block = {
  slug: 'inquiry',
  interfaceName: 'InquiryBlock',
  labels: {
    singular: { cs: 'Poptávka v krocích', en: 'Inquiry wizard' },
    plural: { cs: 'Poptávky v krocích', en: 'Inquiry wizards' },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: { cs: 'Formulář', en: 'Form' },
      admin: {
        description: {
          cs:
            'Odpovědi se uloží pod názvy sluzby, misto, termin, zprava, jmeno, telefon, email. ' +
            'Pole s těmito názvy ve formuláři založte — povinná pole s jiným názvem odeslání zablokují.',
          en:
            'Answers are stored under sluzby, misto, termin, zprava, jmeno, telefon, email. ' +
            'Create fields with those names — a required field with another name will block submission.',
        },
      },
    },
  ],
}
