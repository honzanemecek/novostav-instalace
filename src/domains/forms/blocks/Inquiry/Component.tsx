import React from 'react'

import type { InquiryBlock as Props } from '@/payload/payload-types'

import { getServices } from '@/domains/services'
import { getCompany } from '@/domains/company'
import { InquiryWizard } from './InquiryWizard'

/**
 * Server half of the wizard: pulls the trades and the phone number, hands them
 * to the client half. The phone rides along because it must stay reachable in
 * every single step — the wizard is never the only way to reach the firm.
 */
export const InquiryBlock: React.FC<Props> = async ({ eyebrow, heading, lead, form }) => {
  if (typeof form !== 'object' || form === null) return null

  const [services, company] = await Promise.all([getServices(), getCompany()])

  return (
    <InquiryWizard
      eyebrow={eyebrow}
      heading={heading}
      lead={lead}
      formId={form.id}
      confirmationMessage={form.confirmationMessage}
      services={services.map((service) => ({ id: service.id, title: service.title }))}
      phone={company.phone}
    />
  )
}
