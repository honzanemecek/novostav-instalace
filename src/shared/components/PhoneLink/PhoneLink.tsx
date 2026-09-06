import React from 'react'

import { telHref } from '@/shared/utils/tel'
import { cn } from '@/shared/utils/ui'

type Size = 'inline' | 'sm' | 'md' | 'lg'
type Tone = 'accent' | 'footer' | 'inherit'

const sizes: Record<Size, string> = {
  inline: 'text-[15px] font-medium',
  sm: 'text-[22px] font-medium tracking-[-0.01em]',
  md: 'text-2xl font-medium tracking-[-0.015em] md:text-[30px]',
  lg: 'text-[30px] font-medium tracking-[-0.02em] md:text-[44px]',
}

const tones: Record<Tone, string> = {
  accent: 'text-accent hover:text-accent-hover',
  // Jediný barevný prvek v patičce.
  footer: 'text-[oklch(0.735_0.105_228)] hover:text-[oklch(0.795_0.095_228)]',
  inherit: 'text-inherit',
}

type Props = {
  /** Číslo z globálu `company` — nikdy konstanta v markupu. */
  phone?: string | null
  size?: Size
  tone?: Tone
  className?: string
  /** Vlastní popisek místo samotného čísla. */
  children?: React.ReactNode
}

/**
 * Telefonní číslo je konverze — pravidlo systému č. 4. Vždy `tel:`, vždy
 * tabulární číslice, vždy bez podtržení a **nikdy animované** (pravidlo motion:
 * na číslech se nehýbe nic).
 *
 * Existuje v pěti velikostech napříč webem; centralizace je nejlevnější způsob,
 * jak zaručit pravidlo, na kterém stojí celý provoz firmy.
 */
export const PhoneLink: React.FC<Props> = ({
  phone,
  size = 'inline',
  tone = 'accent',
  className,
  children,
}) => {
  if (!phone) return null

  return (
    <a
      href={telHref(phone)}
      className={cn(
        'tabular inline-block whitespace-nowrap no-underline transition-colors duration-150',
        sizes[size],
        tones[tone],
        className,
      )}
    >
      {children ?? phone}
    </a>
  )
}
