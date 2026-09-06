import React from 'react'

import type { FactsBlock as Props } from '@/payload/payload-types'

import { getCompany, yearsInBusiness } from '@/domains/company'
import { FactList } from '@/shared/components/FactList/FactList'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { Slab } from '@/shared/components/Slab/Slab'

export const FactsBlock: React.FC<Props> = async ({
  eyebrow,
  heading,
  lead,
  autoFromCompany,
  onSlab,
  items,
}) => {
  const company = autoFromCompany !== false ? await getCompany() : null
  const years = yearsInBusiness(company?.foundedYear)

  /*
   * Fakta z globálu Firma jdou první — klient je mění na jednom místě a
   * nemusí je opisovat do každé stránky. Nic se tu nevymýšlí: chybějící údaj
   * prostě nevznikne jako řádek.
   */
  const automatic = company
    ? [
        company.foundedYear ? { label: 'V oboru od', value: String(company.foundedYear) } : null,
        years ? { label: 'Let praxe', value: <span className="tabular">{years}</span> } : null,
        company.serviceArea ? { label: 'Kde pracujeme', value: company.serviceArea } : null,
        company.legalName ? { label: 'Firma', value: company.legalName } : null,
        company.vatPayer ? { label: 'DPH', value: 'Plátce DPH' } : null,
      ].filter((fact) => fact !== null)
    : []

  const facts = [...automatic, ...(items ?? []).map(({ label, value }) => ({ label, value }))]

  if (!facts.length) return null

  const body = (
    <>
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} align="split" onSlab={onSlab === true} />
      <FactList className="mt-10 max-w-3xl" items={facts} onSlab={onSlab === true} />
    </>
  )

  if (onSlab) return <Slab pad="md">{body}</Slab>

  return <section className="container py-14 md:py-[104px]">{body}</section>
}
