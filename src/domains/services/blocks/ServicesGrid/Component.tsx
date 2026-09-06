import React from 'react'

import type { ServicesGridBlock as Props } from '@/payload/payload-types'

import { SectionHeader } from '@/shared/components/SectionHeader'
import { getServices } from '../../queries/getServices'
import { ServiceCard } from '../../ui/ServiceCard'

export const ServicesGridBlock: React.FC<Props> = async ({
  eyebrow,
  heading,
  lead,
  source,
  services: selected,
}) => {
  const all = await getServices()

  const services =
    source === 'selected' && selected?.length
      ? // keep the editor's chosen order, not the collection's
        selected
          .map((item) => {
            const id = typeof item === 'object' ? item.id : item
            return all.find((service) => service.id === id)
          })
          .filter((service) => service !== undefined)
      : all

  if (!services.length) return null

  return (
    <section className="container py-14 md:py-[104px]">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id}>
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>
    </section>
  )
}
