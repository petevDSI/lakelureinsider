import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentPage, ContentType, Frontmatter } from '@/types/content'
import { facts } from '@/data/facts'
import { enforceScheduleStaleness } from '@/lib/schedule'

// Patterns that flag hardcoded facts — values matching these must use {{fact:key}} instead
const HARDCODED_FACT_PATTERNS: RegExp[] = [
  /\$\d+/,                        // $17, $32
  /\d{1,2}:\d{2}\s*[AP]M/i,       // 8:30 AM, 5:30 PM
  /\d+\.?\d*\s*miles?\b/i,         // 3.2 miles, 8 miles
  /~?\d+\s*min(utes?)?\b/i,        // ~7 minutes, 15 min
  /\d+\s*steps?\b/i,               // 102 steps, 499 steps
  /\d+[-\s]*stor(ies|y)\b/i,       // 26 stories, 26-story
  /\d+\s*feet\b/i,                 // 258 feet
]

function resolveFactRef(value: string, filePath: string): string {
  return value.replace(/\{\{fact:([^}]+)\}\}/g, (match, key: string) => {
    if (!(key in facts)) {
      throw new Error(
        `[content] Build error: unknown fact key "${key}" in quickAnswer in ${filePath}`,
      )
    }
    return facts[key].value ?? '{{TODO}}'
  })
}

function validateAndResolveQuickAnswer(
  items: Record<string, string>,
  filePath: string,
): Record<string, string> {
  const resolved: Record<string, string> = {}
  for (const [label, rawValue] of Object.entries(items)) {
    const hasFactRef = rawValue.includes('{{fact:')
    const looksLikeFact = HARDCODED_FACT_PATTERNS.some((p) => p.test(rawValue))
    if (looksLikeFact && !hasFactRef) {
      throw new Error(
        `[content] Build error: quickAnswer["${label}"] in ${filePath} contains what looks ` +
          `like a hardcoded fact.\n` +
          `  Value: "${rawValue}"\n` +
          `  Use {{fact:key}} syntax. See src/data/facts.ts for available keys.`,
      )
    }
    resolved[label] = resolveFactRef(rawValue, filePath)
  }
  return resolved
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

const REQUIRED_FIELDS = [
  'title',
  'description',
  'slug',
  'cluster',
  'targetKeyword',
  'updated',
  'heroImage',
  'heroAlt',
] as const

function validateFrontmatter(
  data: Record<string, unknown>,
  filePath: string,
): Frontmatter {
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw new Error(
        `[content] Build error: required field "${field}" is missing or empty in ${filePath}`,
      )
    }
  }
  return {
    ...data,
    type: (data.type as ContentType) ?? 'article',
  } as Frontmatter
}

function filePathToSlug(filePath: string): string {
  const relative = path.relative(CONTENT_DIR, filePath)
  const withoutExt = relative.replace(/\.mdx$/, '')
  const normalized = withoutExt.replace(/\\/g, '/')
  return normalized.replace(/\/index$/, '').replace(/^index$/, '')
}

function collectMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectMdxFiles(full))
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(full)
    }
  }
  return files
}

// Slugs always reachable via the site Nav — exempt from the orphan check
const NAV_SLUGS = new Set([
  '',
  'lake-lure',
  'chimney-rock',
  'things-to-do',
  'where-to-stay',
  'trip-planning',
  'weddings',
  'insider-tips',
  'whats-open-now',
])

// Slug prefixes whose children are programmatically linked (index pages, etc.)
// — exempt from the orphan check
const PROGRAMMATIC_PREFIXES = ['insider-tips/', 'archive/']

function checkOrphanedPages(pages: ContentPage[]): void {
  const linked = new Set<string>(NAV_SLUGS)

  // Matches href="/slug" (JSX attr) and href: "/slug" (JS object prop) and ]( /slug) (markdown)
  const LINK_RE = /href[=:]\s*["']\/([^"'#?]*)["']|\]\(\/([^)#?]*)\)/g

  for (const page of pages) {
    let m: RegExpExecArray | null
    const re = new RegExp(LINK_RE.source, 'g')
    while ((m = re.exec(page.rawContent)) !== null) {
      const slug = (m[1] ?? m[2] ?? '').replace(/\/$/, '')
      if (slug) linked.add(slug)
    }
  }

  const orphans = pages
    .filter(
      (p) =>
        p.frontmatter.type === 'article' &&
        p.slug !== '' &&
        !linked.has(p.slug) &&
        !PROGRAMMATIC_PREFIXES.some((prefix) => p.slug.startsWith(prefix)),
    )
    .map((p) => p.slug)

  if (orphans.length > 0) {
    throw new Error(
      `[content] Build error: ${orphans.length} orphaned page(s) — no inbound links found:\n` +
        orphans.map((s) => `  • /${s}`).join('\n') +
        `\nLink to these pages from hub pages, or add the slug to NAV_SLUGS in content.ts.`,
    )
  }
}

function checkReviewedOnStaleness(pages: ContentPage[]): void {
  const now = new Date()
  for (const page of pages) {
    const { reviewedOn } = page.frontmatter
    if (!reviewedOn) continue
    const reviewed = new Date(reviewedOn)
    const ageDays = (now.getTime() - reviewed.getTime()) / (1000 * 60 * 60 * 24)
    if (ageDays > 60) {
      throw new Error(
        `[content] Build error: /${page.slug} reviewedOn=${reviewedOn} is ${Math.floor(ageDays)} days old.\n` +
          `A status page more than 60 days out of date cannot ship. Update reviewedOn and re-verify all items.`,
      )
    }
    if (ageDays > 30) {
      console.warn(
        `[content] Warning: /${page.slug} reviewedOn=${reviewedOn} is ${Math.floor(ageDays)} days old — review recommended before next deploy.`,
      )
    }
  }
}

let _cache: ContentPage[] | null = null

export function getAllPages(): ContentPage[] {
  if (_cache) return _cache

  const files = collectMdxFiles(CONTENT_DIR)
  _cache = files.map((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(source)
    const frontmatter = validateFrontmatter(
      data as Record<string, unknown>,
      filePath,
    )
    if (frontmatter.quickAnswer) {
      frontmatter.quickAnswer = validateAndResolveQuickAnswer(
        frontmatter.quickAnswer,
        filePath,
      )
    }
    const slug = filePathToSlug(filePath)
    return { frontmatter, slug, filePath, rawContent: content }
  })

  checkOrphanedPages(_cache)
  checkWeddingAffiliatePolicy(_cache)
  checkReviewedOnStaleness(_cache)
  enforceScheduleStaleness()

  return _cache
}

// Wedding cluster must never contain affiliate components — enforced at build time.
// See CLAUDE.md "Wedding Cluster Editorial Policy" for the full rule.
function checkWeddingAffiliatePolicy(pages: ContentPage[]): void {
  const BANNED = ['<AffiliateCTA', '<AffiliateLink']
  const violations = pages
    .filter(
      (p) =>
        p.slug.startsWith('weddings/') || p.slug === 'weddings',
    )
    .filter((p) => BANNED.some((tag) => p.rawContent.includes(tag)))
    .map((p) => p.slug)

  if (violations.length > 0) {
    throw new Error(
      `[content] Build error: affiliate component found in wedding cluster — policy violation.\n` +
        violations.map((s) => `  • /${s}`).join('\n') +
        `\nWedding pages must never contain AffiliateCTA or AffiliateLink.\n` +
        `See CLAUDE.md "Wedding Cluster Editorial Policy" for details.`,
    )
  }
}

export function getPageBySlug(slug: string): ContentPage | undefined {
  return getAllPages().find((p) => p.slug === slug)
}

export function getChildrenOf(cluster: string): ContentPage[] {
  return getAllPages().filter((p) => p.frontmatter.cluster === cluster)
}

export function getRelated(page: ContentPage): ContentPage[] {
  return getAllPages().filter(
    (p) =>
      p.frontmatter.cluster === page.frontmatter.cluster &&
      p.slug !== page.slug,
  )
}

// Articles only — excludes future `type: "place"` records
export function getArticlePages(): ContentPage[] {
  return getAllPages().filter((p) => p.frontmatter.type === 'article')
}

// Place records only — for the future filterable local directory
export function getPlacePages(): ContentPage[] {
  return getAllPages().filter((p) => p.frontmatter.type === 'place')
}
