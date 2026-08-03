import type { PlaceRecord, PlaceTag } from '@/types/places'

const TAG_LABELS: Record<PlaceTag, string> = {
  petFriendly: 'Pet friendly',
  fuelIncluded: 'Fuel included',
  delivery: 'Delivery',
  waterfront: 'Waterfront',
  rvHookup: 'RV hookup',
  tentSites: 'Tent sites',
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-full border border-[--lake]/30 bg-[--lake]/8 px-2 py-0.5 text-xs font-medium text-[--lake]">
      {label}
    </span>
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
        <p className="text-sm text-[--ink]/70">
          From <span className="font-semibold text-[--ink]">${record.priceFrom}</span>
          {record.priceUnit && <span className="text-[--ink]/50"> {record.priceUnit}</span>}
        </p>
      )
    }
    if (record.priceNotes) {
      return <p className="text-sm text-[--ink]/60 italic">{record.priceNotes}</p>
    }
    return null
  }

  return (
    <div className="space-y-2">
      {record.rateCards.map((card, i) => (
        <div key={i} className={card.unconfirmed ? 'opacity-70' : undefined}>
          {card.label && (
            <p className="text-xs font-medium text-[--ink]/60 uppercase tracking-wide mb-1">
              {card.label}
              {card.unconfirmed && <span className="text-amber-600"> — unconfirmed</span>}
            </p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {card.rates.map((rate, j) => (
              <span key={j} className="text-sm text-[--ink]/80">
                <span className="font-semibold">${rate.price}</span>
                <span className="text-[--ink]/50"> / {rate.duration}</span>
              </span>
            ))}
          </div>
          {card.fuelIncluded != null && (
            <p className="text-xs text-[--ink]/50 mt-0.5">
              Fuel {card.fuelIncluded ? 'included' : 'not included'}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export function PlaceCard({ record }: { record: PlaceRecord }) {
  return (
    <div className="rounded-lg border border-[--sand] bg-white p-4 flex flex-col gap-3">
      <div>
        <h3 className="font-display font-semibold text-[--forest] text-lg leading-tight">
          {record.name}
        </h3>
        {record.address && (
          <p className="text-sm text-[--ink]/50 mt-0.5">{record.address}</p>
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
        <p className="text-sm text-[--ink]/70 border-l-2 border-[--clay] pl-3">
          {record.insiderNote}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        {record.phone && (
          <a
            href={`tel:${record.phone.replace(/\D/g, '')}`}
            className="text-sm font-medium text-[--lake] hover:underline"
          >
            {record.phone}
          </a>
        )}
        {record.website && (
          <a
            href={record.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[--lake] hover:underline"
          >
            Website →
          </a>
        )}
      </div>

      <p className="text-xs text-[--ink]/35 mt-auto">
        Verified {record.lastVerified}
      </p>
    </div>
  )
}
