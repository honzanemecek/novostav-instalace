import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import type { TypedLocale } from 'payload'

import { LivePreviewListener } from '@/shared/components/LivePreviewListener'
import { Media } from '@/shared/components/Media'
import { RenderBlocks } from '@/domains/pages'
import { getServiceBySlug } from '../queries/getServiceBySlug'
import { ServiceIcon } from '../ui/ServiceIcon'

export async function ServicePage({
  slug,
  locale = 'cs',
}: {
  slug: string
  locale?: TypedLocale
}) {
  const { isEnabled: draft } = await draftMode()
  const service = await getServiceBySlug(slug, locale)

  if (!service) notFound()

  return (
    <article className="pb-24">
      {draft && <LivePreviewListener />}

      <header className="container pt-12 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-5">
            <ServiceIcon name={service.icon} className="size-9 text-muted-foreground" />
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              {service.title}
            </h1>
            {service.shortDescription && (
              <p className="max-w-prose text-lg text-muted-foreground">
                {service.shortDescription}
              </p>
            )}
            {!!service.highlights?.length && (
              <ul className="mt-2 flex flex-col gap-2">
                {service.highlights.map((item, i) => (
                  <li key={item.id ?? i} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {service.image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-card">
              <Media
                resource={service.image}
                fill
                priority
                imgClassName="object-cover"
                size="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </header>

      <RenderBlocks blocks={service.layout} />
    </article>
  )
}
