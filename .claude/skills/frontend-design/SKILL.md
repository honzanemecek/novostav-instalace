---
name: frontend-design
description: Use when designing or building any user-facing UI in this repo - pages, sections, heroes, cards, forms, navigation, layout, typography, spacing, colour, responsive behaviour, empty/loading/error states, or accessibility. Read before writing frontend markup, not after, and when reviewing a page that "looks off".
---

# Frontend design for novostav-instalace.cz

Presentation site for a Czech plumbing / heating / gas installation company
(instalatérství, topení, plyn) working on new builds and renovations. The audience is
homeowners, developers and builders — mostly on phones, often comparing two or three
local firms. The job of every page is to answer *can these people do my job, have they
done it before, and how do I reach them*.

Design target: **credible, calm, competent.** Not a SaaS landing page, not a brochure
from 2011. Restrained motion, generous whitespace, real photography, no stock imagery of
smiling people in hard hats.

## Non-negotiables

1. **Mobile first.** Design the 375px view before the 1440px one. Test at 375, 768, 1024,
   1440.
2. **Phone number and contact are always one tap away** — header, hero, footer, and the
   end of every service section.
3. **Real photos of real work.** The `old_website_photos/` directory is the source
   material. A before/after (`ImageComparison`) beats a paragraph.
4. **Czech copy is the primary copy.** English is a mutation, not the design driver.
   Czech runs ~10–15% longer than English — never design a layout that only fits the
   English string. Watch for diacritics clipping in tight line-heights.
5. **Accessible by default**: semantic landmarks, one `<h1>` per page, visible focus
   rings (`outline-ring/50` is already global), 4.5:1 text contrast, `alt` on every
   meaningful image, ≥44px touch targets.
6. **No layout shift.** Every image gets explicit dimensions or an aspect-ratio wrapper.

## Use the token system, never literals

All colour, radius and font tokens live in `src/app/(frontend)/globals.css` — see the
`shadcn` skill for how the layers work. In components:

- `bg-background` / `text-foreground` for the page surface
- `bg-card` / `text-card-foreground` for raised surfaces (this project's `--card` is
  deliberately tinted in light mode — use it, don't fake it with `bg-gray-50`)
- `text-muted-foreground` for secondary text
- `border-border`, `ring-ring`, `bg-primary text-primary-foreground` for the main CTA
- `--success` / `--warning` / `--error` for state
- `rounded-lg` = `--radius` (0.625rem). Stay on the radius scale.

`bg-[#f5f5f5]`, `text-gray-700`, inline `style={{ color }}` — all wrong. They break dark
mode, which this site ships (`[data-theme='dark']`, toggled by `ThemeSelector`).
**Check every new screen in both themes before calling it done.**

## Layout

- Use the project's `.container` utility (defined per breakpoint in `globals.css`), not
  ad-hoc `max-w-*` + `mx-auto`.
- The 12-column grid classes that are safelisted are `lg:col-span-{4,6,8,12}` — the
  Content block builds on those. Any other dynamic span must be added to
  `@source inline(...)`.
- Vertical rhythm: sections separated by `py-16` on mobile, `py-24`+ on desktop.
  `RenderBlocks` already wraps each block in `my-16` — don't double up.
- Prefer `flex`/`grid` with `gap-*` over margins on children.

## Typography

Geist Sans / Geist Mono via `--font-sans` / `--font-mono`. `@tailwindcss/typography` is
installed and the `prose` sizes are tuned in `tailwind.config.mjs` (h1 2.5rem → 3.5rem at
`md`). Base `@layer base` deliberately **unsets** heading font-size/weight, so headings
get their size from utilities or `prose` — never assume a bare `<h2>` is styled.

- One idea per heading; Czech headings are long, so cap at ~60 characters.
- Body copy `max-w-prose`. Long lines are the fastest way to make a site feel amateur.
- Numbers that matter (years in business, jobs completed, response time) deserve
  typographic weight — that's what `AnimatedNumber` is for.

## Page anatomy that works for this business

A service page or the homepage generally wants, in order:

1. **Hero** — what they do, where, and a phone/contact CTA. One sentence, one button.
2. **Services** — 3–6 cards: voda / topení / plyn / rekonstrukce. Icon or photo, name,
   one line, link.
3. **Proof** — before/after slider, project gallery (`MorphingDialog` lightbox), or a
   counted stat row.
4. **Process** — 3–4 numbered steps (poptávka → návrh → realizace → servis). Removes the
   biggest customer anxiety: not knowing how it goes.
5. **Trust** — certifications, brands installed (`InfiniteSlider`), service area, IČO.
6. **FAQ** — `Accordion`, real questions about price, timeline, warranty.
7. **Contact** — form (forms domain) plus phone, e-mail, address, map link.

Don't ship a section with no content behind it. An empty "Reference" section is worse
than none.

## Components before custom markup

Order of preference, always:

1. An existing block in `src/domains/pages/blocks/` or `posts/blocks/`.
2. A shadcn primitive from `@/shared/ui` (add via CLI if missing — see the `shadcn` skill).
3. A motion-primitive from `@/shared/ui/motion` (see the `motion` skill).
4. A shared component in `@/shared/components` (`Media`, `RichText`, `Link`, `Pagination`).
5. Something new — and then decide its home with the `architecture` skill.

If the same visual appears twice, it's a component. If it's editor-configurable, it's a
**Payload block**, not a hardcoded section — this is a CMS site, and the client must be
able to change the words without a deploy.

## States

Every list, form and async surface needs all four designed, not just the happy path:

- **Loading** — skeletons that match the final layout, not a spinner in the middle.
- **Empty** — say what's missing and what to do (Czech first).
- **Error** — plain language plus the phone number. Never a stack trace.
- **Success** — form submissions confirm inline; don't navigate away.

## Performance is a design constraint

- LCP is almost always the hero image: `<Media priority />`, correct `sizes`, no entrance
  animation on it.
- Serve Payload media through `<Media />` (`@/shared/components/Media`), which handles the
  resource shapes, sizes and video — not raw `<img>`.
- Keep `'use client'` at the leaves. A page that ships the whole tree to the client feels
  slow on the 4G connection a customer is standing on site with.
- Fonts are already self-hosted via `geist`. Don't add a second family.

## Review checklist before calling a screen done

- [ ] 375 / 768 / 1440 all correct, nothing overflows horizontally
- [ ] Light **and** dark theme checked
- [ ] Czech copy in place (not lorem, not English) and not clipped
- [ ] Contact path reachable from this screen
- [ ] Keyboard-navigable, focus visible, headings in order
- [ ] Images sized, `alt` written, no CLS
- [ ] Colours/spacing/radius from tokens only
- [ ] Motion follows the budget in the `motion` skill and respects reduced motion
- [ ] Anything the client will want to edit is a Payload field, not hardcoded
- [ ] `pnpm lint` clean
