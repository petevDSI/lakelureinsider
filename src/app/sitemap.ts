import type { MetadataRoute } from 'next'
import { getAllPages } from '@/lib/content'
import { SITE_URL } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAllPages()

  const contentEntries: MetadataRoute.Sitemap = pages
    .filter((page) => !page.frontmatter.stub)
    .map((page) => ({
    url: page.slug ? `${SITE_URL}/${page.slug}` : SITE_URL,
    lastModified: page.frontmatter.updated,
    changeFrequency: 'monthly',
    priority: page.slug.split('/').length === 1 ? 0.8 : 0.6,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/affiliate-disclosure`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
    ...contentEntries,
  ]
}
