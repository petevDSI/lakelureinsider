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
      <div className="grid gap-4 sm:grid-cols-2">
        {GOLF_COURSES.map((g) => (
          <div key={g.id} className="rounded-xl border border-(--sand) border-t-4 border-t-(--lake) bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                {g.website ? (
                  <a
                    href={g.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-display text-lg font-bold leading-tight text-(--forest) no-underline hover:text-(--lake) hover:underline hover:underline-offset-2"
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
                <a href={phoneHref(g.phone)} className="inline-block rounded-lg bg-(--clay) px-3 py-1.5 text-sm font-semibold !text-white no-underline hover:opacity-90">
                  {g.phone}
                </a>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                ['Holes', String(g.holes)],
                ['Par', String(g.par)],
                ['Yardage', g.yardage ? String(g.yardage) : '—'],
                ['Designer', g.designer ?? '—'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-(--sand)/60 px-3 py-2">
                  <div className="font-display text-sm font-bold leading-tight text-(--forest)">{value}</div>
                  <div className="mt-0.5 text-xs text-(--ink)/65">{label}</div>
                </div>
              ))}
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
