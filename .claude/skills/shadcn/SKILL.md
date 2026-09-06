---
name: shadcn
description: Use when adding, updating or styling shadcn/ui components in this repo, working with src/shared/ui/, components.json, registries (@shadcn, @motion-primitives), Radix primitives, cva variants, or the Tailwind 4 token layer in globals.css. Read before running any `shadcn add` command or touching a file in shared/ui/.
---

# shadcn/ui in this repo

Tailwind **4** (CSS-first), shadcn CLI **4.x**, `rsc: true`, `cssVariables: true`,
base color `slate`, `style: default`.

## Hard rule

`src/shared/ui/` is **exclusively registry CLI output**. Never hand-write or hand-edit a
file there. If a generated component needs different behaviour:

1. Change a **token** in `src/app/(frontend)/globals.css` (colours, radius) — first choice.
2. Pass `className` at the call site and let `cn()` merge it — second choice.
3. Wrap it in `src/shared/components/` or a domain's `ui/` — third choice.
4. Re-running `shadcn add <name>` to pick up an upstream fix must stay a clean overwrite.

The one sanctioned deviation is `src/shared/ui/motion/` — see the `motion` skill.

## Adding a component

```bash
pnpm dlx shadcn@latest add button card dialog       # @shadcn is implicit
pnpm dlx shadcn@latest add @motion-primitives/tilt  # namespaced registry
```

Useful CLI 4 flags before you commit to anything: `--dry-run`, `--diff`, `--view`.
`shadcn docs <component>` and `shadcn info` pull docs and project state into the terminal.

After adding, always:

```bash
npx prettier --write "src/shared/ui/**/*.tsx"   # CLI output is not repo-formatted
pnpm lint
```

The CLI installs peer deps with `pnpm add`, which in this repo **rewrites
`pnpm-workspace.yaml`'s `allowBuilds:` block to placeholder strings**. Check
`git diff pnpm-workspace.yaml` afterwards and `git checkout` it if that happened.

## Registries

`components.json` → `registries`:

```json
"registries": {
  "@motion-primitives": "https://motion-primitives.com/c/{name}.json"
}
```

The `{name}` placeholder is required. Add more third-party registries the same way; use
`@namespace/item` to install. Private registries take an object form with `headers` and
`${ENV_VAR}` expansion.

The **shadcn MCP server** is configured in `.mcp.json` — prefer it over guessing:
`search_items_in_registries`, `view_items_in_registries`,
`get_item_examples_from_registries`, `get_add_command_for_items`, `get_audit_checklist`.

## Aliases (already wired)

| Alias | Path |
|---|---|
| `ui` | `@/shared/ui` |
| `components` | `@/shared/components` |
| `utils` | `@/shared/utils/ui` (exports `cn`) |

Registry components import `@/lib/utils`; the CLI rewrites that to `@/shared/utils/ui`
via `components.json`. If you ever paste a component by hand, rewrite that import
yourself.

## The token layer (Tailwind 4)

`src/app/(frontend)/globals.css` is the design system. Its structure, in order:

1. `@import 'tailwindcss'` + `tw-animate-css`, `@config '../../../tailwind.config.mjs'`
   (that file only holds the `@tailwindcss/typography` overrides).
2. `@custom-variant dark (&:is([data-theme='dark'] *))` — **dark mode is driven by a
   `data-theme` attribute on `<html>`, not `prefers-color-scheme`.** Written by the
   `InitTheme` script; togglable via `ThemeSelector` in `domains/layout`.
3. `@source inline(...)` — safelist for classes only ever produced dynamically
   (`lg:col-span-*`, `bg-error/30`, …). **Any new dynamically-composed class must be
   added here or Tailwind will not emit it.**
4. `@theme { --breakpoint-*, --font-sans, --font-mono }` — breakpoints and Geist fonts.
5. `.container` utility, defined manually per breakpoint (Tailwind 4 dropped the plugin).
6. `:root { … }` light tokens and `[data-theme='dark'] { … }` dark tokens, all in
   **oklch**. Every colour has a dark counterpart — add both or the component breaks in
   dark mode.
7. `@theme inline { --color-*: var(--*) }` — this is what turns a token into a utility
   (`--color-card` → `bg-card`, `text-card`, `border-card`). **A new token is invisible to
   Tailwind until it is mapped here.**

Beyond the shadcn defaults this project also has `--success`, `--warning`, `--error`, and
a `--card` that is intentionally tinted in light mode (`oklch(96.5% 0.005 265deg)`).

### Adding a colour

```css
:root            { --brand: oklch(62% 0.14 235deg); }
[data-theme='dark'] { --brand: oklch(70% 0.12 235deg); }
@theme inline    { --color-brand: var(--brand); }
```

Then `bg-brand`, `text-brand`, `border-brand/40` all work. Never write a raw hex or
`bg-[#0ea5e9]` in a component — it will not follow the theme.

## Variants

Use `class-variance-authority` the way the generated `button.tsx` does: variants for
*kinds* of a component, `className` for one-off spacing. Don't fork a component to add a
size — add a cva variant in a wrapper, or pass classes.

`cn()` = `twMerge(clsx(...))`, so later classes win predictably; put the incoming
`className` last.

## Checklist for any new UI work

- [ ] Component exists in `@shadcn` or `@motion-primitives`? Install it, don't rebuild it.
- [ ] Colours/spacing/radius come from tokens, not literals.
- [ ] Dark tokens added alongside light ones.
- [ ] Dynamically-built class names added to `@source inline(...)`.
- [ ] `'use client'` only where genuinely needed.
- [ ] `prettier --write` on CLI output, then `pnpm lint`.
- [ ] `git diff pnpm-workspace.yaml` is clean.
