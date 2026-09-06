'use client'

import React from 'react'
import { GripVertical } from 'lucide-react'

import type { BeforeAfterBlock as Props } from '@/payload/payload-types'

import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from '@/shared/ui/motion/image-comparison'
import { cn } from '@/shared/utils/ui'
import { resolveMedia } from '@/shared/utils/resolveMedia'

export const BeforeAfterBlock: React.FC<Props & { className?: string }> = ({
  before,
  after,
  caption,
  className,
}) => {
  const beforeMedia = resolveMedia(before)
  const afterMedia = resolveMedia(after)

  if (!beforeMedia || !afterMedia) return null

  return (
    <figure className={cn('not-prose', className)}>
      <div className="relative">
        {/* Štítky „Před“ a „Po“ leží na fotografii — čtenář nemusí hádat,
            která polovina je která. */}
        <span className="eyebrow absolute left-3 top-3 z-10 bg-background/85 px-2.5 py-2 backdrop-blur">
          Před
        </span>
        <span className="eyebrow absolute right-3 top-3 z-10 bg-background/85 px-2.5 py-2 backdrop-blur">
          Po
        </span>
        <ImageComparison
          className="aspect-[3/2] w-full overflow-hidden border border-border"
          enableHover
          springOptions={{ bounce: 0, duration: 0 }}
        >
          <ImageComparisonImage
            alt={beforeMedia.alt || 'Před'}
            position="left"
            src={beforeMedia.src}
          />
          <ImageComparisonImage
            alt={afterMedia.alt || 'Po'}
            position="right"
            src={afterMedia.src}
          />
          <ImageComparisonSlider className="w-1 bg-background/90 backdrop-blur">
            <div className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-border bg-background">
              <GripVertical aria-hidden className="size-4 text-foreground" />
            </div>
          </ImageComparisonSlider>
        </ImageComparison>
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm leading-[1.7] text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
