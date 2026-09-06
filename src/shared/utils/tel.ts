/**
 * Digits-only form for `tel:` hrefs — "+420 602 323 095" → "tel:+420602323095".
 *
 * Lives in `shared/` because `PhoneLink` needs it and `shared/` may not import
 * from `domains/`. The company domain re-exports it as its public API.
 */
export const telHref = (phone?: string | null): string =>
  phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : ''
