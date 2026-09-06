import type { Option } from 'payload'

/**
 * Curated icon set for services. Kept small and trade-specific on purpose —
 * a free-text lucide name would let the client pick an icon we never styled.
 * Values map to components in `ui/ServiceIcon.tsx`.
 */
const ICONS = [
  'wrench',
  'droplets',
  'flame',
  'zap',
  'house',
  'roof',
  'layers',
  'hammer',
  'sun',
  'thermometer',
  'paintRoller',
  'ruler',
] as const

export type ServiceIcon = (typeof ICONS)[number]

const labels: Record<ServiceIcon, { cs: string; en: string }> = {
  wrench: { cs: 'Klíč (instalace)', en: 'Wrench' },
  droplets: { cs: 'Kapka (voda)', en: 'Droplets' },
  flame: { cs: 'Plamen (topení, plyn)', en: 'Flame' },
  zap: { cs: 'Blesk (elektro)', en: 'Lightning' },
  house: { cs: 'Dům (stavební práce)', en: 'House' },
  roof: { cs: 'Střecha', en: 'Roof' },
  layers: { cs: 'Vrstvy (podlahy)', en: 'Layers' },
  hammer: { cs: 'Kladivo', en: 'Hammer' },
  sun: { cs: 'Slunce (solár)', en: 'Sun' },
  thermometer: { cs: 'Teploměr', en: 'Thermometer' },
  paintRoller: { cs: 'Váleček (fasády)', en: 'Paint roller' },
  ruler: { cs: 'Pravítko (projekt)', en: 'Ruler' },
}

/** Derived from ICONS so the option list and the type can never drift apart. */
export const serviceIconOptions: Option[] = ICONS.map((value) => ({
  label: labels[value],
  value,
}))
