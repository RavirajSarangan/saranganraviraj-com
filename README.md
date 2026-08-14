# Sarangan Raviraj — Portfolio

Personal portfolio for Sarangan Raviraj, Software Engineer & Designer. Remote-first,
working worldwide.

Next.js 16 (App Router) · Tailwind CSS v4 · GSAP + Lenis · OGL (WebGL) ·
next-themes · TypeScript. Every public route is statically prerendered.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run lint
```

---

## Theming

Two palettes: **Editorial Noir** (dark) and **Editorial Ivory** (light). They are
counterparts, not inversions — ivory is warm paper with a darkened gold, and the
same type system carries both.

Palette *values* are declared exactly once in `app/globals.css`, prefixed
`--noir-*` / `--ivory-*`. Everything below only re-points the semantic tokens at one
set or the other, so the two palettes cannot drift apart:

```
:root                                  → ivory (no-preference default)
@media (prefers-color-scheme: dark)
  :root:not([data-theme="light"])      → noir, from CSS alone
[data-theme="dark"] / ["light"]        → explicit choice always wins
```

That media query is doing real work: it means a dark-OS visitor gets noir **before
any JavaScript runs, and with JavaScript disabled entirely**. `next-themes` then
layers an explicit override on top via a blocking script.

`@theme inline` is what makes it work at all — utilities compile to `var(--ink)`
rather than baking the hex in, so redefining the raw variable re-colours every
utility.

**The hero shader reads its palette from those CSS variables at runtime**
(`readPalette()` in `shader-canvas.tsx`), so GLSL can never drift from the tokens,
and switching theme is a uniform update rather than a recompile. Every colour
operation in the fragment shader is a `mix` toward a palette uniform — never a
multiply or an add, because a shader tuned by multiplying on near-black falls apart
on paper.

> **Project plates do not invert.** `ProjectPlate` is cover art, like an album
> sleeve — it stays a dark duotone in both themes, and its inner text is set with
> explicit light values rather than `text-fg`. Using a theme-reactive colour there
> turns the type dark-on-dark in light mode.

## Icons

`lucide-react`, mapped in [`components/ui/tag-icon.tsx`](components/ui/tag-icon.tsx).
Keys match case-insensitively against tag text, **longest key first**, so
"Adobe Photoshop" beats a bare "Adobe". An unmatched tag renders **no icon** rather
than a generic fallback — a wrong icon implies a category that is not there.
Current coverage: 32/34 skill and stack tags.

`renderTagIcon()` is a plain function returning an element, not a component.
Selecting a component *reference* during render trips
`react-hooks/static-components`, and the rule is right: React cannot reconcile a
component whose identity changes between renders.

Note lucide has dropped its brand marks — there is no `Figma` or `Framer` export, so
those map to neutral glyphs.

## Animation stack

**GSAP + ScrollTrigger + SplitText** drives the reveals, with **Lenis** for smooth
scroll — run off GSAP's ticker in [`lib/lenis.tsx`](lib/lenis.tsx) rather than its own
RAF loop, so scrubbed animations never lag a frame behind the scroll.

**Motion is still installed** solely because
[`components/ui/marquee-along-svg-path.tsx`](components/ui/marquee-along-svg-path.tsx)
is built on its `useAnimationFrame`/`useTransform`. Two animation libraries is a real
cost; it is carried only because rewriting that component on GSAP would mean rewriting
it wholesale.

Every animation entry point checks `prefersReduced()` from
[`lib/gsap.ts`](lib/gsap.ts). The contract that makes this safe: **GSAP animates *from*
an offset, never *to* one** — so the un-animated DOM is always the final, readable
state. With JS off, reduced motion on, or WebGL unavailable, the page is complete.

## The hero shader

[`components/hero/shader-canvas.tsx`](components/hero/shader-canvas.tsx) is a single
fullscreen fragment shader — domain-warped fbm noise in the Editorial Noir palette,
with a cursor-trailing ripple. It uses **OGL (~20 KB)** rather than Three.js (~600 KB):
this is one triangle, and a scene graph would cost the entire performance budget.

Three guards, all of which fall back to `ShaderFallback` (a CSS gradient that reads
almost identically at rest):

1. `prefers-reduced-motion` — the canvas never mounts.
2. No WebGL context — probed with `hasWebGL()` before mounting.
3. `webglcontextlost` at runtime — contexts are a finite resource.

The canvas also mounts only after two animation frames, so it never competes with LCP,
and pauses rendering when scrolled out of view or the tab is hidden.

> **Watch out when editing the shader:** every `smoothstep(edge0, edge1, x)` must keep
> `edge0 < edge1`. Reversed edges are undefined in GLSL and render as flat black on
> some drivers — which is exactly how this shader failed the first time.

## Content sources

Two files, and you should never need to open a component:

| File | Owns |
| --- | --- |
| [`content/site.ts`](content/site.ts) | Identity, 12 projects, services, process, About, and the whole résumé — experience, education, skills, stack, leadership, certifications |
| [`content/posts.ts`](content/posts.ts) | 6 blog posts, structured as heading/paragraph blocks |

**The résumé data is transcribed from `Sarangan_Raviraj_CV_ATS.pdf`, not inferred.**
If a fact is not on the CV it is not on the site. `end: null` on a role renders as
"Present", so ongoing positions never go stale.

Three roles legitimately overlap (Venom X, Lankajob, ICT Foundation), so `/resume`
groups by start date rather than drawing one exclusive timeline — a strict timeline
would misrepresent that.

## Editing content

**Everything you will want to change lives in [`content/site.ts`](content/site.ts).**
Name, role, availability, headline, projects, case studies, services, process,
testimonials, about copy, contact details and social links are all typed data in
that one file. You should not need to open a component to change words.

A few behaviours worth knowing:

- **Sections driven by an empty array render nothing.** `testimonials: []` ships
  empty on purpose (see below), so the testimonials section is absent until you
  add real quotes — at which point it appears on its own.
- **Section numbers are computed, not written.** `app/page.tsx` derives the
  `01 / 02 / 03 …` sequence from which sections actually render, so hiding one
  never leaves a gap in the numbering.
- **Case study sections with empty strings are skipped.** Two in-progress
  projects have `outcome: ""` and simply omit that heading rather than showing
  an empty one.

---

## Things left deliberately blank

These are not oversights. Each one is a place where the previous site carried
something untrue or unavailable, and inventing a replacement would have been
worse than leaving the slot open.

| What | Why | How to fill it |
|---|---|---|
| **Testimonials** | The old site's quotes came from a purchased template and credited a "Daniel" who was never a client. | Add `{ id, quote, author, title }` entries to `testimonials` in `content/site.ts`. The marquee appears automatically; avatars fall back to a generated initials plate, or drop a headshot at `public/testimonials/<id>.webp` and set `image`. |
| **Project screenshots** | All original imagery is hosted on `framerusercontent.com` with no local copies. | Drop a file at `public/work/<slug>.webp` and set `image: "/work/<slug>.webp"` on that project. It replaces the generated plate with no other change. |
| **Portrait** | No photo of Sarangan existed in any local project. | Add `public/portrait.webp` and set `about.portrait`. |
| **Behance callout** | The CV cites "20+ UI case studies on Behance" but gives no URL, so the callout on `/work` stays hidden rather than shipping a guessed link. | Set `behance.url` in `content/site.ts`. |
| **`50+` / `30+` stats** | Sarangan's own figures for his business; I have no way to verify them. | `facts` in `content/site.ts`, or the `settings` table once Convex is live. |
| **Availability window** | Carried over from the previous site; unverified. | Confirm or change `site.availability`. |

Until an image is supplied, each project renders a generated typographic cover
plate in its own duotone (`components/ui/project-plate.tsx`) — a design decision
rather than a broken frame.

---

## Design system

Editorial Noir. Tokens are declared once in `app/globals.css` under `@theme`.

- **Canvas** `#0A0A0B`, **text** `#EDEAE4` (warm white, never pure `#FFF`),
  **accent** `#C8A24A`. Contrast on the base: text 16:1, muted 6.1:1,
  accent 8.2:1 — all pass WCAG AA.
- **Type:** Instrument Serif (display) · Manrope (body) · IBM Plex Mono
  (uppercase metadata labels). Self-hosted via `next/font` — no runtime font
  requests.
- **Motion:** every primitive in `components/ui/reveal.tsx` checks
  `useReducedMotion()` and collapses to the settled state, and `globals.css`
  neutralises CSS animation under `prefers-reduced-motion`. The site is fully
  readable with motion off.

The share card (`app/opengraph-image.tsx`) is generated at build time from
`content/site.ts`, so it never drifts from the site. It loads
`assets/InstrumentSerif-Regular.ttf` explicitly — Satori cannot see `next/font`
webfonts, and without that file the card silently falls back to a default sans.

---

## Backend — written, not yet deployed

`convex/` holds the schema, auth and functions for the admin CMS:

| File | Purpose |
| --- | --- |
| `schema.ts` | `posts` · `projects` · `testimonials` · `settings` (+ Convex Auth tables) |
| `auth.ts` | Password provider, **closed sign-up** — `ADMIN_EMAIL` is the allow-list and it fails closed if unset |
| `posts.ts` | Public queries filter to `published`; every mutation goes through `requireAdmin` |
| `projects.ts` | CRUD + single-pass `reorder` |
| `files.ts` | Signed upload URLs — image bytes go browser → Convex, never through Next |
| `settings.ts` | Headline figures, editable without a redeploy |

**This code is not deployed.** Provisioning is blocked on accepting the Convex
marketplace terms — a legal agreement against the Vercel account, so it needs to be
done by hand:

```bash
# 1. accept terms in the browser, then:
vercel integration add convex
vercel env pull
npx convex dev          # generates convex/_generated
```

`convex/` is excluded from the root `tsconfig.json` and from ESLint until then, because
`convex/_generated` does not exist yet. It has its own `convex/tsconfig.json` and will
type-check under Convex's toolchain once provisioned.

Until the admin exists, `/blog` reads from [`content/posts.ts`](content/posts.ts) — six
real posts migrated from the previous site. Swapping the source to a Convex query is a
one-line change per page; the rendering components are unaffected.

## Verified

- `npm run build`, `npm run lint` and `npm run typecheck` clean; 30 pages prerendered,
  none dynamic.
- 28 width×route combinations (360 / 768 / 1440 / 2560 px × 7 routes): no page errors,
  no console errors, no horizontal overflow.
- **Reduced motion:** canvas never mounts, Lenis never constructs, marquee frozen at
  `offsetDistance: 0%`, no element below full opacity.
- **No WebGL** (`--disable-gpu --disable-webgl`): falls back cleanly, no exception, no
  layout shift. Chromium still logs its own "unable to create webgl context" warning —
  that is the browser, not this code, and cannot be suppressed.
- **JS disabled:** name, tagline, projects and stats all present in the served HTML.
- Keyboard: skip link is the first tab stop; visible gold focus ring throughout.
- OG image served byte-identical to the build artifact.

### Testimonial marquee

[`components/ui/testimonial-marquee.tsx`](components/ui/testimonial-marquee.tsx),
adapted from a supplied component. Verified: rows animate, **pause on hover and on
keyboard focus** (a perpetually moving click target is hard to hit, and much more so
with a motor impairment), capsule opens a dialog with `role`/`aria-modal`/`aria-label`,
focus moves to the close button and returns on close, Escape closes, body scroll locks
and unlocks. Under reduced motion it renders a static grid with zero animated rows.

Rows are CSS-animated rather than JS-driven, so `animation-play-state: paused` on
`:hover`/`:focus-within` does the pausing for free and the existing global
reduced-motion block applies automatically.

### Structured data & feed

- JSON-LD parses on every page: `Person` + `WebSite` sitewide, `BlogPosting` +
  `BreadcrumbList` on posts, `CreativeWork` + `BreadcrumbList` on case studies.
  The `Person` graph carries real `worksFor`, `alumniOf`, `hasCredential` (with the
  five public verify URLs) and `knowsAbout` — all read from the résumé data.
- `/feed.xml` validates as XML, carries 6 items, and every `<link>` resolves 200.

### Theming

- **Contrast, measured against rendered colours** — both themes pass WCAG AA for
  normal text:

  | | Ivory | Noir |
  | --- | --- | --- |
  | Heading | 16.73:1 | 16.48:1 |
  | Body / labels | 6.01:1 | 5.61:1 |
  | Accent | 5.68:1 | 8.22:1 |

- 72 theme × width × route combinations: no page errors, no console errors, no
  horizontal overflow.
- Résumé surfaces (year rail, role bullets, skill tags, cert rows, award pill) all
  pass AA in both themes. Contrast is measured by painting each computed colour into
  a canvas so `oklab()` and alpha resolve to real sRGB — parsing the CSS string
  directly gives nonsense for non-`rgb()` colour spaces.
- **JS disabled:** a dark-OS visitor is served noir and a light-OS visitor ivory,
  from CSS alone.
- **Flash of wrong theme**, measured by capturing real painted frames: none in three
  of four configurations. The exception is *explicitly chose light while the OS is
  dark*, which intermittently shows a single noir frame before the script applies the
  override. That is the inherent cost of letting CSS decide first, and it is the
  right trade: it buys correct rendering for every system-preference visitor and for
  everyone with JS disabled.
