'use client'

import React from 'react'
import { useReducedMotion } from 'motion/react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { Chip } from '@/shared/components/Chip/Chip'
import { PhoneLink } from '@/shared/components/PhoneLink/PhoneLink'
import RichText from '@/shared/components/RichText'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { Button } from '@/shared/ui/button'
import { TransitionPanel } from '@/shared/ui/motion/transition-panel'
import { getClientSideURL } from '@/shared/utils/getURL'
import { cn } from '@/shared/utils/ui'

type ServiceOption = { id: number; title: string }

type Props = {
  eyebrow?: string | null
  heading?: string | null
  lead?: string | null
  formId: number
  confirmationMessage?: DefaultTypedEditorState | null
  services: ServiceOption[]
  phone?: string | null
}

const STEPS = [
  { title: 'Co potřebujete', help: 'Vyberte jedno nebo víc řemesel. Když si nejste jistí, klidně to nechte na nás.' },
  { title: 'Kde a kdy', help: 'Stačí obec a přibližný termín — upřesníme to spolu.' },
  { title: 'Řekněte nám víc', help: 'Cokoli, co nám pomůže odhadnout rozsah. Nepovinné.' },
  { title: 'Kam se ozvat', help: 'Ozveme se týž den. Telefon stačí, e-mail je dobrovolný.' },
] as const

const TIMINGS = ['Co nejdřív', 'Do 3 měsíců', 'Letos', 'Zatím se rozhoduji'] as const

const UNSURE = 'Nevím, poraďte'

/** Vstupní pole: hrany, ne appka. Focus ring se nikdy neodstraňuje. */
const inputClasses =
  'w-full rounded-none border border-input bg-background px-4 py-3 text-[15px] leading-[1.6] ' +
  'transition-colors duration-150 placeholder:text-muted-foreground hover:border-foreground/40 ' +
  'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2'

const labelClasses = 'eyebrow mb-2 block'

export const InquiryWizard: React.FC<Props> = ({
  eyebrow,
  heading,
  lead,
  formId,
  confirmationMessage,
  services,
  phone,
}) => {
  const reduce = useReducedMotion()

  const [step, setStep] = React.useState(0)
  const [direction, setDirection] = React.useState(1)
  const [error, setError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle')

  const [chosen, setChosen] = React.useState<string[]>([])
  const [location, setLocation] = React.useState('')
  const [timing, setTiming] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [name, setName] = React.useState('')
  const [contactPhone, setContactPhone] = React.useState('')
  const [email, setEmail] = React.useState('')

  const toggleService = (title: string) =>
    setChosen((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
    )

  /** Validace se spouští při odeslání kroku, ne při každém stisku klávesy. */
  const validate = (index: number): string | null => {
    if (index === 0 && chosen.length === 0) return 'Vyberte alespoň jedno řemeslo, nebo „Nevím, poraďte“.'
    if (index === 1 && !location.trim()) return 'Napište prosím obec nebo místo stavby.'
    if (index === 3) {
      if (!name.trim()) return 'Napište prosím, jak vám máme říkat.'
      if (!contactPhone.trim()) return 'Bez telefonu se vám nemáme jak ozvat.'
      if (email.trim() && !email.includes('@')) return 'E-mail nevypadá správně.'
    }
    return null
  }

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
    setError(null)
  }

  const submit = async () => {
    setStatus('sending')
    setError(null)

    const submissionData = [
      { field: 'sluzby', value: chosen.join(', ') },
      { field: 'misto', value: location },
      { field: 'termin', value: timing },
      { field: 'zprava', value: message },
      { field: 'jmeno', value: name },
      { field: 'telefon', value: contactPhone },
      { field: 'email', value: email },
    ].filter((entry) => entry.value)

    try {
      const response = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        body: JSON.stringify({ form: formId, submissionData }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (response.status >= 400) {
        const body = await response.json()
        setStatus('idle')
        setError(body?.errors?.[0]?.message ?? 'Odeslání se nepovedlo. Zavolejte nám prosím.')
        return
      }

      setStatus('sent')
    } catch {
      setStatus('idle')
      setError('Odeslání se nepovedlo. Zavolejte nám prosím.')
    }
  }

  const onContinue = () => {
    const problem = validate(step)
    if (problem) {
      setError(problem)
      return
    }
    if (step === STEPS.length - 1) {
      void submit()
      return
    }
    go(step + 1)
  }

  if (status === 'sent') {
    return (
      <section className="container py-14 md:py-[104px]">
        <div className="max-w-[52ch] border-t border-border pt-10">
          <p className="eyebrow text-accent">Odesláno</p>
          {confirmationMessage ? (
            <RichText className="mt-4 max-w-none" data={confirmationMessage} enableGutter={false} />
          ) : (
            <>
              <h2 className="mt-4">Máme to. Ozveme se vám.</h2>
              <p className="mt-4 text-[17px] leading-[1.7] text-muted-foreground">
                Poptávku jsme dostali. Pokud to spěchá, zavolejte rovnou.
              </p>
            </>
          )}
          {phone && <PhoneLink phone={phone} size="md" className="mt-6 block" />}
        </div>
      </section>
    )
  }

  const variants = reduce
    ? { enter: { opacity: 1, x: 0 }, center: { opacity: 1, x: 0 }, exit: { opacity: 1, x: 0 } }
    : {
        enter: { opacity: 0, x: direction * 24 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: direction * -24 },
      }

  return (
    <section className="container py-14 md:py-[104px]">
      <SectionHeader eyebrow={eyebrow} heading={heading} lead={lead} />

      <div className="mt-12 grid gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-14">
        {/* Postup vlevo. Aktivní krok nese číslo i horní linku v akcentní barvě. */}
        <ol className="hidden md:block">
          {STEPS.map((item, i) => (
            <li
              key={item.title}
              className={cn(
                'border-t pb-5 pt-4 transition-colors duration-150',
                i === step ? 'border-accent' : 'border-border',
              )}
            >
              <span
                className={cn(
                  'block text-xs font-medium leading-none tracking-[0.1em]',
                  i === step ? 'text-accent' : 'text-muted-foreground',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={cn(
                  'mt-2 block text-[15px] leading-[1.4]',
                  i === step ? 'font-semibold' : 'text-muted-foreground',
                )}
              >
                {item.title}
              </span>
            </li>
          ))}
        </ol>

        <div>
          {/* Mobilní ukazatel postupu: čtyři 2px segmenty, žádné procento. */}
          <div aria-hidden className="mb-8 flex gap-1 md:hidden">
            {STEPS.map((item, i) => (
              <span
                key={item.title}
                className={cn('h-0.5 flex-1 transition-colors duration-150', i <= step ? 'bg-accent' : 'bg-border')}
              />
            ))}
          </div>

          <p className="eyebrow text-accent" aria-live="polite">
            Krok {String(step + 1).padStart(2, '0')} ze {STEPS.length}
          </p>
          <h3 className="mt-4">{STEPS[step].title}</h3>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.7] text-muted-foreground">
            {STEPS[step].help}
          </p>

          <TransitionPanel
            className="mt-8"
            activeIndex={step}
            variants={variants}
            transition={{ duration: reduce ? 0 : 0.25, ease: 'easeOut' }}
          >
            {/* 01 — řemesla. Seznam jde z kolekce služeb, ne z polí formuláře. */}
            <fieldset>
              <legend className="sr-only">Řemesla</legend>
              <ul className="flex flex-wrap gap-2">
                {[...services.map((service) => service.title), UNSURE].map((title) => (
                  <li key={title}>
                    <Chip active={chosen.includes(title)} onClick={() => toggleService(title)}>
                      {title}
                    </Chip>
                  </li>
                ))}
              </ul>
            </fieldset>

            {/* 02 — místo a termín */}
            <div className="flex flex-col gap-8">
              <div>
                <label className={labelClasses} htmlFor="inquiry-misto">
                  Obec nebo místo stavby
                </label>
                <input
                  className={inputClasses}
                  id="inquiry-misto"
                  name="misto"
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Např. Kladno"
                  type="text"
                  value={location}
                />
              </div>
              <fieldset>
                <legend className={labelClasses}>Kdy by se to hodilo</legend>
                <ul className="flex flex-wrap gap-2">
                  {TIMINGS.map((option) => (
                    <li key={option}>
                      <Chip
                        active={timing === option}
                        onClick={() => setTiming(timing === option ? '' : option)}
                        size="sm"
                      >
                        {option}
                      </Chip>
                    </li>
                  ))}
                </ul>
              </fieldset>
            </div>

            {/* 03 — volný text */}
            <div>
              <label className={labelClasses} htmlFor="inquiry-zprava">
                Co potřebujete udělat
              </label>
              <textarea
                className={cn(inputClasses, 'min-h-40 resize-y')}
                id="inquiry-zprava"
                name="zprava"
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Rozsah, stáří domu, co už je hotové…"
                value={message}
              />
            </div>

            {/* 04 — kontakt */}
            <div className="flex flex-col gap-6">
              <div>
                <label className={labelClasses} htmlFor="inquiry-jmeno">
                  Jméno
                </label>
                <input
                  autoComplete="name"
                  className={inputClasses}
                  id="inquiry-jmeno"
                  name="jmeno"
                  onChange={(event) => setName(event.target.value)}
                  type="text"
                  value={name}
                />
              </div>
              <div>
                <label className={labelClasses} htmlFor="inquiry-telefon">
                  Telefon
                </label>
                <input
                  autoComplete="tel"
                  className={cn(inputClasses, 'tabular')}
                  id="inquiry-telefon"
                  inputMode="tel"
                  name="telefon"
                  onChange={(event) => setContactPhone(event.target.value)}
                  type="tel"
                  value={contactPhone}
                />
              </div>
              <div>
                <label className={labelClasses} htmlFor="inquiry-email">
                  E-mail (nepovinné)
                </label>
                <input
                  autoComplete="email"
                  className={inputClasses}
                  id="inquiry-email"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  value={email}
                />
              </div>
            </div>
          </TransitionPanel>

          {error && (
            <p className="mt-6 text-[15px] leading-[1.7] text-error" role="alert">
              {error}
            </p>
          )}

          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              {step > 0 && (
                <Button onClick={() => go(step - 1)} type="button" variant="outline">
                  Zpět
                </Button>
              )}
              <Button disabled={status === 'sending'} onClick={onContinue} type="button" variant="accent">
                {step === STEPS.length - 1 ? 'Odeslat poptávku' : 'Pokračovat'}
              </Button>
            </div>
            {/* Telefon zůstává dostupný v každém kroku — průvodce nesmí být
                jediná cesta k firmě. */}
            {phone && (
              <p className="text-[15px] leading-[1.7] text-muted-foreground">
                Nebo hned zavolejte — <PhoneLink phone={phone} size="inline" />
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
