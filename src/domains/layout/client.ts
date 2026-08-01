'use client'

// Client-safe public API of the layout domain. The main barrel (index.ts)
// exports the server Header/Footer components, which pull in the Payload
// runtime — client components must import from here instead.
export { useHeaderTheme } from './providers/HeaderTheme'
