import { cn } from '@/shared/utils/ui'
import React from 'react'

/**
 * Logo Novostav-Instalace: domeček jedním tahem s ukrytým N.
 *
 * Konstrukce (viewBox 24×32, stroke 2, round joins/caps):
 *   čtverec  TL(4,11.5) TR(20,11.5) BR(20,27.5) BL(4,27.5), vrchol A(12,4.5)
 *   neutrální tahy: dno BL–BR, vršek TL–TR, diagonála BL–TR, obě strany střechy
 *   akcentní tahy (N): levá strana TL–BL, diagonála TL–BR, pravá strana TR–BR
 * Mono varianta nese N silnějším tahem (2.6 vs 2), ne barvou.
 * Favicon vynechává diagonálu BL–TR — ve 16 px by se kříž slil.
 */
type Variant = 'mark' | 'lockup' | 'stacked' | 'favicon'
type Tone = 'auto' | 'onSlab' | 'mono'

interface Props {
  variant?: Variant
  /** Výška značky v px. */
  size?: number
  tone?: Tone
  tagline?: string
  className?: string
}

export const Logo = ({ variant = 'lockup', size = 36, tone = 'auto', tagline, className }: Props) => {
  const w = Math.round((size / 32) * 24)
  const neutral =
    tone === 'onSlab' ? 'oklch(0.995 0.002 250)' : tone === 'mono' ? 'currentColor' : 'oklch(0.66 0.006 250)'
  const accent =
    tone === 'onSlab' ? 'oklch(0.885 0.06 228)' : tone === 'mono' ? 'currentColor' : 'var(--accent)'
  const favicon = variant === 'favicon'

  const mark = (
    <svg
      width={w}
      height={size}
      viewBox="0 0 24 32"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Novostav-Instalace"
      className="shrink-0"
    >
      <g stroke={neutral} strokeWidth={2}>
        <path d={favicon ? 'M4 27.5H20M4 11.5H20M4 11.5L12 4.5L20 11.5' : 'M4 27.5H20M4 11.5H20M4 27.5L20 11.5M4 11.5L12 4.5L20 11.5'} />
      </g>
      <g stroke={accent} strokeWidth={tone === 'mono' || favicon ? 2.8 : 2.6}>
        <path d="M4 11.5V27.5M20 11.5V27.5M4 11.5L20 27.5" />
      </g>
    </svg>
  )

  if (variant === 'mark' || favicon) return <span className={cn('inline-flex', className)}>{mark}</span>

  const stacked = variant === 'stacked'
  const wordSize = Math.round(size * 0.53)

  return (
    <span
      className={cn('inline-flex items-center text-foreground', stacked ? 'flex-col' : 'flex-row', className)}
      style={{ gap: stacked ? 14 : Math.round(size * 0.33) }}
    >
      {mark}
      <span className={cn('flex flex-col', stacked ? 'items-center' : 'items-start')} style={{ gap: tagline ? 6 : 0 }}>
        <span
          className="font-semibold leading-none whitespace-nowrap tracking-[-0.03em]"
          style={{ fontSize: wordSize, color: tone === 'onSlab' ? 'oklch(0.995 0.002 250)' : undefined }}
        >
          Novostav
          <span className={cn('font-normal', tone === 'onSlab' ? 'opacity-70' : 'opacity-60')}>-Instalace</span>
        </span>
        {tagline ? <span className={cn('eyebrow', tone === 'onSlab' && 'text-slab-muted')}>{tagline}</span> : null}
      </span>
    </span>
  )
}
