'use client'

import { useMemo, useState } from 'react'
import {
  BOAT_RENTALS,
  BOAT_MARKETPLACES,
  boatRentalsLastVerified,
  type BoatType,
} from '@/data/facts'

type SortKey = 'name' | 'hourly' | 'halfDay' | 'fullDay'

const TYPE_FILTERS: { value: BoatType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pontoon', label: 'Pontoon' },
  { value: 'kayak', label: 'Kayak' },
  { value: 'paddleboard', label: 'Paddleboard' },
  { value: 'jetski', label: 'Jet ski' },
  { value: 'fishing', label: 'Fishing' },
  { value: 'slip', label: 'Boat slip' },
]

function money(n: number | null): string {
  return typeof n === 'number' ? `$${n}` : '—'
}

// Nulls sort last in every direction — an unknown price is not "cheapest".
function compare(a: number | null, b: number | null): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  return a - b
}

function YesNo({ value }: { value: boolean | null }) {
  if (value === null) return <span className="text-[--ink]/40">—</span>
  return (
    <span className={value ? 'text-[--forest]' : 'text-[--ink]/50'}>
      {value ? 'Yes' : 'No'}
    </span>
  )
}

export function BoatRentalTable() {
  const [type, setType] = useState<BoatType | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('fullDay')

  const rows = useMemo(() => {
    const filtered =
      type === 'all'
        ? BOAT_RENTALS
        : BOAT_RENTALS.filter((o) => o.types.includes(type))

    return [...filtered].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      return compare(a.rates[sort], b.rates[sort])
    })
  }, [type, sort])

  const verified = boatRentalsLastVerified()

  return (
    <div className="not-prose my-8">
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setType(f.value)}
              aria-pressed={type === f.value}
              className={
                type === f.value
                  ? 'rounded-full border border-[--lake] bg-[--lake] px-3 py-1 text-sm text-white'
                  : 'rounded-full border border-[--sand] bg-white px-3 py-1 text-sm text-[--ink] transition hover:border-[--lake]'
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="ml-auto flex items-center gap-2 text-sm text-[--ink]/70">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-[--sand] bg-white px-2 py-1 text-[--ink]"
          >
            <option value="fullDay">Full day price</option>
            <option value="halfDay">Half day price</option>
            <option value="hourly">Hourly price</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      {/* Desktop table */}
      <div className="overflow-x-auto">
        <table className="hidden w-full border-collapse text-sm sm:table">
          <thead>
            <tr className="bg-[--forest] text-white">
              <th className="px-4 py-3 text-left font-semibold">Operator</th>
              <th className="px-4 py-3 text-left font-semibold">Capacity</th>
              <th className="px-4 py-3 text-left font-semibold">Hourly</th>
              <th className="px-4 py-3 text-left font-semibold">Half day</th>
              <th className="px-4 py-3 text-left font-semibold">Full day</th>
              <th className="px-4 py-3 text-left font-semibold">Fuel incl.</th>
              <th className="px-4 py-3 text-left font-semibold">Delivers</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o, ri) => (
              <tr key={o.id} className={ri % 2 === 0 ? 'bg-white' : 'bg-[--sand]'}>
                <td className="px-4 py-3 text-[--ink]">
                  {o.website ? (
                    <a
                      href={o.website}
                      target="_blank"
                      rel="noopener nofollow"
                      className="font-medium text-[--lake] underline underline-offset-2"
                    >
                      {o.name}
                    </a>
                  ) : (
                    <span className="font-medium">{o.name}</span>
                  )}
                  {o.note ? (
                    <span className="mt-1 block text-xs text-[--ink]/70">
                      {o.note}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[--ink]">{o.capacity ?? '—'}</td>
                <td className="px-4 py-3 text-[--ink]">{money(o.rates.hourly)}</td>
                <td className="px-4 py-3 text-[--ink]">{money(o.rates.halfDay)}</td>
                <td className="px-4 py-3 font-semibold text-[--ink]">
                  {money(o.rates.fullDay)}
                </td>
                <td className="px-4 py-3">
                  <YesNo value={o.fuelIncluded} />
                </td>
                <td className="px-4 py-3">
                  <YesNo value={o.delivery} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card stack */}
      <div className="flex flex-col gap-4 sm:hidden">
        {rows.map((o) => (
          <div
            key={o.id}
            className="rounded-lg border border-[--sand] bg-white p-4"
          >
            {o.website ? (
              <a
                href={o.website}
                target="_blank"
                rel="noopener nofollow"
                className="font-semibold text-[--lake] underline"
              >
                {o.name}
              </a>
            ) : (
              <span className="font-semibold text-[--forest]">{o.name}</span>
            )}
            {o.capacity ? (
              <div className="mt-0.5 text-xs text-[--ink]/70">{o.capacity}</div>
            ) : null}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div>
                <div className="text-xs font-semibold text-[--ink]/60">
                  Hourly
                </div>
                <div className="text-sm text-[--ink]">
                  {money(o.rates.hourly)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[--ink]/60">
                  Half day
                </div>
                <div className="text-sm text-[--ink]">
                  {money(o.rates.halfDay)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[--ink]/60">
                  Full day
                </div>
                <div className="text-sm font-semibold text-[--ink]">
                  {money(o.rates.fullDay)}
                </div>
              </div>
            </div>
            {o.note ? (
              <p className="mt-2 text-xs text-[--ink]/70">{o.note}</p>
            ) : null}
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-[--sand] bg-white p-6 text-center text-sm text-[--ink]/70">
          No operators listed for that category yet.
        </p>
      ) : null}

      {/* Peer-to-peer marketplaces */}
      <div className="mt-6 rounded-lg border border-[--sand] bg-[--sand]/40 p-4">
        <h3 className="text-sm font-semibold text-[--forest]">
          Peer-to-peer marketplaces
        </h3>
        <p className="mt-1 text-xs text-[--ink]/70">
          Individual owners rather than local operators. Rates start lower;
          condition and terms vary listing to listing.
        </p>
        <ul className="mt-3 space-y-2">
          {BOAT_MARKETPLACES.map((m) => (
            <li key={m.id} className="text-sm text-[--ink]">
              <a
                href={m.source}
                target="_blank"
                rel="noopener nofollow"
                className="font-medium text-[--lake] underline underline-offset-2"
              >
                {m.name}
              </a>
              {m.startingRate ? (
                <span className="text-[--ink]/70">
                  {' '}
                  — from ${m.startingRate}
                  {m.id === 'boatsetter' ? '/hr' : ''}
                </span>
              ) : null}
              <span className="mt-0.5 block text-xs text-[--ink]/60">
                {m.note}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-xs text-[--ink]/60">
        An em dash means we have not confirmed that figure directly with the
        operator. We would rather show nothing than a number that turns out to
        be wrong at the dock.
        {verified ? ` Prices last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
