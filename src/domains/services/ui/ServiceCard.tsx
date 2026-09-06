import React from 'react'
import { ArrowRight } from 'lucide-react'

import type { Service } from '@/payload/payload-types'

import { LocalizedLink } from '@/shared/components/LocalizedLink'
import { ServiceIcon } from './ServiceIcon'

/**
 * One trade in the services grid. The whole card is the link target — a 44px
 * tap area is the minimum on the phones most of this audience uses.
 */
export const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <LocalizedLink
    className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/25"
    href={`/sluzby/${service.slug}`}
  >
    <ServiceIcon name={service.icon} className="size-7 text-muted-foreground" />
    <h3 className="text-lg font-semibold">{service.title}</h3>
    {service.shortDescription && (
      <p className="text-sm leading-relaxed text-muted-foreground">{service.shortDescription}</p>
    )}
    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium">
      Více o službě
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform group-hover:translate-x-0.5"
      />
    </span>
  </LocalizedLink>
)
