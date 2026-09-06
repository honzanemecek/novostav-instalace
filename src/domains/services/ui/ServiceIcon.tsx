import React from 'react'
import {
  Droplets,
  Flame,
  Hammer,
  House,
  Layers,
  PaintRoller,
  Ruler,
  Sun,
  Thermometer,
  Triangle,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import type { ServiceIcon as ServiceIconName } from '../icons'

const icons: Record<ServiceIconName, LucideIcon> = {
  wrench: Wrench,
  droplets: Droplets,
  flame: Flame,
  zap: Zap,
  house: House,
  // lucide has no roof glyph — a bare triangle reads as one at icon sizes
  roof: Triangle,
  layers: Layers,
  hammer: Hammer,
  sun: Sun,
  thermometer: Thermometer,
  paintRoller: PaintRoller,
  ruler: Ruler,
}

export const ServiceIcon: React.FC<{
  name?: string | null
  className?: string
}> = ({ name, className }) => {
  const Icon = icons[(name as ServiceIconName) ?? 'wrench'] ?? Wrench
  return <Icon aria-hidden className={className} />
}
