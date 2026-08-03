import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentPage, ContentType, Frontmatter } from '@/types/content'

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
    const slug = filePathToSlug(filePath)
    return { frontmatter, slug, filePath, rawContent: content }
  })

  return _cache
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
