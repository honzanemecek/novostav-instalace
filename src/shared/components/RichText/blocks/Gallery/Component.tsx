'use client'

import React from 'react'
import { XIcon } from 'lucide-react'

import type { GalleryBlock as Props } from '@/payload/payload-types'

import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTrigger,
} from '@/shared/ui/motion/morphing-dialog'
import { cn } from '@/shared/utils/ui'
import { resolveMedia } from '@/shared/utils/resolveMedia'

const columnClasses: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

const phaseLabels: Record<string, string> = {
  before: 'Před',
  during: 'V průběhu',
  after: 'Hotovo',
}

export const GalleryBlock: React.FC<Props & { className?: string }> = ({
  title,
  columns,
  items,
  className,
}) => {
  const photos = (items ?? []).flatMap((item) => {
    const media = resolveMedia(item.image)
    return media ? [{ ...item, media }] : []
  })

  if (!photos.length) return null

  return (
    <section className={cn('not-prose', className)}>
      {title && <h3 className="mb-6 text-xl font-semibold tracking-tight">{title}</h3>}
      <ul className={cn('grid gap-3', columnClasses[columns ?? '3'])}>
        {photos.map((photo, i) => (
          <li key={photo.id ?? i}>
            <MorphingDialog
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              <MorphingDialogTrigger className="group w-full overflow-hidden rounded-lg border border-border bg-card">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <MorphingDialogImage
                    src={photo.media.src}
                    alt={photo.caption || photo.media.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {photo.phase && (
                    <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium backdrop-blur">
                      {phaseLabels[photo.phase]}
                    </span>
                  )}
                </div>
                {photo.caption && (
                  <p className="px-3 py-2 text-left text-sm text-muted-foreground">
                    {photo.caption}
                  </p>
                )}
              </MorphingDialogTrigger>

              <MorphingDialogContainer>
                <MorphingDialogContent className="relative w-[92vw] max-w-4xl rounded-lg bg-background p-2">
                  <MorphingDialogImage
                    src={photo.media.src}
                    alt={photo.caption || photo.media.alt}
                    className="max-h-[80vh] w-full rounded object-contain"
                  />
                  {photo.caption && (
                    <MorphingDialogSubtitle className="px-2 py-3 text-sm text-muted-foreground">
                      {photo.caption}
                    </MorphingDialogSubtitle>
                  )}
                </MorphingDialogContent>
                <MorphingDialogClose className="fixed right-6 top-6 rounded-full bg-background p-2 text-foreground shadow-lg">
                  <XIcon aria-label="Zavřít" className="size-5" />
                </MorphingDialogClose>
              </MorphingDialogContainer>
            </MorphingDialog>
          </li>
        ))}
      </ul>
    </section>
  )
}
