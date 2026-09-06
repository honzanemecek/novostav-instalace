/**
 * Typography only — colour, spacing and fonts live in the CSS token layer
 * (`src/app/(frontend)/globals.css`). Every prose variable is bound to a token
 * so rich text follows the theme automatically; that is why `prose-invert` is
 * not needed anywhere (the tokens themselves flip under `[data-theme='dark']`).
 *
 * @type {import('tailwindcss').Config}
 */
const config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--foreground)',
              '--tw-prose-headings': 'var(--foreground)',
              '--tw-prose-lead': 'var(--muted-foreground)',
              '--tw-prose-links': 'var(--foreground)',
              '--tw-prose-bold': 'var(--foreground)',
              '--tw-prose-counters': 'var(--muted-foreground)',
              '--tw-prose-bullets': 'var(--muted-foreground)',
              '--tw-prose-hr': 'var(--border)',
              '--tw-prose-quotes': 'var(--foreground)',
              '--tw-prose-quote-borders': 'var(--border)',
              '--tw-prose-captions': 'var(--muted-foreground)',
              '--tw-prose-code': 'var(--foreground)',
              '--tw-prose-pre-code': 'var(--foreground)',
              '--tw-prose-pre-bg': 'var(--card)',
              '--tw-prose-th-borders': 'var(--border)',
              '--tw-prose-td-borders': 'var(--border)',
              maxWidth: 'none',
              h1: {
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginBottom: '0.25em',
              },
              h2: {
                fontWeight: 600,
                letterSpacing: '-0.01em',
              },
              h3: {
                fontWeight: 600,
              },
              // Czech headings run long; balance keeps them from ragging badly.
              'h1, h2, h3': {
                textWrap: 'balance',
              },
              a: {
                textDecorationThickness: '1px',
                textUnderlineOffset: '3px',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: { fontSize: '2.5rem' },
              h2: { fontSize: '1.75rem' },
              h3: { fontSize: '1.35rem' },
            },
          ],
        },
        md: {
          css: [
            {
              h1: { fontSize: '3.5rem' },
              h2: { fontSize: '2rem' },
              h3: { fontSize: '1.5rem' },
            },
          ],
        },
      },
    },
  },
}

export default config
