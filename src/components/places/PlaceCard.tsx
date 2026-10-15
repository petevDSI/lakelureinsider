import type { PlaceRecord, PlaceTag } from '@/types/places'

const TAG_LABELS: Record<PlaceTag, string> = {
  petFriendly: 'Pet friendly',
  fuelIncluded: 'Fuel included',
  delivery: 'Delivery',
  waterfront: 'Waterfront',
  rvHookup: 'RV hookup',
  tentSites: 'Tent sites',
  locallyOwned: 'Locally owned',
  freeCooler: 'Free Yeti cooler',
  membersOnly: 'Members & guests only',
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
      <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
      <path d="M4.5 8.3l2.2 2.2 4.8-4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-(--lake)/10 px-2.5 py-1 text-xs font-medium text-(--lake)">
      <Check />
      {label}
    </span>
  )
}

function RidgeBand() {
  return (
    <svg viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-14 w-full">
      <path d="M0 40 C40 22 70 30 110 24 S180 10 220 22 S300 34 340 20 S390 18 400 24 V60 H0Z" fill="#2A6F7F" opacity="0.45" />
      <path d="M0 50 C50 36 90 46 140 38 S220 28 270 40 S350 48 400 36 V60 H0Z" fill="#FFFFFF" />
    </svg>
  )
}

function RateSummary({ record }: { record: PlaceRecord }) {
  if (record.conflictNote) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        ⚠ {record.conflictNote}
      </div>
    )
  }

  if (!record.rateCards || record.rateCards.length === 0) {
    if (record.priceFrom != null) {
      return (
        <p className="text-sm text-(--ink)/70">
          From <span className="font-semibold text-(--ink)">${record.priceFrom}</span>
          {record.priceUnit && <span className="text-(--ink)/50"> {record.priceUnit}</span>}
        </p>
      )
    }
    if (record.priceNotes) {
      return <p className="text-sm text-(--ink)/60 italic">{record.priceNotes}</p>
    }
    return null
  }

  return (
    <div className="space-y-4">
      {record.rateCards.map((card, i) => (
        <div key={i} className={card.unconfirmed ? 'opacity-70' : undefined}>
          {card.label && (
            <p className="mb-1.5 text-sm font-semibold text-(--forest)">
              {card.label}
              {card.unconfirmed && <span className="font-normal text-amber-600"> (unconfirmed)</span>}
            </p>
          )}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
            {card.rates.map((rate, j) => (
              <div key={j} className="rounded-lg bg-(--sand)/60 px-3 py-2 text-center">
                <div className="font-display text-xl font-bold leading-none text-(--forest)">${rate.price}</div>
                <div className="mt-1 text-xs leading-tight text-(--ink)/65">{rate.duration}</div>
              </div>
            ))}
          </div>
          {card.fuelIncluded != null && (
            <p className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${card.fuelIncluded ? 'text-emerald-700' : 'text-(--ink)/55'}`}>
              {card.fuelIncluded && <Check />}
              Fuel {card.fuelIncluded ? 'included' : 'not included'}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function FeaturedCard({ record }: { record: PlaceRecord }) {
  const perks = (record.tags ?? []).filter((t) => t !== 'locallyOwned')
  return (
    <div className="overflow-hidden rounded-2xl border border-(--forest)/20 bg-white shadow-md">
      <div className="relative bg-(--forest) px-6 pb-16 pt-6 text-white">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--forest)">
            ★ Featured local pick
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            Locally owned, family run
          </span>
        </div>
        <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          {record.name}
        </h3>
        {record.address && <p className="mt-1 text-sm text-white/75">{record.address}</p>}
        <RidgeBand />
      </div>

      <div className="flex flex-col gap-6 p-6">
        {record.featuredNote && (
          <p className="text-lg leading-snug text-(--ink)/85">{record.featuredNote}</p>
        )}

        {(record.rating || perks.length > 0) && (
          <div className="flex flex-wrap items-center gap-3">
            {record.rating && (
              <div className="flex items-center gap-2 rounded-lg bg-(--sand)/60 px-3 py-2">
                <span className="font-display text-2xl font-bold leading-none text-(--forest)">{record.rating}</span>
                <span className="text-xs leading-tight text-(--ink)/70">
                  <span aria-hidden="true" className="block text-sm tracking-tight text-(--forest)">★★★★★</span>
                  {record.reviewCount ? `${record.reviewCount} Tripadvisor reviews` : 'Tripadvisor'}
                </span>
              </div>
            )}
            {perks.map((tag) => (
              <Chip key={tag} label={TAG_LABELS[tag] ?? tag} />
            ))}
          </div>
        )}

        <RateSummary record={record} />

        {record.highlights && record.highlights.length > 0 && (
          <ul className="not-prose m-0 grid list-none gap-x-6 gap-y-2.5 p-0 text-sm text-(--ink)/85 sm:grid-cols-2">
            {record.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-(--lake)">
                <span className="mt-0.5"><Check /></span>
                <span className="text-(--ink)/85">{h}</span>
              </li>
            ))}
          </ul>
        )}

        {record.reviewSummary && (
          <p className="text-sm text-(--ink)/70">{record.reviewSummary}</p>
        )}

        {record.insiderNote && (
          <p className="border-l-2 border-(--clay) pl-3 text-sm text-(--ink)/70">{record.insiderNote}</p>
        )}

        {record.hours && <p className="text-sm text-(--ink)/65">Hours: {record.hours}</p>}

        <div className="flex flex-wrap items-center gap-4 border-t border-(--sand) pt-5">
          {record.phone && (
            <a
              href={`tel:${record.phone.replace(/\D/g, '')}`}
              className="inline-block rounded-lg bg-(--clay) px-6 py-3 text-base font-semibold text-white hover:opacity-90"
            >
              Call {record.phone}
            </a>
          )}
          {record.website && (
            <a
              href={record.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-(--lake) hover:underline"
            >
              Visit their website →
            </a>
          )}
          <p className="ml-auto text-xs text-(--ink)/45">Verified {record.lastVerified}</p>
        </div>
      </div>
    </div>
  )
}

export function PlaceCard({ record }: { record: PlaceRecord }) {
  if (record.featured) return <FeaturedCard record={record} />
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-(--sand) border-t-4 border-t-(--lake) bg-white p-5 shadow-sm">
      <div>
        <h3 className="mt-0 font-display text-xl font-bold leading-tight text-(--forest)">
          {record.name}
        </h3>
        {record.address && (
          <p className="text-sm text-(--ink)/50 mt-0.5">{record.address}</p>
        )}
      </div>

      <RateSummary record={record} />

      {record.tags && record.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {record.tags.map((tag) => (
            <Chip key={tag} label={TAG_LABELS[tag] ?? tag} />
          ))}
        </div>
      )}

      {record.insiderNote && (
        <p className="text-sm text-(--ink)/70 border-l-2 border-(--clay) pl-3">
          {record.insiderNote}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        {record.phone && (
          <a
            href={`tel:${record.phone.replace(/\D/g, '')}`}
            className="inline-block rounded-lg bg-(--clay) px-3 py-1.5 text-sm font-semibold !text-white no-underline hover:opacity-90"
          >
            {record.phone}
          </a>
        )}
        {record.website && (
          <a
            href={record.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-(--lake) hover:underline"
          >
            Website →
          </a>
        )}
      </div>

      <p className="text-xs text-(--ink)/35 mt-auto">
        Verified {record.lastVerified}
      </p>
    </div>
  )
}
