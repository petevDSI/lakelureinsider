'use client'

import { useState } from 'react'
import type { PlaceRecord, PlaceTag } from '@/types/places'
import { PlaceCard } from './PlaceCard'

const TAG_LABELS: Record<PlaceTag, string> = {
  petFriendly: 'Pet friendly',
  fuelIncluded: 'Fuel included',
  delivery: 'Delivery',
  waterfront: 'Waterfront',
  rvHookup: 'RV hookup',
  tentSites: 'Tent sites',
}

export function PlaceListFilter({ places }: { places: PlaceRecord[] }) {
  const [activeTag, setActiveTag] = useState<PlaceTag | null>(null)

  const allTags = Array.from(
    new Set(places.flatMap((p) => p.tags ?? [])),
  ) as PlaceTag[]

  const filtered = activeTag
    ? places.filter((p) => p.tags?.includes(activeTag))
    : places

  return (
    <div>
      {allTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              activeTag === null
                ? 'border-[--lake] bg-[--lake] text-white'
                : 'border-[--sand] bg-white text-[--ink]/70 hover:border-[--lake]/50'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                activeTag === tag
                  ? 'border-[--lake] bg-[--lake] text-white'
                  : 'border-[--sand] bg-white text-[--ink]/70 hover:border-[--lake]/50'
              }`}
            >
              {TAG_LABELS[tag] ?? tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-[--ink]/50 py-4">No results for this filter.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((place) => (
            <PlaceCard key={place.id} record={place} />
          ))}
        </div>
      )}
    </div>
  )
}
