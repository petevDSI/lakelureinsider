export type ContentType = 'article' | 'place'

export interface FaqItem {
  q: string
  a: string
}

export interface Frontmatter {
  title: string
  description: string
  slug: string
  cluster: string
  targetKeyword: string
  updated: string
  heroImage: string
  heroAlt: string
  type: ContentType
  quickAnswer?: Record<string, string>
  faqs?: FaqItem[]
}

export interface ContentPage {
  frontmatter: Frontmatter
  slug: string
  filePath: string
  rawContent: string
}
