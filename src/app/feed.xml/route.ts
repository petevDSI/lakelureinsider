import { getChildrenOf } from '@/lib/content'
import { SITE_URL, SITE_NAME } from '@/lib/site-config'

// RSS 2.0 feed of the news cluster — powers auto-posting to X/Facebook via a
// service like dlvr.it. Only articles with a `published` date are included
// (excludes the /news hub page itself, which has no `published` field).
// New articles show up here automatically on the next deploy; nothing needs
// to be added by hand when a new story ships.

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const articles = getChildrenOf('news')
    .filter((page) => page.frontmatter.type === 'article' && !!page.frontmatter.published)
    .sort((a, b) =>
      (b.frontmatter.published as string).localeCompare(a.frontmatter.published as string),
    )
    .slice(0, 30)

  const items = articles
    .map((page) => {
      const url = `${SITE_URL}/${page.slug}`
      const pubDate = new Date(`${page.frontmatter.published}T12:00:00Z`).toUTCString()
      return `    <item>
      <title>${escapeXml(page.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(page.frontmatter.description)}</description>
    </item>`
    })
    .join('\n')

  const lastBuildDate = new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Town News</title>
    <link>${SITE_URL}/news</link>
    <description>Local government and local business news from Lake Lure, NC — reported from primary documents, not press releases.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
