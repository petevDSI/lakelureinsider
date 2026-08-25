import Link from 'next/link'
import type { NewsNavLink } from '@/lib/content'

interface NewsArticleNavProps {
  prev?: NewsNavLink
  next?: NewsNavLink
  position: number
  total: number
}

/**
 * Side rail for news-cluster articles: previous/next story, a link back to
 * the news hub, and a standing petition CTA. Sticky on desktop (lg+), stacks
 * below the article on smaller screens. Prev/next are computed automatically
 * from published date in getNewsSiblings — new articles slot in without any
 * page needing to be hand-edited.
 */
export function NewsArticleNav({ prev, next, position, total }: NewsArticleNavProps) {
  return (
    <nav
      aria-label="News story navigation"
      className="not-prose flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start"
    >
      <div className="rounded-xl border border-(--sand) bg-white p-4">
        {total > 0 && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-(--lake)">
            Story {position} of {total}
          </p>
        )}

        <div className="flex flex-col gap-3 text-sm">
          {prev ? (
            <Link href={`/${prev.href}`} className="group flex flex-col">
              <span className="text-xs text-(--ink)/50">← Previous</span>
              <span className="font-semibold text-(--ink) group-hover:text-(--lake)">
                {prev.title}
              </span>
            </Link>
          ) : (
            <p className="text-xs text-(--ink)/40">This is where the story started.</p>
          )}

          {next ? (
            <Link
              href={`/${next.href}`}
              className="group flex flex-col border-t border-(--sand) pt-3"
            >
              <span className="text-xs text-(--ink)/50">Next →</span>
              <span className="font-semibold text-(--ink) group-hover:text-(--lake)">
                {next.title}
              </span>
            </Link>
          ) : (
            <p className="border-t border-(--sand) pt-3 text-xs text-(--ink)/40">
              This is the latest update.
            </p>
          )}
        </div>
      </div>

      <Link
        href="/news"
        className="rounded-xl border border-(--sand) bg-white p-4 text-sm font-semibold text-(--ink) transition-colors hover:border-(--lake) hover:text-(--lake)"
      >
        ← All town news
      </Link>

      <Link
        href="/petition"
        className="rounded-xl border border-(--clay) bg-(--clay)/5 p-4 text-center text-sm font-semibold text-(--clay) transition-colors hover:bg-(--clay)/10"
      >
        Read the ask and sign the petition →
      </Link>
    </nav>
  )
}
