import { getAllPages } from './content'
import type { ContentPage } from '@/types/content'

export interface InsiderPost {
  slug: string
  title: string
  description: string
  published: string
  updated: string
  tags: string[]
  relatedCluster: string | null
  heroImage: string
  heroAlt: string
}

function toPost(page: ContentPage): InsiderPost {
  const fm = page.frontmatter
  return {
    slug: page.slug,
    title: fm.title,
    description: fm.description,
    published: fm.published ?? fm.updated,
    updated: fm.updated,
    tags: fm.tags ?? [],
    relatedCluster: fm.relatedCluster ?? null,
    heroImage: fm.heroImage,
    heroAlt: fm.heroAlt,
  }
}

export function getInsiderPosts(): InsiderPost[] {
  return getAllPages()
    .filter(
      (p) =>
        p.slug.startsWith('insider-tips/') &&
        p.frontmatter.type === 'article',
    )
    .map(toPost)
    .sort((a, b) => b.published.localeCompare(a.published))
}

export function getInsiderPostsByCluster(cluster: string, limit = 3): InsiderPost[] {
  return getInsiderPosts()
    .filter((p) => p.relatedCluster === cluster)
    .slice(0, limit)
}
