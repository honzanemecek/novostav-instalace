import React from 'react'
import type { TypedLocale } from 'payload'

import { getProjectCountsByService } from '@/domains/projects'
import { PageHero } from '@/shared/components/PageHero/PageHero'
import { TradeList } from '@/shared/components/TradeList/TradeList'
import { getServices } from '../queries/getServices'
import { serviceToTradeItem } from '../ui/toTradeItems'

export async function ServicesArchivePage({ locale = 'cs' }: { locale?: TypedLocale } = {}) {
  const [services, { byService }] = await Promise.all([
    getServices(locale),
    getProjectCountsByService(locale),
  ])

  return (
    <article>
      <PageHero
        eyebrow="Co děláme"
        heading="Naše služby"
        lead="Stavební práce, střechy, elektro, voda, topení i podlahy — jeden dodavatel na celý dům."
        className="pb-10 md:pb-14"
      />

      <section className="container pb-14 md:pb-[104px]">
        {services.length ? (
          <TradeList
            items={services.map((service) => serviceToTradeItem(service, byService))}
            layout="row"
            headingAs="h2"
          />
        ) : (
          <p className="text-muted-foreground">
            Zatím zde nejsou žádné služby. Přidejte je v administraci.
          </p>
        )}
      </section>
    </article>
  )
}
