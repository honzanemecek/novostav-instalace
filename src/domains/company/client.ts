// Client-safe public API of the company domain.
// Pure formatting helpers only — no queries, which would drag the Payload
// runtime into the client bundle.
export { formatAddress, telHref, yearsInBusiness } from './utils/format'
