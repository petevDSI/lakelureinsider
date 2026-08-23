import Link from 'next/link'

interface NearbyPage {
  href: string
  title: string
  description?: string
  cluster?: string
}

interface NearbyLinksProps {
  pages: NearbyPage[]
  heading?: string
}

export function NearbyLinks({
  pages,
  heading = 'More to Explore Nearby',
}: NearbyLinksProps) {
  if (!pages || pages.length === 0) return null
  return (
    <section className="not-prose my-12">
      <h2 className="mb-5 font-display text-xl font-bold text-(--forest)">
        {heading}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group flex flex-col rounded-lg border border-(--sand) bg-white p-4 transition-shadow hover:shadow-md"
          >
            {page.cluster && (
              <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-(--lake)">
                {page.cluster}
              </span>
            )}
            <span className="font-semibold text-(--ink) group-hover:text-(--lake)">
              {page.title}
            </span>
            {page.description && (
              <span className="mt-1 text-sm text-(--ink)/60 line-clamp-2">
                {page.description}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
