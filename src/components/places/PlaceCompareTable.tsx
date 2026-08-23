'use client'

import { useState } from 'react'
import type { CompareRow } from '@/lib/compare'

type SortKey = 'name' | 'targetRate' | 'fullDayRate'

function FuelCell({ included }: { included: boolean | null }) {
  if (included === null) return <td className="px-3 py-2 text-sm text-(--ink)/40">—</td>
  return (
    <td className={`px-3 py-2 text-sm font-medium ${included ? 'text-emerald-700' : 'text-(--ink)/60'}`}>
      {included ? 'Yes' : 'No'}
    </td>
  )
}

function RateCell({
  price,
  label,
  unconfirmed,
  conflictNote,
}: {
  price: number | null
  label: string
  unconfirmed: boolean
  conflictNote?: string | null
}) {
  if (conflictNote) {
    return (
      <td className="px-3 py-2 text-sm">
        <span className="text-amber-700 font-medium">See note ↓</span>
      </td>
    )
  }
  if (unconfirmed || price === null) {
    return <td className="px-3 py-2 text-sm text-amber-700">{label || '—'}</td>
  }
  return (
    <td className="px-3 py-2 text-sm">
      <span className="font-semibold">${price}</span>
      {label && label !== '—' && (
        <span className="block text-xs text-(--ink)/45">{label}</span>
      )}
    </td>
  )
}

export function PlaceCompareTable({
  rows,
  targetHoursLabel = '~4 hours',
}: {
  rows: CompareRow[]
  targetHoursLabel?: string
}) {
  const [sortKey, setSortKey] = useState<SortKey>('targetRate')
  const [sortAsc, setSortAsc] = useState(true)

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((a) => !a)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const sorted = [...rows].sort((a, b) => {
    let av: number | string | null
    let bv: number | string | null
    if (sortKey === 'name') {
      av = a.name
      bv = b.name
    } else if (sortKey === 'targetRate') {
      av = a.targetRate
      bv = b.targetRate
    } else {
      av = a.fullDayRate
      bv = b.fullDayRate
    }
    if (av === null && bv === null) return 0
    if (av === null) return sortAsc ? 1 : -1
    if (bv === null) return sortAsc ? -1 : 1
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av)
    }
    return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number)
  })

  function SortHeader({ label, k }: { label: string; k: SortKey }) {
    const active = sortKey === k
    return (
      <th
        className="px-3 py-2 text-left text-xs font-semibold text-(--ink)/60 uppercase tracking-wide cursor-pointer select-none hover:text-(--lake) whitespace-nowrap"
        onClick={() => handleSort(k)}
      >
        {label}
        <span className="ml-1 text-(--ink)/30">{active ? (sortAsc ? '↑' : '↓') : '↕'}</span>
      </th>
    )
  }

  const conflictRows = sorted.filter((r) => r.conflictNote)

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-(--sand)">
      <table className="w-full min-w-[560px] text-sm">
        <thead className="bg-(--sand)/60">
          <tr>
            <SortHeader label="Operator" k="name" />
            <SortHeader label={targetHoursLabel} k="targetRate" />
            <th className="px-3 py-2 text-left text-xs font-semibold text-(--ink)/60 uppercase tracking-wide whitespace-nowrap">
              Fuel included?
            </th>
            <SortHeader label="Full day (8 hr)" k="fullDayRate" />
          </tr>
        </thead>
        <tbody className="divide-y divide-(--sand)">
          {sorted.map((row) => (
            <tr key={row.id} className="bg-white hover:bg-(--sand)/30">
              <td className="px-3 py-2 font-medium text-(--forest)">{row.name}</td>
              <RateCell
                price={row.targetRate}
                label={row.targetLabel}
                unconfirmed={row.targetUnconfirmed}
                conflictNote={row.conflictNote}
              />
              <FuelCell included={row.fuelIncluded} />
              <RateCell price={row.fullDayRate} label="" unconfirmed={row.fullDayUnconfirmed} />
            </tr>
          ))}
        </tbody>
      </table>

      {conflictRows.length > 0 && (
        <div className="border-t border-(--sand) bg-amber-50/60 px-3 py-3 space-y-1">
          {conflictRows.map((r) => (
            <p key={r.id} className="text-xs text-amber-800">
              <span className="font-semibold">{r.name}:</span> {r.conflictNote}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
