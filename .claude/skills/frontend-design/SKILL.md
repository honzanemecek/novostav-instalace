---
name: frontend-design
description: Use when designing or building any user-facing UI in this repo - pages, sections, heroes, cards, forms, navigation, layout, typography, spacing, colour, responsive behaviour, empty/loading/error states, or accessibility. Read before writing frontend markup, not after, and when reviewing a page that "looks off".
---

# Frontend design for novostav-instalace.cz

Presentation site for a Czech family building and installation firm — **not
plumbing-only**: stavební práce, střechy, elektroinstalace, vodoinstalace, topení/plyn and
podlahy, one contractor for a whole house. The audience is homeowners, developers and
builders, mostly on phones, often comparing two or three local firms. Every page answers
*can these people do my job, have they done it before, and how do I reach them*.

The design system is **„Bílá hala + Modrotisk"** — a cool white hall with a blueprint
printed on it. Credible, calm, competent. A builder's site: motion reads as *solid*, not
showy.

## The nine system rules

These bind every component and every block. If a change breaks one of them, the change is
wrong.

1. **One type family.** IBM Plex Sans, nothing else.
2. **Hairlines, never cards or shadows.** A 1px rule is the only divider in the system.
3. **Exactly one `variant="accent"` per screen.** Second action `outline`, third `quiet`.
4. **The phone number is the conversion** — always `tel:`, always tabular, always one tap
   away.
5. **At most two `<Slab>` per page** (three is the absolute ceiling).
6. **Headings `line-height ≥ 1.16`, body `1.7`.** Czech diacritics over capitals need air.
7. **Active link = a 2px accent rule under the text.**
8. **No emoji.** Lucide icons only where they *do* something: phone, menu, close, arrow.
   Decorative icons next to headings are out.
9. **No invented data.** Every fact comes from the CMS. A missing photo renders the
   `DuoPhoto` "Fotografii doplníme." state — never a stock image, never an empty hole.

## Tokens — use them, never literals

All colour, radius and font tokens live in `src/app/(frontend)/globals.css`; the `shadcn`
skill explains the layers. That file is authoritative — do not add colours to it.

| Token | Role |
|---|---|
| `bg-background` / `text-foreground` | the cool white page and its ink |
| `text-muted-foreground` | secondary text |
| `text-accent` / `bg-accent` / `hover:bg-accent-hover` | steel blue: brand, links, the one action |
| `.slab` + `bg-slab-foreground` / `text-slab-muted` / `border-slab-line` | the blue slab and everything on it |
| `border-border` | hairlines |
| `border-input` | form field edges |
| `bg-card` | the only boxed surface in the system, and only twice in the whole design |
| `--radius` | **0.1875rem (3px)** — `rounded-md`. Edges, not an app. |

`bg-[#f5f5f5]`, `text-gray-700`, inline `style={{ color }}` — all wrong; they break dark
mode, which this site ships (`[data-theme='dark']`). **Check every new screen in both
themes before calling it done.** There is no theme toggle in the UI any more, so switch
`data-theme` on `<html>` by hand to check. `InitTheme` must stay mounted in
`(frontend)/layout.tsx` — `globals.css` ends with `html { opacity: 0 }`, unset only once
`data-theme` lands on the root, so removing the initialiser blanks the site.

### Two traps

- **`--font-mono` is an alias for IBM Plex Sans.** It exists so legacy classes do not
  break. **Never write `font-mono` in new code** — reproduce the artboards' "mono" details
  with sans at the stated size, weight and tracking.
- **`--font-display` is not a token at all.** Use `font-semibold`.

## Vertical rhythm and full bleed

`RenderBlocks` renders every block **bare** — no wrapper, no margin. Each block therefore
owns:

- its own `<section>`;
- its own vertical rhythm, `py-14 md:py-[104px]`;
- the decision whether it sits inside `.container` or bleeds to the window edges.

Three section kinds exist: **contained**, **full-bleed slab** (`<Slab>`), and **full-bleed
photo strip** (`DuoPhoto` on `.hairline-grid`). Use `.container` — never ad-hoc `max-w-* +
mx-auto`; it already reproduces the design's 20px mobile / 56px desktop padding.

`.blocks-inline` neutralises a block's own container and rhythm when blocks are nested
inside a page column (the project story next to its facts rail).

## The thirteen primitives

Reach for these before writing markup. Ten are leaves, three are compositions of them.

| Primitive | What it is |
|---|---|
| `Slab` | the blue full-bleed section. `pad="sm" \| "md" \| "lg"` |
| `SectionHeader` | eyebrow / heading / lead. `align="stack" \| "split"`, plus an `action` slot for the trailing `RuleLink`. **`align="center"` does not exist** — a centred CTA sets its own `h2`. |
| `TradeList` | numbered rows on hairlines. Six surfaces in the design run through it: homepage trades, the process slab, "Rozsah práce", the services index, "Často navazuje", "Kombinace řemesel". `columns`, `layout`, `numbered`, `headingAs`, `onSlab`, `showLinks`, `item.tags`, `item.meta`. |
| `FactList` | `<dl>` of hairline rows, label → value. No blown-up numbers, no icons. |
| `DuoPhoto` | every photograph. Duotone by default, `plain` for ordinary photos, and a `pending` state at the *same* aspect ratio so nothing shifts the day a photo lands. |
| `RuleLink` | the "dál" link. A `border-bottom`, **not** the global `a` underline. |
| `Tag` | `tone="muted"` spec chip (static) or `tone="accent"` trade link. Not interactive, no 44px target. |
| `Chip` | the interactive selector: filters, the wizard's picker, trades on a project. Square, `min-h-11`. **No `rounded-full`** — that is the old system. |
| `PhoneLink` | every phone number, at four sizes. `tel:` + tabular + no underline + **never animated**. |
| `Breadcrumb` | service and project detail. |
| `PageHero` | the opening of seven of the nine screens: eyebrow, h1, lead, actions, facts rail. |
| `ProjectCard` | the portfolio card. `variant="full" \| "caption"`. No card, no radius, no hover scale. |
| `ActionRow` | renders a Payload `linkGroup` and **mechanically enforces rule 3** — index 0 accent, 1 outline, 2+ quiet. |

Plus one CSS utility, `.hairline-grid`: `grid; gap: 1px; background: var(--border)` with
`bg-background` children — the hairline *is* the gap.

**Never import `src/shared/ui/card.tsx`.** It is registry output so it stays installed, but
rule 2 means nothing in this design may use it. A stray `rounded-lg` or `shadow-*` is the
tell that a surface has not been migrated.

## Typography

IBM Plex Sans via `next/font/google` with `latin-ext`, weights 400/500/600. `globals.css`
sets the h1–h4 scale in `@layer base`, so a bare `<h2>` **is** styled — do not add sizes
unless you mean to override.

- `.eyebrow` is the only place capitals appear: 11px / 600 / `.16em` / uppercase. It is a
  class, not a component; there are 80 of them.
- `.tabular` on every number that could change: phone, prices, counts.
- Headings cap at ~22ch (`max-w-[22ch]`); leads at ~44ch; body at ~52–60ch.
- Czech runs 10–15% longer than English — never design to the English string.
- Rich text in heroes and CTAs passes `enableProse={false}`, so the global heading scale
  wins over `prose`.

## Page anatomy

1. **`PageHero`** — eyebrow, h1, lead, one accent action, a `FactList` rail.
2. **Trades** — `TradeList`, numbered, on hairlines. Not cards, not icons.
3. **Proof** — `ProjectCard` grid, a full-bleed `photoStrip`, or `beforeAfter`.
4. **Process** — `TradeList columns={4}` on a `<Slab>`; on mobile it collapses to a
   `FactList`.
5. **Trust** — the `brands` hairline marquee (names as text, no logos), `facts`.
6. **FAQ** — `Accordion` with a `+` / `−` glyph. Not a rotating chevron, not a card.
7. **Ask** — `cta` (plain centred, or on a slab) and the phone.

Don't ship a section with no content behind it. An empty "Reference" is worse than none.

## Components before custom markup

1. A primitive from the table above.
2. An existing block in `src/domains/*/blocks/`.
3. A shadcn primitive from `@/shared/ui` (add via CLI — see the `shadcn` skill).
4. A motion-primitive from `@/shared/ui/motion` (see the `motion` skill; most of them are
   banned by this design — check there first).
5. Something new, and then decide its home with the `architecture` skill.

If the same visual appears twice, it's a component. If the client should be able to change
it without a deploy, it's a **Payload field or block** — this is a CMS site.

## Non-negotiables

1. **Mobile first.** 375 before 1440. Test at 375, 768, 1024, 1440.
2. **The phone is always one tap away** — header, `MobileBar`, footer, every wizard step.
3. **Real photos of real work.** `old_website_photos/` is the source material. No stock.
4. **Czech copy is the primary copy.** Use `localizeHref` / `LocalizedLink` for internal
   links; never hand-concatenate `/en`.
5. **Accessible by default**: semantic landmarks, one `<h1>` per page, visible focus rings
   (never remove the `outline-2 outline-ring outline-offset-2`), 4.5:1 contrast, `alt` on
   every meaningful image, ≥44px touch targets on anything interactive.
6. **No layout shift.** Every image gets an aspect-ratio wrapper — including the `pending`
   state.

## States

- **Loading** — skeletons matching the final layout, never a centred spinner.
- **Empty** — say what is missing and what to do, in Czech, and name the thing that came up
  empty ("Pro službu „Střechy" zatím nemáme…").
- **Error** — plain language plus the phone number. Never a stack trace.
- **Success** — confirm inline; don't navigate away.

## Performance is a design constraint

- LCP is the hero photograph or the hero `h1`. **Never animate it in.** `<Media priority />`
  with correct `sizes`.
- Serve Payload media through `DuoPhoto` or `<Media />`, never a raw `<img>`.
- Keep `'use client'` at the leaves. Marking a page client to get one reveal is not a trade.
- The `brands` marquee is the only continuously animating element on the site.

## Review checklist before calling a screen done

- [ ] 375 / 768 / 1440 correct, nothing overflows horizontally
- [ ] Light **and** dark theme checked (`data-theme` by hand — there is no toggle)
- [ ] Exactly one accent action; at most two slabs
- [ ] No `rounded-lg`, no `shadow-*`, no `rounded-full`, no `font-mono`
- [ ] Czech copy in place and not clipped
- [ ] Phone reachable from this screen
- [ ] Keyboard-navigable, focus visible, headings in order
- [ ] Images sized, `alt` written, no CLS — `pending` shares the aspect ratio
- [ ] Colours / spacing / radius from tokens only
- [ ] Motion follows the budget in the `motion` skill and respects reduced motion
- [ ] Anything the client will want to edit is a Payload field, not hardcoded
- [ ] `npx tsc --noEmit` and `pnpm lint` clean
