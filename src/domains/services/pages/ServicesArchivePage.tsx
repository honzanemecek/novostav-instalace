import React from 'react'
import type { TypedLocale } from 'payload'

import { getServices } from '../queries/getServices'
import { ServiceCard } from '../ui/ServiceCard'

export async function ServicesArchivePage({ locale = 'cs' }: { locale?: TypedLocale } = {}) {
  const services = await getServices(locale)

  return (
    <div className="container py-16 md:py-24">
      <header className="flex max-w-3xl flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Naše služby</h1>
        <p className="text-lg text-muted-foreground">
          Stavební práce, střechy, elektro, voda, topení i podlahy — jeden dodavatel na celý dům.
        </p>
      </header>

      {services.length ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-muted-foreground">
          Zatím zde nejsou žádné služby. Přidejte je v administraci.
        </p>
      )}
    </div>
  )
}
