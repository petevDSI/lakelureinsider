'use client'

import { useState } from 'react'
import {
  CR_WEDDING_RENTALS,
  CR_WEDDING_ADMISSION,
  getWeddingFee,
  getWeddingAdmission,
  type WeddingRentalOption,
} from '@/data/facts'

function fmt(n: number) {
  return `$${n}`
}

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
        <span className="w-8 text-center text-sm font-semibold tabular-nums text-[--ink]">
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

type Insight = { type: 'save' | 'warn'; message: string }

function getInsight(adults: number, youth: number): Insight | null {
  const total = adults + youth
  if (total >= 6 && total <= 9) {
    // Verified: 9-guest ceremony = $200 fee + 9×$17 = $353.
    // 10-guest ceremony = $200 fee + 10×$14 = $340. Adding a guest saves $13.
    return {
      type: 'save',
      message:
        'Invite one more guest — group admission ($14/adult) kicks in at 10 total. ' +
        'A 9-guest ceremony costs $353; a 10-guest ceremony costs $340. ' +
        'Adding one person saves $13.',
    }
  }
  if (total === 5) {
    // 5 guests: $175 fee + 5×$17 = $260. 6 guests: $200 fee + 6×$17 = $302. Jump: $42.
    return {
      type: 'warn',
      message:
        'Five is a sweet spot — a 6th guest adds $42 (fee tier jumps from $175 to $200 plus one more admission).',
    }
  }
  if (total === 15) {
    // 15 guests: $200 fee + 15×$14 = $410. 16 guests: $250 fee + 16×$14 = $474. Jump: $64.
    return {
      type: 'warn',
      message:
        'Fifteen is a sweet spot — a 16th guest adds $64 (fee tier jumps from $200 to $250 plus one more admission).',
    }
  }
  return null
}

export function WeddingCostCalculator() {
  const [adults, setAdults] = useState(10)
  const [youth, setYouth] = useState(0)
  const [rentalKey, setRentalKey] = useState('none')

  const total = adults + youth
  const fee = getWeddingFee(total)
  const admission = getWeddingAdmission(adults, youth)
  const rental = CR_WEDDING_RENTALS.find((r) => r.key === rentalKey) as WeddingRentalOption
  const grandTotal = fee + admission + rental.price
  const isGroup = total >= CR_WEDDING_ADMISSION.groupThreshold

  const insight = getInsight(adults, youth)

  return (
    <div className="not-prose my-10 rounded-xl border border-[--sand] bg-white">
      <div className="border-b border-[--sand] px-5 py-4">
        <p className="font-display font-bold text-[--forest]">Wedding Cost Calculator</p>
        <p className="mt-0.5 text-xs text-[--ink]/60">
          Ceremony fee + park admission + optional reception rental — verified 2026-08-02
        </p>
      </div>

      <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
        <Stepper label="Adults (16+)" value={adults} min={1} max={150} onChange={setAdults} />
        <Stepper
          label="Youth (ages 5–15)"
          value={youth}
          min={0}
          max={150}
          onChange={setYouth}
        />
      </div>

      <div className="border-t border-[--sand] px-5 py-3">
        <p className="mb-2 text-sm font-medium text-[--ink]">Reception rental (optional)</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {CR_WEDDING_RENTALS.map((opt) => (
            <label
              key={opt.key}
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 text-sm transition-colors ${
                rentalKey === opt.key
                  ? 'border-[--lake] bg-[--lake]/5'
                  : 'border-[--sand] hover:border-[--lake]/40'
              }`}
            >
              <input
                type="radio"
                name="rental"
                value={opt.key}
                checked={rentalKey === opt.key}
                onChange={() => setRentalKey(opt.key)}
                className="mt-0.5 accent-[--lake]"
              />
              <span>
                <span className="font-medium text-[--forest]">{opt.label}</span>
                {opt.duration && (
                  <span className="text-[--ink]/60"> — {opt.duration}</span>
                )}
                <span className="mt-0.5 block font-semibold text-[--ink]">
                  {opt.price === 0 ? 'No extra charge' : fmt(opt.price)}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {insight && (
        <div
          className={`mx-5 mt-3 rounded-lg px-4 py-3 text-sm ${
            insight.type === 'save'
              ? 'bg-[--lake]/10 text-[--lake]'
              : 'bg-[--clay]/10 text-[--clay]'
          }`}
        >
          <span className="font-semibold">{insight.type === 'save' ? '⚡ Insider: ' : '⚠ Note: '}</span>
          {insight.message}
        </div>
      )}

      <div className="mt-4 border-t border-[--sand]">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-[--sand]">
            <tr>
              <td className="px-5 py-3 text-[--ink]/70">Wedding ceremony fee ({total} guests)</td>
              <td className="px-5 py-3 text-right tabular-nums font-medium text-[--ink]">
                {fmt(fee)}
              </td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-[--ink]/70">
                Park admission — {adults} adult{adults !== 1 ? 's' : ''}
                {youth > 0 ? `, ${youth} youth` : ''}
                {isGroup && (
                  <span className="ml-1.5 rounded bg-[--lake]/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[--lake]">
                    group rate
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-right tabular-nums font-medium text-[--ink]">
                {fmt(admission)}
              </td>
            </tr>
            {rental.price > 0 && (
              <tr>
                <td className="px-5 py-3 text-[--ink]/70">{rental.label}</td>
                <td className="px-5 py-3 text-right tabular-nums font-medium text-[--ink]">
                  {fmt(rental.price)}
                </td>
              </tr>
            )}
            <tr className="bg-[--sand]/50">
              <td className="px-5 py-4 font-bold text-[--forest]">Estimated Total</td>
              <td className="px-5 py-4 text-right text-lg font-bold tabular-nums text-[--forest]">
                {fmt(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="px-5 py-2 text-[10px] text-[--ink]/40">
        Admission: {isGroup
          ? `group rate ${fmt(CR_WEDDING_ADMISSION.groupAdult)}/adult, ${fmt(CR_WEDDING_ADMISSION.groupYouth)}/youth (10+ guests)`
          : `standard ${fmt(CR_WEDDING_ADMISSION.standardAdult)}/adult, ${fmt(CR_WEDDING_ADMISSION.standardYouth)}/youth`}.{' '}
        Children under 5 free. Officiant and coordinator not included.
      </p>
    </div>
  )
}
