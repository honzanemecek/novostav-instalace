'use client'

import { motion, useReducedMotion } from 'motion/react'
import React from 'react'

import { cn } from '@/shared/utils/ui'

type Props = {
  as?: 'li' | 'div'
  /** Pořadí řádku — určuje zpoždění ve vlně. */
  index?: number
  /** Rozestup mezi řádky v sekundách. */
  stagger?: number
  onSlab?: boolean
  bottomRule?: boolean
  className?: string
  children: React.ReactNode
}

/** Po osmi řádcích už zpoždění jen zdržuje — vlna se zastaví. */
const MAX_STAGGER_STEPS = 8

/**
 * Řádek na vlasové lince, která se při vjezdu do okna **nakreslí zleva doprava**.
 *
 * Jediný pohyb, který si tenhle návrh troufá vlastnit: web je z linek a
 * výkresů, tak se linka kreslí. `border-top` transformovat nelze, proto je
 * linka samostatný `<span>` a animuje se jeho `scaleX`.
 *
 * Jen transformace a průhlednost — nic nepřepočítává rozvržení. Při
 * `prefers-reduced-motion` se vykreslí rovnou hotový stav.
 */
export const HairlineRow: React.FC<Props> = ({
  as = 'div',
  index = 0,
  stagger = 0.06,
  onSlab = false,
  bottomRule = false,
  className,
  children,
}) => {
  const reduce = useReducedMotion()
  const Row = as === 'li' ? motion.li : motion.div
  const delay = Math.min(index, MAX_STAGGER_STEPS) * stagger
  const ruleColor = onSlab ? 'bg-slab-line' : 'bg-border'
  const viewport = { once: true, margin: '0px 0px -10% 0px' }

  return (
    <Row
      className={cn('relative', className)}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: 'easeOut', delay: delay + 0.08 }}
    >
      <motion.span
        aria-hidden
        className={cn('pointer-events-none absolute inset-x-0 top-0 h-px origin-left', ruleColor)}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewport}
        transition={reduce ? { duration: 0 } : { duration: 0.32, ease: 'easeOut', delay }}
      />
      {bottomRule && (
        <span aria-hidden className={cn('pointer-events-none absolute inset-x-0 bottom-0 h-px', ruleColor)} />
      )}
      {children}
    </Row>
  )
}
