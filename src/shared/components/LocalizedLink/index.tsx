'use client'

import NextLink from 'next/link'
import React from 'react'

import { useLocalizeHref } from '@/shared/components/LocaleProvider'

type Props = Omit<React.ComponentProps<typeof NextLink>, 'href'> & { href: string }

/**
 * `next/link` that prefixes `/en` when the tree is rendering the English route
 * subtree. Use it for every hand-written internal link — never concatenate the
 * locale prefix by hand. (CMS-authored links go through `CMSLink` instead.)
 */
export const LocalizedLink: React.FC<Props> = ({ href, ...rest }) => {
  const localize = useLocalizeHref()
  return <NextLink href={localize(href)} {...rest} />
}
