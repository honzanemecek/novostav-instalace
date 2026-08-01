// Build-time public API of the search domain (configured search plugin).
// Config consumers import this, never index.ts — the UI barrel pulls the
// React component tree into the Payload CLI's module graph.
export { searchPluginConfig } from './plugin'
