# Redesign plan — „Bílá hala + Modrotisk"

Execution plan derived from the design handoff (`design_handoff_novostav_redesign/`:
`README.md`, `artboards/Redesign webu.dc.html`, `drop-in/`, `reference-tsx/`).

The handoff is hi-fi and the data model does not change — only presentation. Two
exceptions it names: photography is placeholder (only real Payload media ships, otherwise
`DuoPhoto pending`), and copy is a proposal (factual values come from the `company`
global).

---

## 0. Audit — what is already done

The handoff's **Step 1 (foundation) has already landed** in commit `f0411b8 style: branding`.
All five `drop-in/` files are byte-identical to the repo:

| File | Status |
|---|---|
| `src/app/(frontend)/globals.css` | identical — tokens, `.slab`, `.duotone`, `.eyebrow`, `.hairline-*`, `.tabular`, h1–h4 scale |
| `src/app/(frontend)/layout.tsx` | identical — IBM Plex Sans via `next/font/google`, `latin-ext` |
| `src/shared/ui/button.tsx` | identical — `accent / ink / outline / quiet / onSlab / onSlabOutline`, `phone`, `full` |
| `src/shared/config/site.ts` | identical |
| `src/shared/components/Logo/Logo.tsx` | identical — `mark / lockup / stacked / favicon`, `auto / onSlab / mono` |
| `public/favicon.svg` | **keep the repo's.** The drop-in copy is the same artwork plus ~8 KB of C2PA metadata (339 B vs 8101 B). Do not overwrite. |

The two grep chores from Step 1 are also already clear:

- **`<Button variant="default" / "link">`** — no call sites. `CMSLink` already maps the CMS's
  legacy `appearance` enum (`default` → `ink`, `link` → `quiet`) in
  `src/shared/components/Link/index.tsx:29`, so the Postgres enum stays untouched.
- **`SectionHeader align="center"`** — no call sites. All nine callers pass only
  `eyebrow / heading / lead`, so the `align` rename from `'left' | 'center'` to
  `'stack' | 'split'` is **not breaking in practice**.

So **tokens are a no-op**, and the work starts at primitives.

### Verified against the real repo

Everything `reference-tsx/` was unsure about checks out:

- `Media` props `fill`, `imgClassName`, `priority`, `resource`, `size` — all present
  (`src/shared/components/Media/types.ts`). `DuoPhoto` compiles as written.
- `services` has an `order` number field → `sort: 'order'` in `getServicesForNav` is correct.
- `company` has `phone`, `email`, `availabilityNote`, `office{street,city,zip,mapUrl,note}`,
  `registeredSeat{street,city,zip}`, `serviceArea`, `legalName`, `foundedYear`, `ico`,
  `dic`, `vatPayer`, `certifications[]`. `formatAddress`, `telHref`, `yearsInBusiness`
  are exported from `@/domains/company` (and the pure ones from `.../client`).
- `unstable_cache` + tags is the repo-wide convention (`getGlobals`, `getCompany`, all
  sitemaps) — `getServicesForNav` as proposed fits; do not reach for `use cache`.
- Stack: Next **16.2.6**, React **19.2.6**, motion **13**, Payload **3.84.1**.
- Routes that exist: `/sluzby`, `/sluzby/[slug]`, `/realizace`, `/realizace/[slug]`,
  `/realizace/sluzba/[slug]`, `/search`, `/posts/*`, `/[slug]`.

### Open items the handoff leaves for us

1. **Missing routes.** `/kontakt`, `/o-nas`, `/ochrana-osobnich-udaju` do not exist. The
   header global currently links to **`/contact`** (`scripts/populate-content.ts:192`) —
   a 404 today. These must become `pages` documents.
2. **Filter URL contradiction.** The README body says `/realizace?sluzba=strechy`; the
   artboard caption for screen 04 says `/realizace/sluzba/strechy`. The repo already
   implements the **path** form and it is the better one (crawlable segment, already
   routed, already in the sitemap). **Use the path form**; the README's query-string
   mention is a slip.
3. **`RenderBlocks` fights the design.** It wraps every block in `<div className="my-16">`
   (`src/domains/pages/blocks/RenderBlocks.tsx:56`). The artboards need a 104 px desktop
   rhythm *and* full-bleed elements (slab strips, photo grids) that must escape the
   container. See §2.
4. **The handoff names five primitives. The artboards contain thirteen.** See §3 — the
   five it names are the *content* primitives; the *chrome* (links, tags, chips, phone,
   breadcrumb, the page hero, the project card) is left unnamed and is where a hi-fi
   rebuild silently drifts.
5. **Two blocks are not in the artboards** — `stats` and `testimonials`. Decisions in §6.F.
6. **`--font-mono` is a trap.** The artboards write `var(--font-mono)` for eyebrows,
   numbers and tag chips. In the shipped token layer `--font-mono` is *aliased to
   IBM Plex Sans* precisely so legacy classes do not break. **Never write `font-mono` in
   new code** — reproduce those elements with sans at the stated size/weight/tracking.
   Same for `var(--font-display)`, which is not a token at all: use `font-semibold`.
7. **`.claude/skills/frontend-design/SKILL.md` is stale** and will mislead every future
   agent. See §10.

---

## 1. Tokens

**Nothing to do.** `globals.css` is authoritative and already in place. This section exists
so the constraints are written down where the block work can see them.

### Palette (oklch — never convert to hex)

| Token | Light | Role |
|---|---|---|
| `--background` | `oklch(0.988 0.002 250)` | cool white page |
| `--foreground` | `oklch(0.185 0.006 250)` | ink |
| `--accent` / `--accent-hover` | `oklch(0.475 0.098 232)` / `oklch(0.415 0.09 232)` | steel blue: brand, links, the one action |
| `--slab` / `--slab-foreground` / `--slab-muted` / `--slab-line` | `0.44 0.095 232` / `0.995 0.002 250` / `…/0.82` / `oklch(1 0 0 / .24)` | the blue slab |
| `--border` / `--input` | `oklch(0.9 0.004 250)` / `oklch(0.862 0.005 250)` | hairlines |
| `--muted-foreground` | `oklch(0.468 0.012 250)` | secondary text |
| `--radius` | `0.1875rem` (3 px) | edges, not an app |
| footer ground | `oklch(0.185 0.008 250)` | dark **ink**, not a third slab |

Dark theme is fully defined under `[data-theme='dark']` (accent lightens to
`oklch(0.735 0.105 228)`, slab darkens to `oklch(0.335 0.075 232)`). Per AGENTS.md rule 7,
**every screen gets checked in both themes.** The one place needing thought is the footer:
it is a hardcoded light-theme ink, so it needs a `dark:` counterpart (`dark:bg-card`).

### The nine system rules (they bind every primitive and block below)

1. One type family. 2. Hairlines, never cards or shadows. 3. Exactly one
`variant="accent"` per screen; second action `outline`, third `quiet`. 4. The phone number
is the conversion — always `phone` (tabular), always one tap away. 5. At most two `<Slab>`
per page (three is the ceiling). 6. Headings `line-height ≥ 1.16`, body `1.7`.
7. Active link = 2 px accent rule under the text. 8. No emoji; lucide icons only when
functional (phone, menu, close, arrow). 9. No invented data.

### Spacing vocabulary lifted from the artboard scaffolding

`.pad` = 56 px desktop horizontal, `.mpad` = 20 px mobile — **the existing `.container`
already reproduces both** (`1.25rem` → `3.5rem` at `xl`); do not add padding wrappers.
`.sec` = 104 px vertical rhythm → `py-14 md:py-[104px]`.

### One utility to add

The artboards use `display:grid; gap:1px; background:var(--border)` four times (the
full-bleed photo strips) and a 2 px variant eight times — the hairline *is* the gap. Add to
`@layer components` in `globals.css`:

```css
.hairline-grid { @apply grid gap-px bg-border; }
.hairline-grid > * { @apply bg-background; }
```

That is a CSS utility, not a component. It is the only token-layer change in the whole
redesign.

---

## 2. Rhythm and `RenderBlocks` — do this before any block

The artboards alternate three kinds of section:

- **contained** — inside the container, 104 px vertical rhythm;
- **full-bleed slab** — `<Slab>` spanning the viewport, its own padding;
- **full-bleed photo strip** — a 2- or 3-up `DuoPhoto` grid on `.hairline-grid`.

`RenderBlocks`'s `<div className="my-16">` makes all three impossible. Change:

1. `RenderBlocks` renders each block bare — no wrapper div, no margin.
2. Every block component owns its own `<section>`, its own vertical rhythm
   (`py-14 md:py-[104px]`, or `pb-…` when it stacks against a slab) and decides whether it
   sits in `.container` or goes full-bleed.
3. Keep the `@ts-expect-error` spread and the `disableInnerContainer` prop for now; revisit
   once every block owns its container.

Files: `src/domains/pages/blocks/RenderBlocks.tsx`.
Risk: every existing page's spacing shifts at once. Expected — do it in the same change as
the first block rewrite so nothing sits half-migrated.

---

## 3. Primitives

> **Are five enough? No.** Counting every repeated construct in the artboards, the design
> is built from **thirteen** primitives plus one CSS utility. The handoff names the five
> that carry *content*; it leaves the *chrome* unnamed, and chrome is exactly what drifts
> when nine screens get built by hand. Occurrence counts below are literal `grep` counts
> over `artboards/Redesign webu.dc.html` (desktop + mobile artboards combined).

### Tier 0 — already solved in CSS. Do **not** componentise.

| Construct | Uses | Where it lives |
|---|---|---|
| `.eyebrow` — 11 px / 600 / `.16em` / uppercase | **80** | `globals.css` — the only all-caps in the system |
| `.tabular` — tabular figures | 6 explicit + every `Button phone` | `globals.css` |
| `.slab`, `.duotone`, `.hairline-top`, `.hairline-bottom` | — | `globals.css` |
| `.hairline-grid` (**new**, §1) | 4 + 8 | `globals.css` |
| Global `a` — accent + 35 % underline → currentColor on hover | — | `globals.css @layer base` |

An 80-use construct that is already a class is the system working. Leave it alone.

### Tier 1 — the five the handoff names (content)

#### 3.1 `Slab` — `shared/components/Slab/Slab.tsx` (new) · 8 uses

`<section className="slab">` + padding. Props: `pad?: 'sm' | 'md' | 'lg'` (default `lg`),
`className`, `children`.

```
sm: px-5 py-8  md:px-8  md:py-8
md: px-5 py-11 md:px-14 md:py-12
lg: px-5 py-11 md:px-14 md:py-[76px]
```

Children only need `onSlab`; `.slab` flips links, rules and eyebrows to white.
**Budget: two per page, three max** — enforced by review of the page template, not by code.

#### 3.2 `SectionHeader` — rewrite of `shared/components/SectionHeader/index.tsx` · 9 uses

| Prop | Type | Default |
|---|---|---|
| `eyebrow` / `heading` / `lead` | `string \| null` | — |
| `align` | `'stack' \| 'split'` | `'stack'` |
| `onSlab` | `boolean` | `false` |
| `as` | `'h1' \| 'h2' \| 'h3'` | `'h2'` |
| **`action`** | `ReactNode` | — |

`stack`: eyebrow (`mb-[18px]`) → heading → lead (17 px / 1.7 muted), `max-w-[52ch]`.
`split`: heading left `max-w-[22ch]`, lead right,
`md:grid-cols-[minmax(0,1fr)_minmax(0,440px)]`, `gap-14`, `items-end`.

**`action` is an addition to the handoff's spec.** Artboards 02, 03 and 05 all put a
trailing `RuleLink` („Všechny realizace", „Všechny realizace se střechami", „Zpět na
přehled") on the header's baseline —
`flex justify-between items-end gap-14`. Without the slot that gets rebuilt by hand at
every call site.

`align="center"` is **gone from the system**. The centred CTA on 02/09 centres its own
`h2`/`p` directly; it does not use `SectionHeader`.

#### 3.3 `TradeList` — `shared/components/TradeList/TradeList.tsx` (new) · **the workhorse**

Declared twice in the artboards, but once generalised it renders **six** distinct surfaces
(§5). Numbered trades on hairlines — the load-bearing structure of the site.

| Prop | Type | Default | Note |
|---|---|---|---|
| `items` | `{ title, text?, href?, linkLabel?, no?, tags?, meta? }[]` | — | `tags` and `meta` added beyond the handoff |
| `columns` | `2 \| 3 \| 4` | `3` | `4` needed by the process slab; mobile always 1 |
| `layout` | `'column' \| 'row'` | `'column'` | `row` = the services-index arrangement |
| `numbered` | `boolean` | `true` | off for „Často navazuje" / „Kombinace řemesel" |
| `headingAs` | `'h2' \| 'h3' \| 'h4'` | `'h3'` | `h4` on the slab, `h2` on the services index |
| `onSlab` / `showLinks` | `boolean` | `false` / `true` | |

Row: hairline top, `pt-[26px] pb-[30px]`; number `01…` 12 px / 500 / `tracking-[.1em]` in
`--accent` (white on slab), `mb-[18px]`; heading; text 15 px / 1.7 muted; optional `Tag`
row; optional `RuleLink`. Grid `column-gap-14 row-gap-[2px]`.
`layout="row"`: `grid-cols-[56px_minmax(0,1.1fr)_minmax(0,1fr)_200px] gap-10 py-8`.

Links go through `LocalizedLink` — never hand-build `/en`.

#### 3.4 `FactList` — `shared/components/FactList/FactList.tsx` (new) · 12 uses

`<dl>` of hairline rows, label → value. Props: `items: { label, value: ReactNode }[]`,
`onSlab?`, `align?: 'left' | 'right'` (default `right`).
Row: flex, `justify-between`, `items-baseline`, `py-[15px]`, `border-b` (first row also
`border-t`). `dt` 12 px muted; `dd` 15 px / 600, `max-w-[22ch]`.
**No blown-up numbers, no icons.** Almost always the hero's right-hand rail.

#### 3.5 `DuoPhoto` — `shared/components/DuoPhoto/DuoPhoto.tsx` (new) · **35 uses**

The most-instantiated component in the design. Props: `resource`, `eyebrow`, `title`,
`plain?`, `aspect?` (default `'4 / 3'`), `priority?`.

- With image: `.duotone` wrapper, `<Media fill … />`, caption in a gradient
  `oklch(0.2 0.045 240)` 0 → .72 → .88, `px-6 pb-5 pt-[34px]`.
- Without image: **`pending` — never an empty hole.** `bg-secondary`, `border-border`,
  `p-5`, eyebrow top, title 19 px / 600 and „Fotografii doplníme."

Render through `Media`, never a bare `<img>`. The artboards' fixed pixel heights
(300/230/190…) are scaffolding — translate to ratios. **`pending` must use the identical
`aspect`** so the grid does not jump the day a photo lands (CLS).

### Tier 2 — the atoms the handoff omits. Ten lines each; without them the design drifts.

#### 3.6 `RuleLink` — `shared/components/RuleLink/RuleLink.tsx` (new) · **12 uses**

„Všechny realizace", „Detail služby", „Zpět na přehled", every `TradeList` link.
15 px / 600, `no-underline`, `border-b border-[color-mix(in_oklch,var(--accent)_35%,transparent)]`
→ `border-current` on hover, `pb-[3px]`, `transition-colors duration-150`.

**This is not the global `a` style.** The global uses `text-decoration` with a 3 px offset;
this uses a `border-bottom` with 3 px padding — visually thicker and further from the
baseline. Twelve hand-built copies would produce twelve slightly different underlines.
Props: `href`, `onSlab?`, `children`. Renders a `LocalizedLink` internally.

#### 3.7 `Tag` — `shared/components/Tag/Tag.tsx` (new) · **52 uses** (30 static + 22 link)

Two tones of the same atom:

- `tone="muted"` (30 uses — spec chips on artboards 03 and 09): 11 px / 500 /
  `tracking-[.08em]`, `border border-border`, `px-[9px] py-[7px]`, `text-muted-foreground`,
  square. Static, non-interactive.
- `tone="accent"` (22 uses — the service tags on every project card): 11 px / 600 /
  `tracking-[.12em]`, `uppercase`, `text-accent`, no border, `no-underline`. A link.

Props: `tone`, `href?`, `children`. With `href` it is a `LocalizedLink`, otherwise a
`<span>`. **Not** a `Chip` — no 44 px tap target, because the muted variant is never
interactive and the accent variant sits inside an already-large card.

#### 3.8 `Chip` — `shared/components/Chip/Chip.tsx` (new) · **18 uses** (`min-height:44px`)

The interactive selector: projects filter (04, desktop + mobile), the wizard's service
picker (06), the trades on a project detail (05).

Props: `active?`, `href?` (→ link) or `onClick` (→ button), `size?: 'sm' | 'md'`,
`count?: number`, `children`.
Inactive `border-input text-foreground`, active `bg-accent text-accent-foreground
border-accent` + `aria-current="page"` (link) or `aria-pressed` (toggle).
13 px / 500 (600 when active), `tracking-[.06em]`, `px-4 py-3`, **`min-h-11` always**
(rule: ≥44 px touch target), square, `transition-colors duration-150`.

**No `rounded-full`.** The current archive page uses pills; that is the old system.

#### 3.9 `PhoneLink` — `shared/components/PhoneLink/PhoneLink.tsx` (new) · 6 bare + every `Button phone`

System rule 4 says the phone number *is* the conversion. It appears at five sizes —
44 px (contact hero), 30 px (contact mobile), 24 px (footer mobile), 22 px (contact rail),
15 px (footer column) — and inside `Button phone` in the header, mobile menu and MobileBar.
Every one of them must be `tel:` + `.tabular` + `no-underline`, and **never animated**
(motion house rule 7).

Props: `size?: 'inline' | 'sm' | 'md' | 'lg'`, `tone?: 'accent' | 'footer' | 'inherit'`.
Takes the number from the `company` global at the call site; uses `telHref()`.
Centralising it is the cheapest way to guarantee a rule that the whole business depends on.

#### 3.10 `Breadcrumb` — `shared/components/Breadcrumb/Breadcrumb.tsx` (new) · 4 uses

Service detail and project detail, desktop + mobile. `<nav aria-label="Drobečková
navigace">` with `.eyebrow` links in `text-muted-foreground`, a `/` separator in
`text-border`, and the current item in `text-accent` with `aria-current="page"`.
Small, but it is the only place semantic markup would otherwise be improvised.

### Tier 3 — the composites the handoff omits

#### 3.11 `PageHero` — `shared/components/PageHero/PageHero.tsx` (new) · **7 uses — one per content screen**

The single largest omission. Seven of the nine screens open with exactly this:

```
[Breadcrumb?]
eyebrow (accent)          ┐
h1  max-w-[20-24ch]       │  minmax(0,1fr)      │  fixed rail 340–420px
lead 19px/1.7 max-w-[44ch]│                     │  <FactList>
<ActionRow> accent+outline┘  gap-20  items-start│  (items-end on 07/09)
```

Grid widths seen: `340px` ×1, `380px` ×3, `400px` ×1, `420px` ×2 — normalise to a
`rail?: 'sm' | 'md' | 'lg'` (340 / 380 / 420).
Props: `eyebrow`, `heading`, `lead`, `breadcrumb?`, `actions?`, `facts?`, `align?:
'start' | 'end'`, `rail?`.
Used by the `hero` group (pages), `ServicePage`, `ProjectPage`, `ProjectsArchivePage`,
`ServicesArchivePage`. Without it, seven near-identical grids get hand-typed.

#### 3.12 `ProjectCard` — rewrite of `domains/projects/ui/ProjectCard.tsx` · **16 uses**

The most repeated *composite* in the design — more instances than `TradeList`, `Slab` and
`SectionHeader` combined. Homepage showcase (3), service detail (3), archive (6 + 2
mobile), project detail „Další realizace" (3, caption-only variant).

```
<DuoPhoto plain resource={coverImage} aspect="7 / 5" />
hairline top · pt-[18px] mt-[18px]
  <Tag tone="accent" href="/sluzby/…">  ×2, then "+N"
  .eyebrow  "Kladno, 09/2025"                  ← location + completedAt (cs-CZ MM/yyyy)
  h3 19px → LocalizedLink to the project
  summary 14px/1.7 muted
  <Button variant="outline" size="sm">Zobrazit realizaci</Button>
```

Add `variant?: 'full' | 'caption'` — the „Další realizace" row is a bare captioned
`DuoPhoto` wrapped in a link. No `rounded-lg`, no `bg-card`, no hover scale.
Stays in `domains/projects/ui/` (only the projects domain and its block use it —
architecture skill).

#### 3.13 `ActionRow` — `shared/components/ActionRow/ActionRow.tsx` (new)

Renders a Payload `linkGroup` as buttons and **mechanically enforces system rule 3**:
index 0 → `accent`, index 1 → `outline`, index 2+ → `quiet`; any `tel:` href gets
`phone`; `onSlab` swaps to `onSlab` / `onSlabOutline`; `full` on mobile.
Used by `PageHero`, `cta`, `projectShowcase`, `contactDetails`, the project rail mini-CTA
and the mobile menu. 57 `Button` instances in the artboards, essentially all of them in
this accent-then-outline pair.

### Explicitly **not** a primitive: `Card`

System rule 2 is *hairlines instead of cards and shadows*. Searching the artboards for a
card turns up exactly two boxed surfaces — the map callout (06) and the „Jak pracujeme"
panel (07) — and both are just `bg-card` + `border-border` at 3 px radius with **no
shadow**. That is two uses of two utility classes, not a component.

**`src/shared/ui/card.tsx` is dead for the frontend.** It is shadcn registry output so it
cannot be hand-edited (and must not be deleted casually), but nothing in the new design may
import it. Same for any `rounded-lg` / `shadow-*` left in the old blocks — they are the
tell that a surface has not been migrated yet.

### Summary

| | Primitive | Uses | New? |
|---|---|---|---|
| 1 | `Slab` | 8 | new |
| 2 | `SectionHeader` (+ `action`) | 9 | rewrite |
| 3 | `TradeList` (+ `tags`, `layout`, `columns=4`, `numbered`) | 6 surfaces | new |
| 4 | `FactList` | 12 | new |
| 5 | `DuoPhoto` | 35 | new |
| 6 | `RuleLink` | 12 | **omitted by handoff** |
| 7 | `Tag` | 52 | **omitted by handoff** |
| 8 | `Chip` | 18 | **omitted by handoff** |
| 9 | `PhoneLink` | 6 + all `Button phone` | **omitted by handoff** |
| 10 | `Breadcrumb` | 4 | **omitted by handoff** |
| 11 | `PageHero` | 7 | **omitted by handoff** |
| 12 | `ProjectCard` | 16 | rewrite |
| 13 | `ActionRow` | ~25 | **omitted by handoff** |
| — | `.hairline-grid` (CSS) | 12 | new utility |

Build 1–10 first (they are leaves), then 11–13 (compositions of them), then blocks.

---

## 4. Layout

### 4.1 Header — `src/domains/layout/header/`

Visual truth: artboard 01. Proposal: `reference-tsx/layout/header/`.

- Wrapper `border-b border-border bg-background`, **no shadow**, `container`,
  `h-16 md:h-[92px]`.
- `<Logo size={40} />` desktop / `28` mobile, linking to `/`.
- Desktop nav from `header.navItems`: 15 px / 500, `gap-6`; active =
  `border-b-2 border-accent text-accent`, inactive = `border-transparent` (so nothing
  jumps). Activity from `usePathname()` vs the link target — use the `hrefOf` helper from
  the proposal; `getCachedGlobal('header', 1, …)` already passes `depth: 1`, so
  `reference.value.slug` is populated.
- Right: `<PhoneLink>` as `<Button variant="outline" phone>` + `<Button variant="accent">Poptávka</Button>`.
- Mobile: a 44 px phone icon with `border-accent` **beside** the hamburger — the phone
  never collapses into the menu. Menu is a full-width panel under the header (**not** the
  current floating `rounded-lg … shadow-lg` card): rows `min-h-14`, 17 px / 600,
  `border-b border-border`, then an `<ActionRow full>` and the line „Nemáme pevnou
  pracovní dobu — jsme tu pro vás stále." Closes on click, Escape and outside click
  (`useClickOutside` already exists and is already wired).
- **Remove the search icon** (`SearchIcon` → `/search`). If `/search` survives, it belongs
  in the footer.
- Replace `appearance="link"` on the nav `CMSLink`s with `appearance="inline"` + the
  active-rule classes — `link` maps to the `quiet` button variant, which is not a nav item.

### 4.2 Footer — `src/domains/layout/footer/Component.tsx`

Visual truth: artboard 08. Proposal: `reference-tsx/layout/footer/`.

- `bg-[oklch(0.185_0.008_250)]` + `dark:bg-card`, white text — **dark ink, not a third
  slab.** Today it is `bg-black`; that is the wrong ground.
- Desktop: `md:grid-cols-[1.4fr_1fr_1fr_1.1fr]`, `gap-10`, `pt-14 pb-7`.
  Brand + one sentence | Služby | Firma | Kontakt. Column heads = `.eyebrow` in
  `oklch(0.72 0.008 250)`.
- **The Služby column comes from the `services` collection, not `navItems`** — the footer
  must never lag behind the offering. New query
  `src/domains/services/queries/getServicesForNav.ts` (`unstable_cache`, key
  `['services-nav', locale]`, tag `collection_services`, `sort: 'order'`, `depth: 0`,
  `select: { title, slug }`, `where: { _status: { equals: 'published' } }`).
  Then add `revalidateTag('collection_services')` to `revalidateServicePaths()` in
  `src/domains/services/hooks/revalidateService.ts` — next to the existing
  `revalidateTag('services-sitemap', 'max')`.
  Export from `@/domains/services` (cross-domain imports go through the domain entry point
  — ESLint enforces this).
- Firma column from `footer.navItems`.
- `<PhoneLink tone="footer">` is the **only coloured element**: `oklch(0.735 0.105 228)`.
- Legal line: `border-t` `oklch(1 0 0/.16)`, 13 px; left
  `© year — legalName — plátce DPH — sídlo <registeredSeat>`, right the privacy link.
  Composed from the `company` global — **never constants, and IČO only once it is actually
  in the CMS** (rule 9).
- Mobile: brand, phone at 24 px, links as hairline rows, then address and legal lines.
- **Drop `ThemeSelector`.** The dark theme stays in CSS; the toggle goes.
  ⚠ `globals.css` ends with `html { opacity: 0 }` unset only once `data-theme` is on the
  root. `InitTheme` is what sets it and it **must stay mounted** in
  `(frontend)/layout.tsx` — removing the theme system wholesale would leave the site
  blank. Drop the selector, keep the initialiser.

### 4.3 MobileBar — `src/domains/layout/MobileBar.tsx` (new)

`fixed inset-x-0 bottom-0 z-30`, `border-t border-border`, `bg-background/95 backdrop-blur`,
`px-5 py-3`, two `flex-1` buttons — `accent` „Poptávka" and `ink` „Zavolat"
(`<PhoneLink>`). `md:hidden`.

Mount in `src/app/(frontend)/(cs)/layout.tsx` **and** `src/app/(frontend)/en/layout.tsx`
after `<Footer />` (the root `(frontend)/layout.tsx` renders neither Header nor Footer —
the locale layouts do). Give `<body>` `pb-[68px] md:pb-0`. Export from `@/domains/layout`.

---

## 5. The block library, seen as skeletons

Before the block-by-block list: **the artboards contain 69 `border-top: 1px solid
var(--border)` rows and 7 slab rows.** Ten different surfaces are the same skeleton with
different column counts and slots. Building them as ten bespoke grids is how a hi-fi
rebuild ends up 4 px off in six places.

| Surface | Artboard | Rendered by |
|---|---|---|
| Homepage trades, 3-col | 02 | `TradeList columns={3}` |
| Process steps, 4-col, on slab | 02 | `TradeList columns={4} onSlab headingAs="h4"` |
| „Rozsah práce" spec groups, 2-col + tags | 03 | `TradeList columns={2}` + `item.tags` |
| Services index, wide rows | 09 | `TradeList layout="row" headingAs="h2"` |
| „Často navazuje", 3-col | 03 | `TradeList columns={3} numbered={false}` |
| „Kombinace řemesel", 3-col, on slab | 09 | `TradeList columns={3} numbered={false} onSlab` |
| Facts, label → value | 02·03·05·06·07·09 | `FactList` |
| Footer mobile nav | 08 | plain rows — `<nav>` semantics, not a list of trades |
| Header mobile menu | 01 | plain rows — same reason |
| FAQ | 07 | `Accordion` — interactive, not a static row |
| Wizard step rail | 06 | `<ol>` — stateful, not a static row |

**Four blocks collapse onto `TradeList`**: `servicesGrid`, `process`, `featureGrid` and the
new `relatedServices`. They become thin data-mappers, not layout code. That is the single
biggest simplification available in this redesign, and it is invisible in the handoff
because the handoff describes appearance, not composition.

Likewise **`DuoPhoto` (35) + `.hairline-grid`** is the whole of `photoStrip`,
`mediaBlock`, `gallery` and the project hero; and **`PageHero` (7)** is the whole of five
page shells.

---

## 6. Blocks, one by one

Ordering follows the handoff's Step 3 — homepage, service detail, projects, contact, about.

**Schema discipline:** Postgres block fields are real columns/tables, so **batch the schema
changes into two `pnpm payload migrate:create` runs** (checkpoints A and B) rather than one
per block. After each: `pnpm generate:types`.

### A. Homepage — artboard 02

#### A1. Hero (`hero` group, not a block) — `src/domains/pages/heros/`

**Do not change the `type` enum** — a Postgres enum change is the most expensive migration
here for no design gain. Rewrite the three components onto `PageHero` (§3.11):

- `lowImpact` → `PageHero` alone (the default for pages).
- `mediumImpact` → `PageHero` + a full-bleed photo strip below.
- `highImpact` → `PageHero` over a `DuoPhoto` (duotone, `priority`). Drop the
  `-mt-[10.4rem]` overlap and the `setHeaderTheme('dark')` hack — the new header is a
  hairline on `bg-background` and never sits on the hero.

**Schema:** add `eyebrow` (text) and `facts` (array of `label` + `value`) to the `hero`
group in `heros/config.ts`. `media` is currently `required: true`, which is wrong for
`lowImpact` — make it conditional-optional.

#### A2. `servicesGrid` → `TradeList` — `src/domains/services/blocks/ServicesGrid/`

Artboards 02 (3-column trades) and 09 (wide rows).
Map `getServices()` → `TradeList` items: `title`, `shortDescription` → `text`,
`/sluzby/<slug>` → `href`, `service.highlights[].text` → `tags`, the realizace count →
`meta` (linking to `/realizace/sluzba/<slug>`).

**Schema:** `layout: 'trades' | 'rows'` (default `trades`), `columns: '2' | '3'`
(shown only for `trades`).
The counts need a query — one `projects` find with `depth: 0, select: { services: true }`
and count in JS beats six `payload.count` calls. Share the helper with C1.

`ServiceCard.tsx` (rounded card + icon + arrow) becomes dead — delete it.

#### A3. `process` → `TradeList` on a slab — `src/domains/pages/blocks/Process/`

Desktop: `<Slab pad="lg">` + `SectionHeader align="split" onSlab` +
`TradeList columns={4} onSlab headingAs="h4" showLinks={false}`.
Mobile (artboard 02 mobile): `<Slab pad="sm">` + `SectionHeader onSlab` +
`<FactList onSlab />` of `01 → „Poptávka — ozveme se týž den"` rows.

**Schema:** `variant: 'slab' | 'plain'` (default `slab`) — a page may already have two
slabs, and `plain` renders the same rows on `bg-background`.

#### A4. `projectShowcase` → `ProjectCard` grid — `src/domains/projects/blocks/ProjectShowcase/`

`SectionHeader action={<RuleLink>Všechny realizace</RuleLink>}` + `md:grid-cols-3 gap-8`
of `ProjectCard` (§3.12).
**Schema:** none — `links` (linkGroup) already exists; feed its first entry into the
header's `action` slot as a `RuleLink`, not a button.

#### A5. `brands` → hairline marquee — `src/domains/pages/blocks/Brands/`

`.eyebrow` „Pracujeme s materiály", then `border-y border-border`, `py-[30px]` /
`py-[22px]` mobile, `overflow-hidden`. Names as text: 19 px / 500 / `tracking-[.08em]` in
`oklch(0.42 0.008 250)` — the artboards use no logos.
`InfiniteSlider` with `speed={reduce ? 0 : 40}`; keep the existing `sr-only` plain list.
**Schema:** none.

#### A6. `cta` → the closing ask — `src/domains/pages/blocks/CallToAction/`

- **plain** (02, 09): centred, `py-24`, `h2` `max-w-[26ch]`, lead 17 px muted
  `max-w-[42ch]`, `<ActionRow size="lg">`. Centring is the block's own
  `items-center text-center`, not `SectionHeader`.
- **slab** (03, 04, 07 — 3 uses of `grid-cols-[minmax(0,1fr)_auto]`): inside
  `<Slab pad="md">`, text left, `<ActionRow onSlab>` right, `gap-14 items-center`.

**Schema:** `variant: 'plain' | 'slab'` (default `plain`). Keep `richText` + `links` —
richText already carries the `h2` + lead. Drop the `rounded border bg-card` box entirely.

---

**Migration checkpoint A** — `hero.eyebrow`, `hero.facts`, `servicesGrid.layout`,
`servicesGrid.columns`, `process.variant`, `cta.variant`.
`pnpm payload migrate:create redesign-homepage-blocks`.

---

### B. Service detail — artboard 03

#### B1. `ServicePage` — `src/domains/services/pages/ServicePage.tsx`

`Breadcrumb` → `PageHero rail="md"` with `FactList` → full-bleed 2-up `DuoPhoto` on
`.hairline-grid`. **Stop rendering `service.highlights` as hero bullets** — the design
replaced bullets with spec groups, and the highlights text is reused as `Tag`s (A2, B2).

#### B2. `featureGrid` → „Rozsah práce" via `TradeList` — `src/domains/pages/blocks/FeatureGrid/`

`SectionHeader` + `TradeList columns={2} showLinks={false}` with `item.tags` rendered as
`<Tag tone="muted">`.
**Schema:** add `tags` (array of `{ label: text }`) to `items`. **Stop rendering `icon`**
(rule 8). Leave the `icon` field in the schema — dropping a select column is a destructive
migration for zero visual gain — and hide it with `admin.hidden`.

#### B3. `relatedServices` → „Často navazuje" / „Kombinace řemesel" (new block)

`border-t` + `grid-cols-[22ch_minmax(0,1fr)] gap-14`: an `.eyebrow` + a 15 px muted
sentence left, `TradeList columns={3} numbered={false}` right. The artboard-09 variant is
the same content inside a `<Slab>` with `SectionHeader align="split" onSlab`, collapsing on
mobile to `<FactList onSlab />`.

**New block** `src/domains/services/blocks/RelatedServices/`. Fields:
`sectionHeaderFields()`, `variant: 'plain' | 'slab'`, `items` array of
`{ service: relationship→services, note: text }`. Register in `src/payload/blocks/index.ts`
(add to `marketing` and explicitly to `serviceLayoutBlocks`) and in `RenderBlocks.tsx`.

#### B4. `photoStrip` (new block) — `DuoPhoto` × `.hairline-grid`

The full-bleed row on artboards 02 (3-up), 03 (2-up), 09 (3-up).
**New block** `src/domains/pages/blocks/PhotoStrip/`. Fields:
`source: 'latest' | 'featured' | 'service' | 'manual'`, `service` (conditional),
`limit: 2 | 3`, `items` (array of `{ image, eyebrow, title }` for `manual`),
`plain` (default true — duotone only on slabs).
Renders bare (no `.container`) so it bleeds.

---

**Migration checkpoint B** — `featureGrid.items.tags`, new `relatedServices`, new
`photoStrip`. `pnpm payload migrate:create redesign-service-blocks`.

---

### C. Projects — artboards 04 and 05

#### C1. `ProjectsArchivePage`

`PageHero` (no rail) → filter row of `<Chip>` (§3.8) with counts, „VŠE (18)" carrying the
total → `md:grid-cols-3 gap-y-9 gap-x-8` of `ProjectCard` → a `<Slab pad="md">` CTA (the
page's only slab).
The filter is already links — keep that; only the styling changes (**square `Chip`, not
`rounded-full` pills**). Mobile: same row, horizontally scrollable, hairline under it.
Empty state stays prose, in the new hairline treatment, and must still name the trade that
came up empty.

The same component serves `/realizace` and `/realizace/sluzba/[slug]`.

#### C2. `ProjectPage`

`Breadcrumb` → `PageHero` → full-bleed hero `DuoPhoto` (`plain`, `priority`, ~`16/6`) →
`md:grid-cols-[minmax(0,1fr)_400px] gap-20`:

- Left: „Průběh" `h2` and the story (`project.layout` → `content` block), then „Před a po"
  (`ImageComparison`, or two `DuoPhoto`s on `.hairline-grid`).
- Right rail: `FactList` from `location` + `completedAt` + `project.facts`; „Řemesla na
  této realizaci" as `<Chip href>`; a hairline mini-CTA („Máte podobný dům?") with
  `<ActionRow full>`.

Then „Další realizace" — `SectionHeader action={<RuleLink>Zpět na přehled</RuleLink>}` and
3 × `ProjectCard variant="caption"`. Needs an `excludeId` option on
`src/domains/projects/queries/getProjects.ts`.

Delete the `rounded-lg border bg-card` facts panel and the `rounded-full` service pills.

### D. Contact — artboard 06

#### D1. `contactDetails`

`grid-cols-[minmax(0,1fr)_420px] gap-20`: left the `h1`/lead plus
**`<PhoneLink size="lg">` as the largest element on the page** (44 px / 500 /
`tracking-[-0.02em]`, accent, tabular) and `<ActionRow size="lg">`; right a `FactList` from
the `company` global.
Below, full-bleed: the map panel (`border-y border-border`,
`grid-cols-[minmax(0,1fr)_420px]`) — a schematic inline SVG with an accent pin plus a
`bg-card border-border` callout naming the office, and a right column of „Kde pracujeme" /
„Kdy voláte" / the phone again.

**Schema:** add `showBigPhone` (default true) and `showMap` (default false) to the existing
toggle collapsible. The map is inline SVG — no third-party map, no tracking, no API key;
the address and `office.mapUrl` come from the `company` global.
**Drop the lucide icons** from the rows (rule 8) — the `FactList` label already says what
each row is.

#### D2. `inquiry` — the four-step wizard (new block, client)

The largest single piece of work in the redesign.

- Left rail 220 px: `<ol>` of four steps on hairlines, `01–04` at 12 px / 500, the current
  step's number **and its top rule** in `--accent`.
- Right: „Krok 01 ze 4" eyebrow in accent, `h3`, helper text, step body.
  Step 1 = multi-select `<Chip>` over `getServices()` plus „Nevím, poraďte".
  Step 2 = place and timing. Step 3 = free text + photo upload. Step 4 = contact details.
- Each step footer: `border-t pt-6`, „Pokračovat" (`accent`) and beside it „Nebo hned
  zavolejte — `<PhoneLink size="inline">`". **The phone stays available in every step —
  the wizard must never be the only path.**
- Mobile: „Zpět"/„Pokračovat" pair and a 4-segment 2 px progress bar.
- Progress in local state (or `?krok=`); **validate on step submit, not per keystroke.**

Build on the existing forms domain (`src/domains/forms/`,
`@payloadcms/plugin-form-builder`) — the wizard is a presentation layer over one form
document, submitting once at step 4. The service chips come from `getServices()`, not form
fields, so the list can never drift from the offering.

**New block** `src/domains/forms/blocks/Inquiry/`. Register in `conversion`.

### E. About and FAQ — artboard 07

#### E1. `textWithImage`

Artboard 07's photo + „Jak pracujeme" panel: full-bleed
`.hairline-grid grid-cols-[1.3fr_1fr]`, a `DuoPhoto` one side and a `bg-card px-[34px]
py-9` text panel the other. No `rounded-lg`, no `aspect-[4/3]` box.
**Schema:** add `duotone` (default false) and `fullBleed` (default true); `imagePosition`
already exists.

#### E2. `faq`

`grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-20 items-start`: `SectionHeader` left,
accordion right. Items `border-t py-6` (last also `border-b`), question `h3` 20 px, answer
16 px / 1.75 muted `max-w-[60ch]`.
Indicator is a **`+` / `−` glyph** at 18 px (accent open, muted closed) — not a rotating
chevron, not a card. Keep `src/shared/ui/motion/accordion.tsx`.
**Schema:** `defaultOpenFirst` (default true) — the artboard shows the first item open,
which is what makes the section readable at a glance.

#### E3. `facts` (new block)

`/o-nas` and `/kontakt` need an authorable `FactList`; no block renders one today.
**New block** `src/domains/pages/blocks/Facts/`. Fields: `sectionHeaderFields()`, `items`
array of `{ label, value }`, `onSlab`, plus `autoFromCompany` — fills rows from the
`company` global (`foundedYear`, `serviceArea`, `legalName`, `vatPayer`) so the client
edits facts in one place.

### F. Blocks the artboards do not draw

#### F1. `stats` — the counters stay (client decision, 2026-09-06)

The design brief says „no blown-up numbers" and motion house rule 7 says *no animation on
tabular data*. **The client has overridden both for this block:** the homepage keeps its
two animated counters (`33 let v oboru`, `6 řemesel`). Recorded here so a future agent does
not "fix" it back to a `FactList`.

Keep the block, `AnimatedNumber`, `useInView` and — importantly — the `useIsClient` guard
that already renders the real number server-side (`ee3c311`), so a crawler or a reader
without JavaScript sees `33`, never `0`.

Three things to change anyway:

1. **Add a `prefers-reduced-motion` guard.** The current `Stat` component has none — it
   animates unconditionally. `const reduce = useReducedMotion()` from `motion/react`, and
   render the plain `tabular-nums` number when it is true. This is not a style question;
   it is the one accessibility rule the motion skill states without exception.
2. **Tabular figures on the number** (`.tabular`), so the digits do not jitter mid-count.
3. **Do not say the same fact twice.** The new `PageHero` carries a `FactList` rail, and on
   the homepage the artboard puts `let v oboru / řemesel / kde / kancelář / pracovní doba`
   in it. With the counters staying, the homepage hero rail should carry only
   `kde / kancelář / pracovní doba` and leave `33` and `6` to this block.

Everything else about the block already fits the token layer — there is no card, no radius
and no shadow to strip.

#### F2. `testimonials` — restyle, keep

Not drawn, but plausibly wanted. Hairline rows or a 2-up of `border-t` quotes, 16 px /
1.75, attribution 14 px — **no `rounded-lg border bg-card`**. Low priority.

#### F3. `content`, `mediaBlock`, `gallery`, `beforeAfter`, `archive`, `formBlock`

Restyle pass only, no schema change:

- `content` — drop its own `my-16`, keep the 12-column grid and prose.
- `mediaBlock` / `gallery` — `.hairline-grid` instead of rounded boxes; `DuoPhoto` where
  the media is project photography; `MorphingDialog` lightbox (§7).
- `beforeAfter` — keep `image-comparison.tsx`; strip rounding and shadow, add the
  „Před / Po" eyebrows from artboard 05.
- `archive` (posts) — hairline rows; posts are secondary here.
- `formBlock` — inputs at 3 px radius, `border-input`, no `rounded-lg`; focus ring
  `outline-2 outline-ring outline-offset-2` — **never remove it**.

---

## 7. Motion — how it stays buttery without breaking the design

The handoff's interaction section is short and restrictive: *150 ms on `color`,
`background-color`, `border-color`; **nothing scales, nothing shifts**; do not remove the
focus ring.* That sentence is scoped to **hover** — entrance reveals are a different
budget — but it sets the tone: this is a builder's site, and motion has to read as
*solid*, not *showy* (motion house rule 1).

### 7.1 The baseline — 90 % of the "smooth" is CSS

Every interactive atom carries
`transition-[color,background-color,border-color] duration-150`. `button.tsx` already does;
`RuleLink`, `Tag`, `Chip`, `PhoneLink`, nav links and `TradeList` rows must too. Get this
right and the site already feels finished before a single JS animation exists.
**No `transition-all`** — it animates layout properties and thrashes.

### 7.2 The signature move: the hairline draws in

The design is hairlines and blueprints. The one motion idea worth owning is the rule
**drawing itself left-to-right** as a row enters: `scaleX: 0 → 1`,
`transform-origin: left`, 320 ms `easeOut`, staggered 60 ms down the list, with the row's
content fading in behind it (`opacity 0→1`, `y: 8→0`).

Transform + opacity only — no layout thrash (house rule 6). Implementation note: **you
cannot transform a `border-top`.** The row renders

```tsx
<span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-border" />
```

and motion animates that span's `scaleX`. Under `prefers-reduced-motion` it simply renders
at `scaleX: 1`. Build it once inside `TradeList` and `FactList` and every one of the ten
hairline surfaces inherits it.

### 7.3 Inventory, surface by surface

| Surface | Motion | Mechanism | Budget |
|---|---|---|---|
| `PageHero` text | fade + `y: 6` | CSS or `InView` | 400 ms |
| `PageHero` / project hero photo | **none** — it is the LCP | — | 0 |
| `TradeList` rows | hairline draw + content fade, stagger 60 ms | `AnimatedGroup`, custom variants | 320 ms/row |
| `FactList` rows | same, stagger 40 ms | same | 240 ms |
| `DuoPhoto` below the fold | `opacity 0→1` only — **no scale, no hover zoom** | `InView` | 400 ms |
| `ProjectCard` grid | fade as part of the grid stagger | `AnimatedGroup preset="fade"` | 300 ms |
| `ProjectCard` hover | border-color + title colour only | CSS | 150 ms |
| `Slab` | **none** — fading a full-bleed colour block reads as a flash | — | 0 |
| `brands` marquee | `speed={reduce ? 0 : 40}` | `InfiniteSlider` | continuous |
| `faq` | spring `{stiffness: 200, damping: 24}`, `+`↔`−` crossfade | `accordion.tsx` | ~300 ms |
| before / after | drag slider | `ImageComparison` | — |
| `gallery` | lightbox morphing from the thumbnail | `MorphingDialog` | 300 ms |
| inquiry wizard steps | cross-fade + x-slide, no height jump | **`transition-panel`** (install) | 250 ms |
| mobile menu | height + opacity reveal instead of pop | **`disclosure`** (install) | 200 ms |
| **projects filter → grid** | **cross-fade across navigation** | `<ViewTransition>` (§7.5) | 250 ms |
| `stats` counters | count-up on first scroll-in — **approved exception** (§6.F1) | `AnimatedNumber` + `useInView` | ~1400 ms |
| phone numbers, prices, addresses | **none, ever** | — | 0 |

### 7.4 Explicitly banned by this design

`Tilt`, `Spotlight`, `BorderTrail`, `TextEffect` on headings, `ScrollProgress` (outside
`/posts`), parallax, hover `scale`/`translate`, and any `transition-all`. All of them exist
in `src/shared/ui/motion/` and all of them contradict either "nothing scales, nothing
shifts", rule 2 (no cards to tilt) or motion house rule 1. Leave the files installed; just
never import them here.

`AnimatedNumber` is the **single sanctioned exception**, in the `stats` block only, by
client decision (§6.F1) — and only with a `useReducedMotion()` guard.

### 7.5 The highest-leverage change: View Transitions on the projects filter

The design deliberately made the projects filter **links, not state** — every chip click is
a real navigation. Without a transition that is a white flash on every filter, which is the
one place this site will feel *worse* than a client-side version.

Next 16.2 + React 19.2 support this directly:

```ts
// next.config.ts
const nextConfig: NextConfig = { experimental: { viewTransition: true }, /* … */ }
```

```tsx
import { ViewTransition } from 'react'
// wrap the results grid in ProjectsArchivePage
<ViewTransition name="realizace-grid">{grid}</ViewTransition>
```

The chips are `next/link`, so App Router already prefetches the filtered routes on hover —
the navigation is usually instant, and the cross-fade covers the rest. Guard the whole
thing with `prefers-reduced-motion` (the CSS `::view-transition-*` pseudo-elements accept a
reduced-motion media query).

Verify against the live docs before wiring it (`nextjs-docs` MCP:
`config/next-config-js/viewTransition`) — it is behind `experimental`, so treat it as
opt-in polish that can be dropped if it destabilises the build.

### 7.6 Two motion-primitives to install

```bash
pnpm dlx shadcn@latest add @motion-primitives/transition-panel
pnpm dlx shadcn@latest add @motion-primitives/disclosure
```

If the registry returns **HTTP 429**, use the GitHub fallback documented in the `motion`
skill, then apply the React 19 / motion 13 fixups it lists (`keyof React.JSX.IntrinsicElements
& string`, `motion.create` cast + `useMemo`, `RefObject<T | null>`, `cloneElement` props).
`npx tsc --noEmit && pnpm lint` must be clean afterwards.

### 7.7 Performance is part of "smooth"

- LCP is the hero image or the hero `h1`. **Never animate it in.** `<Media priority />`
  with correct `sizes`.
- Zero CLS: every `DuoPhoto` — including `pending` — carries the same `aspectRatio`.
- Keep `'use client'` at the leaves. `AnimatedGroup` around a server-rendered list is fine;
  marking a page `'use client'` to get one reveal is not.
- `will-change` only on elements actually mid-animation; the marquee is the only
  continuously animating element on the site.

---

## 8. Content and routes

1. Create `pages` documents: **`/kontakt`**, **`/o-nas`**, **`/ochrana-osobnich-udaju`**.
   `/kontakt` = hero + `contactDetails` (`showBigPhone`, `showMap`) + `inquiry`.
   `/o-nas` = hero with facts + `photoStrip` + `textWithImage` + `faq` + slab `cta`.
2. **Header nav — decided (2026-09-06): five items, FAQ is an anchor.**
   Služby `/sluzby` · Realizace `/realizace` · O nás `/o-nas` ·
   Časté dotazy **`/o-nas#caste-dotazy`** · Kontakt `/kontakt`.
   Fix the current `/contact` → `/kontakt` and update `scripts/populate-content.ts`
   alongside the global so a fresh clone lands on the same nav.

   The anchor needs three things to actually work:
   - an `anchor` (text) field on the `faq` block, rendered as the section's `id`
     (§6.E2 schema change — fold it into migration B);
   - `scroll-mt-24 md:scroll-mt-32` on that section so the heading is not flush to the
     viewport top after the jump;
   - `html { scroll-behavior: smooth }` guarded by
     `@media (prefers-reduced-motion: no-preference)`.

   `localizeHref('/o-nas#caste-dotazy', 'en')` → `/en/o-nas#caste-dotazy` — the hash rides
   along correctly, no change needed there. **But see the bug in §11.2.**
3. Footer global `navItems` = the Firma column. The Služby column is the collection.
4. **Invariant:** a `cs` page slugged `en` is shadowed by the `/en` subtree — none of the
   new slugs collide.
5. No content field is `localized: true` today, so `/en` serves `cs` values by fallback.
   Nothing here changes that; use `localizeHref` / `LocalizedLink` and the plumbing keeps
   working.

---

## 9. Order of work

| # | Step | Gate |
|---|---|---|
| 0 | Foundation | **done** (`f0411b8`) — keep the repo's `favicon.svg` |
| 1 | `.hairline-grid` utility + primitives §3.1–3.10 (leaves) | `npx tsc --noEmit` |
| 2 | Composites §3.11–3.13 — `PageHero`, `ProjectCard`, `ActionRow` | typecheck |
| 3 | Rhythm §2 — `RenderBlocks` stops wrapping | site spacing shifts; expected |
| 4 | Layout §4 — Header, Footer + `getServicesForNav` + revalidate tag, MobileBar | both themes, both locales |
| 5 | Motion baseline §7.1–7.2 — transitions + the hairline draw inside `TradeList`/`FactList` | reduced-motion check |
| 6 | Homepage §6.A → **migration A** | artboard 02 |
| 7 | Service detail §6.B → **migration B** | artboards 03, 09 |
| 8 | Projects §6.C + View Transitions §7.5 | artboards 04, 05 |
| 9 | Contact §6.D — `contactDetails`, `inquiry` (+ `transition-panel`) | artboard 06 |
| 10 | About §6.E | artboard 07 |
| 11 | Leftovers §6.F, content/routes §8, skill refresh §10 | full pass, both themes |

**Definition of done after every step** (AGENTS.md): `pnpm generate:types` if the schema
changed → `pnpm generate:importmap` if admin component paths moved → `npx tsc --noEmit` →
`pnpm lint` → `pnpm build`. Zero new errors or warnings.
Watch `pnpm-workspace.yaml` — `pnpm add` rewrites its `allowBuilds:` block to placeholders;
check `git diff` and revert if it happened.

---

## 10. `.claude/skills/frontend-design/SKILL.md` is stale — refresh it

The skill still describes the *pre-redesign* system, and every future agent reads it before
touching UI. Concretely wrong today:

| Says | Actually |
|---|---|
| „Geist Sans / Geist Mono via `--font-sans` / `--font-mono`" | IBM Plex Sans only; `--font-mono` is an alias |
| „`rounded-lg` = `--radius` (0.625rem)" | `--radius` is `0.1875rem`; `rounded-lg` is 0.25rem |
| „`RenderBlocks` already wraps each block in `my-16` — don't double up" | it will not, after §2 |
| „dark mode … toggled by `ThemeSelector`" | the selector is being dropped (`InitTheme` stays) |
| „Services — 3–6 cards … Icon or photo" | `TradeList` on hairlines; rule 2 forbids cards, rule 8 forbids decorative icons |
| „Base `@layer base` deliberately unsets heading font-size" | `globals.css` now sets the h1–h4 scale |
| „`bg-primary text-primary-foreground` for the main CTA" | `Button variant="accent"`, once per screen |
| „sections separated by `py-16` / `py-24`+" | `py-14 md:py-[104px]` |

Add: the nine system rules, the thirteen primitives, the `Chip`/`Tag`/`RuleLink`/`PhoneLink`
vocabulary, and „never import `shared/ui/card.tsx`".
Do this in step 11, once the vocabulary has actually settled in code — a skill rewritten
against a plan rather than against the built system is how the next drift starts.

---

## 11. Decisions taken, and what is still open

### Decided

1. **The `stats` counters stay** (2026-09-06). Overrides „no blown-up numbers" and motion
   house rule 7 for that one block. Add the missing reduced-motion guard; keep the
   server-rendered real number. (§6.F1)
2. **„Časté dotazy" is an anchor into `/o-nas`**, not its own page (2026-09-06). Five menu
   items; the FAQ block gains an `anchor` field. (§8.2)

### Open — needs fixing, not deciding

3. **`CMSLink` never localises custom URLs.** In
   `src/shared/components/Link/index.tsx:64` the locale prefix is applied only to
   `type: 'reference'` links:

   ```ts
   const href = internalHref ? localize(internalHref) : url
   ```

   Every nav item in the header and footer globals is `type: 'custom'`, so **on `/en` the
   whole navigation links back into the Czech routes.** This is a live bug today, not
   something the redesign introduces, and it sits directly in the path of the nav rework —
   fix it in step 4: run `localize()` on any `url` that starts with `/` (leave `http…`,
   `tel:` and `mailto:` alone).

### Still open

4. **The inquiry wizard** is a genuine feature, not a restyle. It is the one item that
   could ship in a second pass — `/kontakt` works with phone + `formBlock` until then.
5. **View Transitions** are behind `experimental` in Next 16. High payoff for a
   link-driven filter, but droppable if it destabilises the build. (§7.5)
6. **Photography.** Only real Payload media ships. Until the client's photos are in,
   `DuoPhoto pending` holds every grid — the site will look sparse, and stock is never a
   substitute (README, rule 9).
7. **IČO** is not in the CMS yet. The footer's legal line omits it until it is.
8. **Two-slab budget.** `process`, `cta`, `relatedServices` and the projects archive can
   each render a slab. Nothing enforces the ceiling at build time; it needs a per-page
   review.
9. **`html { opacity: 0 }`** in `globals.css` is unset only when `data-theme` lands on the
   root. Dropping `ThemeSelector` is safe; dropping `InitTheme` would blank the site.
