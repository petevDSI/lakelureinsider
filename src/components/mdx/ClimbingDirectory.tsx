import { CLIMBING_SPOTS, CLIMBING_SPOT_TYPES, climbingSpotsLastVerified, type ClimbingAreaType } from '@/data/facts'

const TYPE_STYLE: Record<ClimbingAreaType, string> = {
  'Climbing Area': 'bg-(--forest)/15 text-(--forest)',
  'Guide Service': 'bg-(--clay)/15 text-(--clay)',
}

function TypeBadge({ type }: { type: ClimbingAreaType }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_STYLE[type]}`}>
      {type}
    </span>
  )
}

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d]/g, '')}`
}

export function ClimbingDirectory() {
  const verified = climbingSpotsLastVerified()

  return (
    <div className="not-prose my-8">
      {CLIMBING_SPOT_TYPES.map((type) => {
        const spots = CLIMBING_SPOTS.filter((c) => c.type === type)
        if (spots.length === 0) return null

        return (
          <div key={type} className="mb-8 last:mb-0">
            <h3 className="mb-3 font-display text-lg font-bold text-(--forest)">
              {type === 'Climbing Area' ? 'Climbing Areas' : 'Guide Services'}
            </h3>

            <div className="flex flex-col gap-3">
              {spots.map((c) => (
                <div key={c.id} className="rounded-lg border border-(--sand) bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {c.website ? (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="font-semibold text-(--lake) underline underline-offset-2"
                        >
                          {c.name}
                        </a>
                      ) : (
                        <span className="font-semibold text-(--ink)">{c.name}</span>
                      )}
                      <TypeBadge type={c.type} />
                    </div>
                    {c.phone && (
                      <a href={phoneHref(c.phone)} className="text-sm font-semibold text-(--clay)">
                        {c.phone}
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-(--ink)/80">{c.description}</p>
                  <p className="mt-1 text-sm text-(--ink)/70">{c.address}</p>
                  <p className="mt-1 text-xs text-(--ink)/60">{c.access}</p>
                  {c.notes && <p className="mt-2 text-xs text-(--ink)/60">{c.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <p className="mt-3 text-xs text-(--ink)/60">
        Conditions, permits, and closures at these areas can change — check ncparks.gov or
        carolinaclimbers.org before you go, especially for seasonal wildlife closures.
        {verified ? ` Directory last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
