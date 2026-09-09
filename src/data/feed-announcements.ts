// Lightweight items that go out through the RSS feed (and, via the
// feed-watching automation connected to X/Facebook, get posted there) without
// needing a full article page on the site. Use this for social/site news —
// "we're on X now," a milestone, a housekeeping note — that doesn't warrant
// its own content page under content/news/.
//
// `link` doesn't have to point at a unique page (unlike real articles), so
// `guid` is a hand-picked stable string rather than a URL — set isPermaLink
// to false for these in the feed route.

export interface FeedAnnouncement {
  title: string
  link: string
  description: string
  date: string // YYYY-MM-DD, used for feed ordering
  guid: string // stable, unique, does not need to be a real URL
}

export const FEED_ANNOUNCEMENTS: FeedAnnouncement[] = [
  {
    title: 'New "State of the Herd" Episode: Make Things Right',
    link: 'https://lakelureinsider.com/news/comics',
    description:
      'Episode 4 of our comic strip "State of the Herd" is up: a resident asks a straight question, the Council Chorus answers in unison, and one of them almost says something real. Read it at lakelureinsider.com/news/comics.',
    date: '2026-09-09',
    guid: 'announcement-comics-ep4-make-things-right-2026-09-09',
  },
  {
    title: 'Lake Lure Insider Is Now on X',
    link: 'https://lakelureinsider.com',
    description:
      "We're now posting on X — follow @LakeLureInsider for real-time updates on the Lured Market fight, local news, and Edmund the goat's ongoing mayoral campaign.",
    date: '2026-09-08',
    guid: 'announcement-x-launch-2026-09-08',
  },
  {
    title: 'Find Lake Lure Insider on X and Facebook',
    link: 'https://lakelureinsider.com',
    description:
      "We're now posting on both X (@LakeLureInsider) and Facebook — follow along for real-time updates on the Lured Market fight, local news, and Edmund the goat's ongoing mayoral campaign.",
    date: '2026-09-08',
    guid: 'announcement-social-follow-2026-09-08',
  },
  {
    title: 'New "State of the Herd" Episode: The Grate',
    link: 'https://lakelureinsider.com/news/comics',
    description:
      'Episode 3 of our comic strip "State of the Herd" is up: a public records request meets a stamp, a basement grate, and a muffled "...pending..." Read it at lakelureinsider.com/news/comics.',
    date: '2026-09-08',
    guid: 'announcement-comics-ep3-the-grate-2026-09-08',
  },
]
