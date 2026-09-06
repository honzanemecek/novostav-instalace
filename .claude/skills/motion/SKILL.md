---
name: motion
description: Use when adding animation or motion to the frontend - scroll reveals, staggered entrances, hover effects, counters, carousels, lightboxes, before/after sliders, text effects - or when working with the motion library, motion-primitives components in src/shared/ui/motion/, or adding a new motion-primitive to the project.
---

# Motion & motion-primitives

Library: **`motion` v13** (the successor package to `framer-motion`; import from
`motion/react`). Components: **motion-primitives**, installed into
`src/shared/ui/motion/`.

## What's installed

| Component | File | Use it for |
|---|---|---|
| `InView` | `in-view.tsx` | reveal a section when it scrolls into view |
| `AnimatedGroup` | `animated-group.tsx` | staggered entrance for a list/grid of children |
| `TextEffect` | `text-effect.tsx` | per-character / per-word heading animation |
| `TextShimmer` | `text-shimmer.tsx` | subtle shimmering label |
| `AnimatedNumber` | `animated-number.tsx` | counting stat ("500+ zakázek") |
| `InfiniteSlider` | `infinite-slider.tsx` | continuously scrolling logo/brand strip |
| `ProgressiveBlur` | `progressive-blur.tsx` | soft fade at the edges of a slider/image |
| `ImageComparison` | `image-comparison.tsx` | before/after drag slider — ideal for renovations |
| `MorphingDialog` | `morphing-dialog.tsx` | photo/gallery lightbox that morphs from the thumbnail |
| `Accordion` | `accordion.tsx` | animated FAQ / disclosure |
| `Tilt` | `tilt.tsx` | 3D tilt on card hover |
| `Spotlight` | `spotlight.tsx` | cursor-following glow inside a card |
| `BorderTrail` | `border-trail.tsx` | animated accent along a border |
| `ScrollProgress` | `scroll-progress.tsx` | reading-progress bar on article pages |

Import directly by file, the same way shadcn primitives are imported:

```tsx
import { InView } from '@/shared/ui/motion/in-view'
import { AnimatedGroup } from '@/shared/ui/motion/animated-group'
```

Every file in `src/shared/ui/motion/` is `'use client'`. Keep them at the leaf: wrap the
piece that animates, not the page.

## Where motion code belongs

- The primitives themselves: `src/shared/ui/motion/` — **registry output, treat as
  read-only** (same rule as `shared/ui/`). Style via props and `className`.
- A reusable animated composition used by 2+ domains: `src/shared/components/`.
- A domain-specific animated component (e.g. an animated service card):
  that domain's `ui/`.
- Never put motion inside a server component; extract the animated part into a small
  client component instead of marking a whole page `'use client'`.

`useClickOutside` lives at `src/shared/hooks/useClickOutside.ts` (required by
`MorphingDialog`); `react-use-measure` is a dependency of `InfiniteSlider`.

## Typical patterns

```tsx
// Section reveal
<InView
  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
  viewOptions={{ once: true, margin: '0px 0px -120px 0px' }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  <ServicesSection />
</InView>

// Staggered grid
<AnimatedGroup preset="blur-slide" className="grid gap-6 md:grid-cols-3">
  {services.map((s) => <ServiceCard key={s.id} {...s} />)}
</AnimatedGroup>

// Before / after
<ImageComparison className="aspect-4/3 w-full rounded-lg">
  <ImageComparisonImage src={before} alt="Před" position="left" />
  <ImageComparisonImage src={after} alt="Po" position="right" />
  <ImageComparisonSlider className="bg-background w-0.5" />
</ImageComparison>
```

`AnimatedGroup` presets: `fade`, `slide`, `scale`, `blur`, `blur-slide`, `zoom`, `flip`,
`bounce`, `rotate`, `swing`.

Note: `ImageComparisonImage` renders a raw `<motion.img>` with a `src` string — it does
**not** go through `next/image`, so pass an already-sized Payload media URL and set an
explicit aspect ratio on the wrapper.

## House rules

1. **Motion serves comprehension, not decoration.** Reveal, direct attention, or explain a
   state change. A tradesman's site should feel solid — if an animation only says "look
   what we can do", cut it.
2. **Budget: 150–400ms** for UI transitions, up to ~700ms for a large hero reveal. Longer
   than that reads as slow, not premium.
3. **`once: true` on scroll reveals.** Re-animating on every scroll-up is nauseating.
4. **Never animate above the fold on first paint** in a way that delays the LCP element.
   Hero text can fade in; the hero image must not.
5. **Respect `prefers-reduced-motion`.** Guard anything continuous (`InfiniteSlider`,
   `BorderTrail`, `TextShimmer`, parallax) — motion exposes `useReducedMotion()`:
   ```tsx
   const reduce = useReducedMotion()
   <InfiniteSlider speed={reduce ? 0 : 40} />
   ```
6. **Animate `transform` and `opacity`.** Animating `width`, `height`, `top` or
   `box-shadow` causes layout thrash; use `scale`/`translate` and `layout` instead.
7. **No animation on tabular/critical data** — prices, phone numbers, addresses appear
   instantly.
8. One motion idea per section. Tilt + spotlight + border-trail on the same card is noise.

## Adding another motion-primitive

The normal path:

```bash
pnpm dlx shadcn@latest add @motion-primitives/<name>
```

`components.json` already registers
`"@motion-primitives": "https://motion-primitives.com/c/{name}.json"`.

**If that returns HTTP 429**, motion-primitives.com is rate-limiting/blocking this
network. Fall back to the GitHub source, which is what the registry serves:

```bash
curl -s -o src/shared/ui/motion/<name>.tsx \
  https://raw.githubusercontent.com/ibelick/motion-primitives/main/components/core/<name>.tsx
sed -i "s|from '@/lib/utils'|from '@/shared/utils/ui'|;s|from '@/hooks/useClickOutside'|from '@/shared/hooks/useClickOutside'|" \
  src/shared/ui/motion/<name>.tsx
npx prettier --write src/shared/ui/motion/<name>.tsx
```

Available upstream (not yet installed): `animated-background`, `carousel`, `cursor`,
`dialog`, `disclosure`, `dock`, `glow-effect`, `magnetic`, `morphing-popover`,
`sliding-number`, `spinning-text`, `text-loop`, `text-morph`, `text-roll`,
`text-scramble`, `text-shimmer-wave`, `toolbar-dynamic`, `toolbar-expandable`,
`transition-panel`.

### Then fix the React 19 / motion 13 gaps

Upstream sources target React 18 and motion 11. Every file needed one of these:

- `keyof JSX.IntrinsicElements` → `keyof React.JSX.IntrinsicElements & string`
  (React 19 removed the global `JSX` namespace).
- `motion.create(x)` loses prop types → cast the result,
  `as React.ComponentType<HTMLMotionProps<'div'>>`, **and wrap it in `useMemo`** or
  `react-hooks/static-components` fails the lint.
- `RefObject<T>` → `RefObject<T | null>` (React 19 made refs non-null by default).
- `useScroll({ layoutEffect })` was removed — delete the option.
- `React.cloneElement(child, { ...child.props })` — `child.props` is `unknown` in React
  19; cast to `React.ReactElement<Record<string, unknown>>` and drop the spread
  (`cloneElement` merges props already).

Then `npx tsc --noEmit -p tsconfig.json && pnpm lint` — both must be clean.
