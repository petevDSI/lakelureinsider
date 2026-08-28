import { SHOPS, SHOP_AREAS, shopsLastVerified, type ShopCategory } from '@/data/facts'

const CATEGORY_STYLE: Record<ShopCategory, string> = {
  'Retail & Gifts': 'bg-(--forest)/15 text-(--forest)',
  'Family Fun & Games': 'bg-(--clay)/15 text-(--clay)',
}

function CategoryBadge({ category }: { category: ShopCategory }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${CATEGORY_STYLE[category]}`}
    >
      {category}
    </span>
  )
}

function Stars({ score }: { score: number }) {
  const full = Math.round(score)
  return (
    <span className="text-(--clay)" aria-hidden="true">
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)}
    </span>
  )
}

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d]/g, '')}`
}

export function ShoppingDirectory() {
  const verified = shopsLastVerified()

  return (
    <div className="not-prose my-8">
      {SHOP_AREAS.map((area) => {
        const shops = SHOPS.filter((s) => s.area === area)
        if (shops.length === 0) return null

        return (
          <div key={area} className="mb-8 last:mb-0">
            <h3 className="mb-3 font-display text-lg font-bold text-(--forest)">{area}</h3>

            <div className="flex flex-col gap-3">
              {shops.map((s) => (
                <div key={s.id} className="rounded-lg border border-(--sand) bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {s.website ? (
                          <a
                            href={s.website}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="font-semibold text-(--lake) underline underline-offset-2"
                          >
                            {s.name}
                          </a>
                        ) : (
                          <span className="font-semibold text-(--ink)">{s.name}</span>
                        )}
                        <CategoryBadge category={s.category} />
                      </div>
                      {s.rating && (
                        <div className="mt-1 flex items-center gap-1.5 text-sm">
                          <Stars score={s.rating.score} />
                          <span className="text-(--ink)/70">
                            {s.rating.score.toFixed(1)} ({s.rating.reviewCount} reviews on{' '}
                            {s.rating.source})
                          </span>
                        </div>
                      )}
                    </div>
                    {s.phone && (
                      <a href={phoneHref(s.phone)} className="text-sm font-semibold text-(--clay)">
                        {s.phone}
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-(--ink)/80">{s.description}</p>
                  <p className="mt-1 text-sm text-(--ink)/70">{s.address}</p>
                  {s.notes && <p className="mt-2 text-xs text-(--ink)/60">{s.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <p className="mt-3 text-xs text-(--ink)/60">
        Ratings shown are a single Tripadvisor figure where one exists — several of these
        shops don&apos;t have enough reviews across platforms yet for a blended score.
        Hours and inventory change; call ahead for anything specific.
        {verified ? ` Directory last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
