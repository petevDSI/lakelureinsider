import type { PlaceRecord, RateCard } from '@/types/places'

export interface CompareRow {
  id: string
  name: string
  targetRate: number | null
  targetLabel: string
  targetUnconfirmed: boolean
  fuelIncluded: boolean | null
  fullDayRate: number | null
  fullDayUnconfirmed: boolean
  conflictNote: string | null
  insiderNote: string | null
}

function findRate(
  cards: RateCard[],
  targetHours: number,
): {
  price: number | null
  label: string
  unconfirmed: boolean
  fuelIncluded: boolean | null
} {
  if (!cards || cards.length === 0) {
    return { price: null, label: '—', unconfirmed: false, fuelIncluded: null }
  }
  if (cards.every((c) => c.unconfirmed)) {
    return { price: null, label: 'Call to confirm', unconfirmed: true, fuelIncluded: null }
  }

  let bestCard: RateCard | null = null
  let bestPrice: number | null = null
  let bestLabel = '—'
  let bestDiff = Infinity

  for (const card of cards) {
    if (card.unconfirmed) continue
    for (const rate of card.rates) {
      const match = rate.duration.match(/^(\d+)\s*hour/)
      if (!match) continue
      const hours = parseInt(match[1])
      const diff = Math.abs(hours - targetHours)
      if (diff < bestDiff) {
        bestDiff = diff
        bestPrice = rate.price
        bestLabel = rate.duration
        bestCard = card
      }
    }
  }

  return {
    price: bestPrice,
    label: bestLabel,
    unconfirmed: false,
    fuelIncluded: bestCard?.fuelIncluded ?? null,
  }
}

function findFullDayRate(cards: RateCard[]): { price: number | null; unconfirmed: boolean } {
  if (!cards || cards.length === 0) return { price: null, unconfirmed: false }
  if (cards.every((c) => c.unconfirmed)) return { price: null, unconfirmed: true }

  for (const card of cards) {
    if (card.unconfirmed) continue
    for (const rate of card.rates) {
      if (rate.duration.toLowerCase().includes('full') || rate.duration.includes('8')) {
        return { price: rate.price, unconfirmed: false }
      }
    }
  }
  return { price: null, unconfirmed: false }
}

export function buildCompareRows(places: PlaceRecord[], targetHours = 4): CompareRow[] {
  return places.map((p) => {
    const target = findRate(p.rateCards ?? [], targetHours)
    const fullDay = findFullDayRate(p.rateCards ?? [])
    return {
      id: p.id,
      name: p.name,
      targetRate: target.price,
      targetLabel: target.label,
      targetUnconfirmed: target.unconfirmed,
      fuelIncluded: target.fuelIncluded ?? (p.tags?.includes('fuelIncluded') ? true : null),
      fullDayRate: fullDay.price,
      fullDayUnconfirmed: fullDay.unconfirmed,
      conflictNote: p.conflictNote ?? null,
      insiderNote: p.insiderNote ?? null,
    }
  })
}
