import type { MetadataRoute } from 'next'
import { getAllPages } from '@/lib/content'
import { SITE_URL } from '@/lib/site-config'
import { allProductKeys } from '@/lib/shop-catalog'

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

  const productEntries: MetadataRoute.Sitemap = allProductKeys().map((key) => ({
    url: `${SITE_URL}/products/${key}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.6,
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
    {
      url: `${SITE_URL}/edmund-for-mayor`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/records`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/news/comics`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...contentEntries,
    ...productEntries,
  ]
}
