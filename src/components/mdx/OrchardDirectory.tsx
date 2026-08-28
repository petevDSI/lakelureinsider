import { ORCHARDS, ORCHARD_AREAS, orchardsLastVerified } from '@/data/facts'

function Stars({ score }: { score: number }) {
  const full = Math.round(score)
  return (
    <span className="text-(--clay)" aria-hidden="true">
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)}
    </span>
  )
}

function UPickBadge({ uPick }: { uPick: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
        uPick ? 'bg-(--forest)/15 text-(--forest)' : 'bg-(--sand) text-(--ink)/70'
      }`}
    >
      {uPick ? 'U-Pick' : 'We-Pick'}
    </span>
  )
}

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d]/g, '')}`
}

export function OrchardDirectory() {
  const verified = orchardsLastVerified()

  return (
    <div className="not-prose my-8">
      {ORCHARD_AREAS.map((area) => {
        const orchards = ORCHARDS.filter((o) => o.area === area)
        if (orchards.length === 0) return null

        return (
          <div key={area} className="mb-8 last:mb-0">
            <h3 className="mb-3 font-display text-lg font-bold text-(--forest)">{area}</h3>

            <div className="flex flex-col gap-3">
              {orchards.map((o) => (
                <div key={o.id} className="rounded-lg border border-(--sand) bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {o.website ? (
                          <a
                            href={o.website}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="font-semibold text-(--lake) underline underline-offset-2"
                          >
                            {o.name}
                          </a>
                        ) : (
                          <span className="font-semibold text-(--ink)">{o.name}</span>
                        )}
                        <UPickBadge uPick={o.uPick} />
                      </div>
                      {o.rating && (
                        <div className="mt-1 flex items-center gap-1.5 text-sm">
                          <Stars score={o.rating.score} />
                          <span className="text-(--ink)/70">
                            {o.rating.score.toFixed(1)} ({o.rating.reviewCount} reviews on{' '}
                            {o.rating.source})
                          </span>
                        </div>
                      )}
                    </div>
                    {o.phone && (
                      <a href={phoneHref(o.phone)} className="text-sm font-semibold text-(--clay)">
                        {o.phone}
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-(--ink)/80">{o.varieties}</p>
                  <p className="mt-1 text-sm text-(--ink)/70">{o.address}</p>
                  <p className="mt-1 text-xs text-(--ink)/60">{o.amenities}</p>
                  {o.notes && <p className="mt-2 text-xs text-(--ink)/60">{o.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <p className="mt-3 text-xs text-(--ink)/60">
        Apple picking is seasonal — typically September through October, weather and crop
        permitting — and hours vary by farm and by week. Call ahead before you drive out.
        Ratings shown are a single Tripadvisor figure where one exists.
        {verified ? ` Directory last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
