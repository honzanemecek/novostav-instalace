'use client'
import { Button, type ButtonProps } from '@/shared/ui/button'
import { useLocalizeHref } from '@/shared/components/LocaleProvider'
import { cn } from '@/shared/utils/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post, Project, Service } from '@/payload/payload-types'

/**
 * Route prefix per linkable collection. Keep in sync with the folders under
 * src/app/(frontend) — a missing entry silently produces a 404 link.
 */
const collectionPrefixes = {
  pages: '',
  services: '/sluzby',
  projects: '/realizace',
  posts: '/posts',
} as const

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
    url,
  } = props

  const localize = useLocalizeHref()

  const internalHref =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${collectionPrefixes[reference.relationTo] ?? ''}/${reference.value.slug}`
      : null

  const href = internalHref ? localize(internalHref) : url

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
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={variant}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
