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
      <ImageComparison
        className="aspect-[3/2] w-full overflow-hidden rounded-lg border border-border"
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
          <div className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-md">
            <GripVertical aria-hidden className="size-4 text-foreground" />
          </div>
        </ImageComparisonSlider>
      </ImageComparison>
      <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>{caption}</span>
        <span aria-hidden className="shrink-0">
          Před ← → Po
        </span>
      </figcaption>
    </figure>
  )
}
