import { WINERIES, WINERY_TYPES, wineriesLastVerified, type WineryType } from '@/data/facts'

const TYPE_STYLE: Record<WineryType, string> = {
  Winery: 'bg-(--forest)/15 text-(--forest)',
  Cidery: 'bg-(--clay)/15 text-(--clay)',
}

function TypeBadge({ type }: { type: WineryType }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_STYLE[type]}`}>
      {type}
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

export function WineryDirectory() {
  const verified = wineriesLastVerified()

  return (
    <div className="not-prose my-8">
      {WINERY_TYPES.map((type) => {
        const spots = WINERIES.filter((w) => w.type === type)
        if (spots.length === 0) return null

        return (
          <div key={type} className="mb-8 last:mb-0">
            <h3 className="mb-3 font-display text-lg font-bold text-(--forest)">
              {type === 'Winery' ? 'Wineries' : 'Cideries'}
            </h3>

            <div className="flex flex-col gap-3">
              {spots.map((w) => (
                <div key={w.id} className="rounded-lg border border-(--sand) bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {w.website ? (
                          <a
                            href={w.website}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="font-semibold text-(--lake) underline underline-offset-2"
                          >
                            {w.name}
                          </a>
                        ) : (
                          <span className="font-semibold text-(--ink)">{w.name}</span>
                        )}
                        <TypeBadge type={w.type} />
                      </div>
                      {w.rating && (
                        <div className="mt-1 flex items-center gap-1.5 text-sm">
                          <Stars score={w.rating.score} />
                          <span className="text-(--ink)/70">
                            {w.rating.score.toFixed(1)} ({w.rating.reviewCount} reviews on{' '}
                            {w.rating.source})
                          </span>
                        </div>
                      )}
                    </div>
                    {w.phone && (
                      <a href={phoneHref(w.phone)} className="text-sm font-semibold text-(--clay)">
                        {w.phone}
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-(--ink)/80">{w.description}</p>
                  <p className="mt-1 text-sm text-(--ink)/70">{w.address}</p>
                  <p className="mt-1 text-xs text-(--ink)/60">{w.hours}</p>
                  {w.notes && <p className="mt-2 text-xs text-(--ink)/60">{w.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <p className="mt-3 text-xs text-(--ink)/60">
        Hours change seasonally at most of these — call ahead or check the winery&apos;s own
        site before you drive out. Ratings shown are a single Tripadvisor figure.
        {verified ? ` Directory last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
