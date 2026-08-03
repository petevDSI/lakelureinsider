@AGENTS.md

# Lake Lure Insider — Project Reference

## Stack
- **Next.js** 16 (App Router, TypeScript, `src/` directory)
- **Tailwind CSS** v4 (CSS-first config in `globals.css`, no `tailwind.config.js`)
- **MDX** via `next-mdx-remote/rsc` v6 + `gray-matter` (NOT contentlayer)
- **Fonts**: `next/font/google` — Fraunces (display headings), Inter (body)
- **Package manager**: npm
- **Rendering**: fully static SSG — all pages prerendered at build time via `generateStaticParams()`

## Content Architecture

All article content lives in `/content/**/*.mdx`. The file path mirrors the URL:

```
content/chimney-rock/tickets-and-hours.mdx  →  /chimney-rock/tickets-and-hours
content/chimney-rock/index.mdx              →  /chimney-rock
content/lake-lure/index.mdx                 →  /lake-lure
```

**Adding a new page**: drop a `.mdx` file in the right folder. No route edits needed.

The catch-all route `src/app/[...slug]/page.tsx` handles all MDX pages.
The homepage is `src/app/page.tsx` (not an MDX file).

## Frontmatter Schema

Every `.mdx` file must have these fields (build fails loudly if any are missing):

```yaml
title: string           # Page title (H1 and <title>)
description: string     # Meta description
slug: string            # URL path (e.g. "chimney-rock/tickets-and-hours")
cluster: string         # Content cluster (e.g. "chimney-rock", "lake-lure")
targetKeyword: string   # Primary SEO keyword
updated: string         # ISO date of last content update (YYYY-MM-DD)
heroImage: string       # Path or URL to hero image
heroAlt: string         # Alt text for hero image
type: "article"|"place" # Content type (default "article")
# Optional:
quickAnswer:            # Key/value pairs for the QuickAnswer component
  Hours: "..."
faqs:                   # Array for FAQ component + FAQPage JSON-LD
  - q: "Question?"
    a: "Answer."
```

Validation is in `src/lib/content.ts` → `validateFrontmatter()`.

## Content Types

`type: "article"` — default. Rendered by the catch-all route.

`type: "place"` — reserved for the future filterable local directory (restaurants, rentals,
outfitters with category facets and map view). `lib/content.ts` branches on `type`; build the
directory feature later without touching the existing article flow.

## Key Files

| File | Purpose |
|---|---|
| `src/lib/content.ts` | Reads and caches all MDX from `/content`; exports `getAllPages()`, `getPageBySlug()`, `getChildrenOf()`, `getRelated()` |
| `src/lib/jsonld.ts` | Generates Organization, BreadcrumbList, FAQPage JSON-LD objects |
| `src/data/facts.ts` | Single source of truth for all factual claims (hours, prices, phone numbers). Never hardcode facts in MDX. |
| `src/data/affiliates.ts` | All affiliate links keyed by short id. Swap a network with one line. |
| `src/components/mdx/index.ts` | Exports `mdxComponents` — all custom MDX components |
| `src/app/[...slug]/page.tsx` | Catch-all MDX renderer with `generateStaticParams()` and `generateMetadata()` |
| `src/app/sitemap.ts` | Auto-generated sitemap from content tree |
| `src/app/robots.ts` | Robots.txt |

## MDX Components (`src/components/mdx/`)

All components are auto-provided to every MDX file via `mdxComponents` in the catch-all route.

| Component | Props / Usage |
|---|---|
| `<QuickAnswer>` | `items` auto-populated from frontmatter `quickAnswer`; or pass `children` |
| `<InsiderTip>` | `children` — renders with clay border |
| `<AffiliateCTA affiliateId="..." headline="..." subtext="...">` | Button block with FTC disclosure |
| `<AffiliateLink id="...">` | Inline link resolving affiliate id; renders `rel="sponsored nofollow noopener"` |
| `<ComparisonTable headers={[...]} rows={[[...],...]}/>` | Responsive table → cards on mobile |
| `<FAQ>` | Auto-populated from frontmatter `faqs`; also emits FAQPage JSON-LD |
| `<NearbyLinks pages={[{href,title,description,cluster}]}>` | Internal link card grid |
| `<PageHero>` | Full-bleed hero; auto-populated from frontmatter (heroImage, heroAlt, title, breadcrumbs) |
| `<SectionHeader kicker="...">` | Uppercase kicker + H2; use instead of bare `##` for magazine sections |
| `<CardGrid cards={[...]} feature>` | Image-topped link cards; `feature` makes first card double-width |
| `<Card href title description imageSrc imageAlt category featured>` | Single card |
| `<QuickPicks picks={[{label,href}]}>` | Row of 3 pill buttons for next-click navigation |
| `<WeddingCostCalculator>` | Interactive ceremony cost calculator (fee + admission + rental). Client component. |
| `<WeddingContactCTA venue phone email website>` | "Planning a wedding here?" contact block |
| `<EditorialIndependence>` | Trust badge for wedding venue pages — "We take no money from any venue on this page" |

## Design Palette

| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#1C2321` | Body text |
| `--forest` | `#2F4739` | Headings, footer background |
| `--lake` | `#2A6F7F` | Links, accents |
| `--clay` | `#C4622D` | CTA buttons + InsiderTip border ONLY — keep scarce |
| `--sand` | `#E8DFD3` | Section backgrounds, table stripes |
| `--paper` | `#FAF8F5` | Page background |

Use CSS variables directly in Tailwind: `bg-[--sand]`, `text-[--forest]`, etc.

## The Facts Rule

**Never hardcode hours, prices, phone numbers, or drive times in MDX content.**

All such claims live in `src/data/facts.ts` with a `source` URL and `lastVerified` date.
Use `factValue('key')` to render the value and `verifiedLine('key')` to render a "Verified" line.
Unpopulated facts have `null` values with a `// TODO: VERIFY` comment — don't invent numbers.

**Absence claims require a verification date.** Any sentence asserting that something does NOT
exist ("no resale platform carries this park", "no operator offers X", "this fee does not apply")
must include the date it was checked. Store the checked-on date as a fact in `facts.ts` and
render it via `<Fact id="..." />` so the date updates when re-verified rather than silently going
stale. Example key pattern: `'chimney-rock.resale.none-found'` with `value` set to a
human-readable month/year (`'August 2026'`) and `lastVerified` set to the ISO check date.

## Affiliate Links Rule

All affiliate links live in `src/data/affiliates.ts` keyed by short id.
Render via `<AffiliateLink id="...">` or `<AffiliateCTA affiliateId="...">`.
Every affiliate anchor renders `rel="sponsored nofollow noopener" target="_blank"`.
Pages with affiliate content automatically show a one-line FTC disclosure bar at the top.

## Wedding Cluster Editorial Policy

**Lake Lure Insider accepts no payment, referral fee, commission, or sponsorship from any wedding
venue.** Venue pages, comparisons, and cost calculators under `content/weddings/` must never
contain an `<AffiliateCTA>` or `<AffiliateLink>` component. Revenue on this cluster comes only
from lodging/rental booking links and from surrounding trip spend. The vendor directory is free
to list — no paid placement. No money from anyone we editorially rank.

This is enforced at build time: any wedding MDX file with an affiliate component fails the build
with an error message citing this policy.

Every wedding venue comparison page must include `<EditorialIndependence />` near the top of the
venue content — not in the footer, not as microcopy. It is a visible editorial mark.

## SEO Checklist (already built)

- `generateMetadata()` per page from frontmatter
- Canonical URLs via `alternates.canonical`
- OpenGraph + Twitter card meta
- `src/app/sitemap.ts` generated from content tree
- `src/app/robots.ts`
- BreadcrumbList JSON-LD on every content page
- FAQPage JSON-LD where `faqs` frontmatter exists
- Organization JSON-LD on every page (in root layout)
- `next/image` everywhere with `fill` or explicit `width`/`height`
- `next/font` for Fraunces + Inter (no CDN font links)
