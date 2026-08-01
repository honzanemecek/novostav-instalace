// Build-time public API of the posts domain (Payload block config).
// Config consumers must not import the UI barrel (index.ts) — it pulls the
// React component tree into the Payload CLI's module graph.
export { Archive as ArchiveBlockConfig } from './blocks/ArchiveBlock/config'
