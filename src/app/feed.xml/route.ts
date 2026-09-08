import { getChildrenOf } from '@/lib/content'
import { SITE_URL, SITE_NAME } from '@/lib/site-config'
import { FEED_ANNOUNCEMENTS } from '@/data/feed-announcements'

// RSS 2.0 feed of the news cluster (plus hand-written announcements — see
// feed-announcements.ts) — powers auto-posting to X/Facebook via a service
// like dlvr.it. Only articles with a `published` date are included (excludes
// the /news hub page itself, which has no `published` field). New articles
// show up here automatically on the next deploy; nothing needs to be added
// by hand when a new story ships.

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

interface FeedItem {
  title: string
  link: string
  guid: string
  isPermaLink: boolean
  pubDate: string
  description: string
  sortDate: string
}

export async function GET() {
  const articleItems: FeedItem[] = getChildrenOf('news')
    .filter((page) => page.frontmatter.type === 'article' && !!page.frontmatter.published)
    .map((page) => {
      const url = `${SITE_URL}/${page.slug}`
      const published = page.frontmatter.published as string
      return {
        title: page.frontmatter.title,
        link: url,
        guid: url,
        isPermaLink: true,
        pubDate: new Date(`${published}T12:00:00Z`).toUTCString(),
        description: page.frontmatter.description,
        sortDate: published,
      }
    })

  // Announcements sort after same-day articles (a later time-of-day on the
  // same date) so a same-day "we're now on X"-style item is treated as the
  // newest thing in the feed rather than tying with — and losing to — a
  // routine article published earlier that day.
  const announcementItems: FeedItem[] = FEED_ANNOUNCEMENTS.map((a) => ({
    title: a.title,
    link: a.link,
    guid: a.guid,
    isPermaLink: false,
    pubDate: new Date(`${a.date}T20:00:00Z`).toUTCString(),
    description: a.description,
    sortDate: `${a.date}T20:00:00Z`,
  }))

  const items = [...articleItems, ...announcementItems]
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
    .slice(0, 30)

  const itemsXml = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="${item.isPermaLink}">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`,
    )
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
${itemsXml}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
