import { GOLF_COURSES, golfCoursesLastVerified } from '@/data/facts'

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

export function GolfDirectory() {
  const verified = golfCoursesLastVerified()

  return (
    <div className="not-prose my-8">
      <div className="flex flex-col gap-3">
        {GOLF_COURSES.map((g) => (
          <div key={g.id} className="rounded-lg border border-(--sand) bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                {g.website ? (
                  <a
                    href={g.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-semibold text-(--lake) underline underline-offset-2"
                  >
                    {g.name}
                  </a>
                ) : (
                  <span className="font-semibold text-(--ink)">{g.name}</span>
                )}
                {g.rating && (
                  <div className="mt-1 flex items-center gap-1.5 text-sm">
                    <Stars score={g.rating.score} />
                    <span className="text-(--ink)/70">
                      {g.rating.score.toFixed(1)} ({g.rating.reviewCount} reviews on{' '}
                      {g.rating.source})
                    </span>
                  </div>
                )}
              </div>
              {g.phone && (
                <a href={phoneHref(g.phone)} className="text-sm font-semibold text-(--clay)">
                  {g.phone}
                </a>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div>
                <div className="text-xs font-semibold text-(--ink)/60">Holes</div>
                <div className="text-sm text-(--ink)">{g.holes}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-(--ink)/60">Par</div>
                <div className="text-sm text-(--ink)">{g.par}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-(--ink)/60">Yardage</div>
                <div className="text-sm text-(--ink)">{g.yardage ?? '—'}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-(--ink)/60">Designer</div>
                <div className="text-sm text-(--ink)">{g.designer ?? '—'}</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-(--ink)/80">{g.address}</p>
            <p className="mt-1 text-xs text-(--ink)/60">{g.access}</p>
            {g.notes && <p className="mt-2 text-xs text-(--ink)/60">{g.notes}</p>}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-(--ink)/60">
        Call ahead for tee times, especially at the resort courses — availability for
        non-guests can vary by season.
        {verified ? ` Directory last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
