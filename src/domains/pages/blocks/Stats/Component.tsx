'use client'

import React from 'react'
import { useInView } from 'motion/react'

import type { StatsBlock as Props } from '@/payload/payload-types'

import { AnimatedNumber } from '@/shared/ui/motion/animated-number'
import { SectionHeader } from '@/shared/components/SectionHeader'

/**
 * Counts up once, the first time it scrolls into view. Starting the spring at 0
 * and only setting the real value on entry is what makes the count read as a
 * count rather than a number that was always there.
 */
const Stat: React.FC<{
  value: number
  suffix?: string | null
  label: string
}> = ({ value, suffix, label }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      <dd className="text-4xl md:text-5xl font-semibold tracking-tight">
        <AnimatedNumber
          value={inView ? value : 0}
          springOptions={{ bounce: 0, duration: 1400 }}
        />
        {suffix}
      </dd>
      <dt className="text-muted-foreground">{label}</dt>
    </div>
  )
}

export const StatsBlock: React.FC<Props> = ({ eyebrow, heading, lead, items }) => {
  if (!items?.length) return null

  const currentYear = new Date().getFullYear()

  return (
    <section className="container">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />
      <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Stat
            key={item.id ?? i}
            value={item.autoYearsSince ? currentYear - item.autoYearsSince : (item.value ?? 0)}
            suffix={item.suffix}
            label={item.label}
          />
        ))}
      </dl>
    </section>
  )
}
