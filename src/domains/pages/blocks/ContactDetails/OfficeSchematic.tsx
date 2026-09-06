import React from 'react'

import { PhoneLink } from '@/shared/components/PhoneLink/PhoneLink'
import { RuleLink } from '@/shared/components/RuleLink/RuleLink'

type Props = {
  address?: string | null
  note?: string | null
  mapUrl?: string | null
  serviceArea?: string | null
  availabilityNote?: string | null
  phone?: string | null
}

/**
 * Kreslené schéma místo mapy: **žádná třetí strana, žádné sledování, žádný klíč
 * k API** a nic, co by se muselo načítat. Adresa i odkaz do map jdou z globálu
 * Firma — tenhle komponent nic nevymýšlí, jen kreslí okolí špendlíku.
 */
export const OfficeSchematic: React.FC<Props> = ({
  address,
  note,
  mapUrl,
  serviceArea,
  availabilityNote,
  phone,
}) => (
  <section className="border-y border-border">
    <div className="grid md:grid-cols-[minmax(0,1fr)_420px]">
      <div className="relative min-h-[280px] bg-secondary md:min-h-[380px]">
        <svg
          aria-hidden
          className="absolute inset-0 size-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 600 380"
        >
          <g stroke="var(--border)" strokeWidth="1" fill="none">
            {[60, 140, 220, 300].map((y) => (
              <line key={y} x1="0" x2="600" y1={y} y2={y} />
            ))}
            {[80, 200, 320, 440, 540].map((x) => (
              <line key={x} x1={x} x2={x} y1="0" y2="380" />
            ))}
          </g>
          <path d="M0 220 L200 220 L200 60 L600 60" fill="none" stroke="var(--input)" strokeWidth="6" />
          <path d="M320 380 L320 220" fill="none" stroke="var(--input)" strokeWidth="6" />
          <g transform="translate(320 220)">
            <circle r="26" fill="var(--accent)" opacity="0.14" />
            <circle r="7" fill="var(--accent)" />
            <line x1="0" y1="-7" x2="0" y2="-30" stroke="var(--accent)" strokeWidth="2" />
          </g>
        </svg>

        {address && (
          <div className="absolute bottom-5 left-5 max-w-[24rem] rounded-md border border-border bg-card p-5">
            <p className="eyebrow">Kancelář</p>
            <p className="mt-2 text-[15px] font-semibold leading-[1.4]">{address}</p>
            {note && <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">{note}</p>}
            {mapUrl && (
              <a
                className="mt-4 inline-block border-b border-b-[color-mix(in_oklch,var(--accent)_35%,transparent)] pb-[3px] text-[15px] font-semibold leading-none text-accent no-underline transition-colors duration-150 hover:border-current"
                href={mapUrl}
                rel="noreferrer"
                target="_blank"
              >
                Otevřít v mapách
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-8 px-5 py-10 md:px-14">
        {serviceArea && (
          <div>
            <p className="eyebrow">Kde pracujeme</p>
            <p className="mt-2 text-[17px] leading-[1.7]">{serviceArea}</p>
          </div>
        )}
        {availabilityNote && (
          <div>
            <p className="eyebrow">Kdy voláte</p>
            <p className="mt-2 text-[17px] leading-[1.7]">{availabilityNote}</p>
          </div>
        )}
        {phone && (
          <div>
            <p className="eyebrow">Telefon</p>
            <PhoneLink phone={phone} size="sm" className="mt-2 block" />
          </div>
        )}
        <RuleLink href="/realizace">Podívejte se na naše realizace</RuleLink>
      </div>
    </div>
  </section>
)
