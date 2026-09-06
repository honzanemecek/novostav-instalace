import React from 'react'

import type { ProcessBlock as Props } from '@/payload/payload-types'

import { SectionHeader } from '@/shared/components/SectionHeader'

export const ProcessBlock: React.FC<Props> = ({ eyebrow, heading, lead, steps }) => {
  if (!steps?.length) return null

  return (
    <section className="container">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.id ?? i} className="flex flex-col gap-3">
            <span
              aria-hidden
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-lg font-semibold tabular-nums"
            >
              {i + 1}
            </span>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            {step.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
