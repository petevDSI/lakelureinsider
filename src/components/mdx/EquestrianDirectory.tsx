import { EQUESTRIAN_CENTER, RIDING_STABLES, equestrianLastVerified } from '@/data/facts'

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d]/g, '')}`
}

export function EquestrianDirectory() {
  const verified = equestrianLastVerified()
  const c = EQUESTRIAN_CENTER

  return (
    <div className="not-prose my-8">
      <div className="rounded-lg border border-(--sand) bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <a
            href={c.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-display text-lg font-bold text-(--lake) underline underline-offset-2"
          >
            {c.name}
          </a>
          <a href={phoneHref(c.phone)} className="text-sm font-semibold text-(--clay)">
            {c.phone}
          </a>
        </div>
        <p className="mt-1 text-sm text-(--ink)/70">{c.address}</p>
        <p className="mt-3 text-sm text-(--ink)/80">{c.description}</p>

        <ul className="mt-4 flex flex-col gap-2">
          {c.highlights.map((h) => (
            <li key={h} className="flex gap-2 text-sm text-(--ink)/80">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-(--forest)" aria-hidden="true" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <a
          href={c.eventsUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-4 inline-block rounded-full bg-(--forest) px-4 py-2 text-sm font-semibold text-white"
        >
          See the full events calendar →
        </a>
      </div>

      {RIDING_STABLES.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 font-display text-lg font-bold text-(--forest)">
            Closer to Lake Lure: Trail Riding
          </h3>
          <div className="flex flex-col gap-3">
            {RIDING_STABLES.map((r) => (
              <div key={r.id} className="rounded-lg border border-(--sand) bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  {r.website ? (
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="font-semibold text-(--lake) underline underline-offset-2"
                    >
                      {r.name}
                    </a>
                  ) : (
                    <span className="font-semibold text-(--ink)">{r.name}</span>
                  )}
                  <a href={phoneHref(r.phone)} className="text-sm font-semibold text-(--clay)">
                    {r.phone}
                  </a>
                </div>
                <p className="mt-2 text-sm text-(--ink)/80">{r.description}</p>
                <p className="mt-1 text-sm text-(--ink)/70">{r.address}</p>
                {r.pricing && <p className="mt-1 text-xs text-(--ink)/60">{r.pricing}</p>}
                {r.restrictions && <p className="mt-1 text-xs text-(--ink)/60">{r.restrictions}</p>}
                {r.notes && <p className="mt-2 text-xs text-(--ink)/60">{r.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-(--ink)/60">
        Event schedules and hours change seasonally — check the venue&apos;s own calendar
        before you plan a trip around a specific show.
        {verified ? ` Directory last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
