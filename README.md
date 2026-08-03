# Lake Lure Insider

Local travel guide for Lake Lure and Chimney Rock, NC — built with Next.js 16, Tailwind CSS v4, and MDX.

## Local Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build (validates all frontmatter)
npm run lint         # ESLint
```

## Adding Content

Drop an `.mdx` file in `/content/` mirroring the URL you want:

```
content/chimney-rock/swimming-holes.mdx  →  /chimney-rock/swimming-holes
content/things-to-do/kayaking.mdx        →  /things-to-do/kayaking
```

Every file must have this frontmatter (build fails if any field is missing):

```yaml
---
title: "Page Title"
description: "Meta description (150–160 chars)"
slug: "cluster/page-name"
cluster: "cluster-name"
targetKeyword: "primary seo keyword"
updated: "2026-08-01"
heroImage: "/images/your-hero.jpg"
heroAlt: "Descriptive alt text"
type: "article"
---
```

See `CLAUDE.md` for the full component list, palette, and architecture notes.

## Updating Facts

All hours, prices, and phone numbers live in `src/data/facts.ts`. Never hardcode facts in MDX content. Each entry has a `source` URL and `lastVerified` date.

## Affiliate Links

Add new affiliate programs in `src/data/affiliates.ts`. Use `<AffiliateCTA affiliateId="...">` in MDX to render a CTA button.

## Project Structure

```
content/             MDX content files (mirrors URL structure)
src/
  app/               Next.js App Router pages
    [...]slug/       Catch-all MDX renderer
    sitemap.ts       Auto-generated sitemap
    robots.ts        robots.txt
  components/
    mdx/             Custom MDX components
    Nav.tsx
    Footer.tsx
  data/
    facts.ts         Factual data (hours, prices, phone numbers)
    affiliates.ts    Affiliate link registry
  lib/
    content.ts       Content reader + cache
    jsonld.ts        JSON-LD generators
  types/
    content.ts       TypeScript types
public/
  images/            Hero images and other assets
```
