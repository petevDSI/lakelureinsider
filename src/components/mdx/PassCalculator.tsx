'use client'

import { useState } from 'react'
import { CR_PRICES } from '@/data/facts'

const { adultDay, youthDay, adultAnnual, youthAnnual, familyAnnual } =
  CR_PRICES

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm font-medium text-[--ink]">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-7 w-7 items-center justify-center rounded border border-[--sand] text-[--ink] transition-colors hover:bg-[--sand] disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold tabular-nums text-[--ink]">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-7 w-7 items-center justify-center rounded border border-[--sand] text-[--ink] transition-colors hover:bg-[--sand] disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

function fmt(n: number) {
  return `$${n}`
}

type Option = { name: string; cost: number; note?: string }

export function PassCalculator() {
  const [adults, setAdults] = useState(2)
  const [youth, setYouth] = useState(2)
  const [visits, setVisits] = useState(2)

  const dayTotal = (adults * adultDay + youth * youthDay) * visits
  const individualAnnual = adults * adultAnnual + youth * youthAnnual

  // Family pass covers exactly 2 adults + up to 3 youth
  const familyApplicable = adults === 2 && youth <= 3
  const familyCost = familyApplicable ? familyAnnual : null

  const options: Option[] = [
    { name: 'Day tickets', cost: dayTotal },
    { name: 'Individual annual passes', cost: individualAnnual },
    ...(familyCost !== null
      ? [
          {
            name: 'Family annual pass',
            cost: familyCost,
            note:
              familyCost > individualAnnual
                ? `${fmt(familyCost - individualAnnual)} MORE than individual passes for this family size`
                : familyCost < individualAnnual
                  ? `${fmt(individualAnnual - familyCost)} less than individual passes`
                  : 'Same price as individual passes',
          },
        ]
      : []),
  ]

  const minCost = Math.min(...options.map((o) => o.cost))
  const winners = options.filter((o) => o.cost === minCost)
  const verdict = winners.map((w) => w.name).join(' or ')

  // Day ticket breakeven info
  const dayVsIndividual = Math.ceil(individualAnnual / (adults * adultDay + youth * youthDay))
  const dayVsFamily = familyCost !== null
    ? Math.ceil(familyAnnual / (adults * adultDay + youth * youthDay))
    : null

  return (
    <div className="not-prose my-10 rounded-xl border border-[--sand] bg-white">
      <div className="border-b border-[--sand] px-5 py-4">
        <p className="font-display font-bold text-[--forest]">
          Pass vs. Day Tickets Calculator
        </p>
        <p className="mt-0.5 text-xs text-[--ink]/60">
          All prices from facts.ts — verified {CR_PRICES.adultDay > 0 ? '2026-08-02' : ''}
        </p>
      </div>

      {/* Inputs */}
      <div className="grid gap-3 px-5 py-4 sm:grid-cols-3">
        <Stepper label="Adults" value={adults} min={1} max={6} onChange={setAdults} />
        <Stepper label="Youth (ages 5–15)" value={youth} min={0} max={6} onChange={setYouth} />
        <Stepper label="Visits this year" value={visits} min={1} max={10} onChange={setVisits} />
      </div>

      {/* Results table */}
      <div className="overflow-x-auto border-t border-[--sand]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[--sand]/60">
              <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[--ink]/60">
                Option
              </th>
              <th className="px-5 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-[--ink]/60">
                Total
              </th>
              <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[--ink]/60">
                Note
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[--sand]">
            {options.map((opt) => {
              const isWinner = opt.cost === minCost
              return (
                <tr
                  key={opt.name}
                  className={isWinner ? 'bg-[--lake]/5' : ''}
                >
                  <td className="px-5 py-3">
                    <span
                      className={
                        isWinner
                          ? 'font-semibold text-[--lake]'
                          : 'text-[--ink]'
                      }
                    >
                      {opt.name}
                    </span>
                    {isWinner && (
                      <span className="ml-2 rounded-full bg-[--lake] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        Best
                      </span>
                    )}
                  </td>
                  <td
                    className={`px-5 py-3 text-right tabular-nums ${
                      isWinner ? 'font-bold text-[--lake]' : 'text-[--ink]'
                    }`}
                  >
                    {fmt(opt.cost)}
                  </td>
                  <td className="px-5 py-3 text-xs text-[--ink]/60">
                    {opt.note ?? ''}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Verdict */}
      <div className="border-t border-[--sand] bg-[--sand]/40 px-5 py-4">
        <p className="text-sm">
          <span className="font-semibold text-[--forest]">
            For {visits} visit{visits > 1 ? 's' : ''}: {verdict}
          </span>
          {familyCost !== null && youth === 1 && (
            <span className="ml-1 text-[--clay]">
              — the family pass costs ${familyAnnual - individualAnnual} more
              for 2 adults + 1 youth.
            </span>
          )}
        </p>

        {/* Breakeven callout */}
        {visits < dayVsIndividual && (
          <p className="mt-1 text-xs text-[--ink]/60">
            Individual passes pay off at {dayVsIndividual}+ visits
            {dayVsFamily !== null && dayVsFamily !== dayVsIndividual
              ? `; family pass pays off at ${dayVsFamily}+ visits`
              : ''}
            .
          </p>
        )}

        {!familyApplicable && adults === 2 && youth > 3 && (
          <p className="mt-2 text-xs text-[--clay]">
            Family pass covers up to 3 youth; you have {youth}. Add individual
            passes for the extra {youth - 3} youth.
          </p>
        )}
        {!familyApplicable && adults !== 2 && (
          <p className="mt-2 text-xs text-[--ink]/50">
            Family annual pass covers 2 adults + up to 3 youth. Not shown for
            other adult counts.
          </p>
        )}
      </div>

      <p className="px-5 py-2 text-[10px] text-[--ink]/40">
        Prices: adult day {fmt(adultDay)}, youth day {fmt(youthDay)}, adult
        annual {fmt(adultAnnual)}, youth annual {fmt(youthAnnual)}, family
        annual {fmt(familyAnnual)}.
      </p>
    </div>
  )
}
