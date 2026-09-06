'use client'
import { Button, type ButtonProps } from '@/shared/ui/button'
import { useLocalizeHref } from '@/shared/components/LocaleProvider'
import { cn } from '@/shared/utils/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post, Project, Service } from '@/payload/payload-types'

import { cmsLinkHref, collectionPrefixes } from './href'

export { cmsLinkHref, collectionPrefixes } from './href'
export type { CMSLinkTarget } from './href'

/**
 * The CMS stores `appearance` as 'default' | 'outline' (see payload/fields/link.ts)
 * and the nav asks for 'link'. Those names predate the design-system rename, so they
 * are translated to button variants here — the Postgres enum stays untouched.
 */
const variantForAppearance: Record<string, ButtonProps['variant']> = {
  default: 'ink',
  link: 'quiet',
}

export type CMSLinkType = {
  appearance?: 'inline' | 'default' | 'link' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: keyof typeof collectionPrefixes
    value: Page | Post | Project | Service | string | number
  } | null
  size?: ButtonProps['size'] | null
  /** Tabular figures — for `tel:` links. */
  phone?: boolean
  /** Full width (mobile CTAs, the mobile menu). */
  full?: boolean
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    phone,
    full,
    url,
  } = props

  const localize = useLocalizeHref()

  // `localize` is identity for anything that is not a root-relative path, so
  // `tel:`, `mailto:` and absolute URLs pass through untouched. Custom URLs used
  // to skip it entirely, which pointed the whole /en navigation back into the
  // Czech routes.
  const href = localize(cmsLinkHref({ type, reference, url }) ?? '') || null

  if (!href) {
    // Unpopulated reference: render the bare content instead of silently
    // dropping it (e.g. linked text inside rich text).
    return (
      <>
        {label && label}
        {children && children}
      </>
    )
  }

  // `quiet` carries its own padding — a sized button would fight it.
  const variant = (appearance && variantForAppearance[appearance]) ?? (appearance as ButtonProps['variant'])
  const size = variant === 'quiet' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={variant} phone={phone} full={full}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
