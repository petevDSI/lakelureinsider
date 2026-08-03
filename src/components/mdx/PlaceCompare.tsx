import { getPlaces, getPlacesExcludingSubcategory } from '@/lib/places'
import { buildCompareRows } from '@/lib/compare'
import { PlaceCompareTable } from '@/components/places/PlaceCompareTable'

interface Props {
  category: string
  excludeSubcategory?: string
  targetHours?: number
  targetHoursLabel?: string
}

export async function PlaceCompare({
  category,
  excludeSubcategory,
  targetHours = 4,
  targetHoursLabel = '~4 hours',
}: Props) {
  const places = excludeSubcategory
    ? getPlacesExcludingSubcategory(category, excludeSubcategory)
    : getPlaces(category)

  const comparable = places.filter(
    (p) => (p.rateCards && p.rateCards.length > 0) || p.priceFrom != null,
  )

  if (comparable.length === 0) return null

  const rows = buildCompareRows(comparable, targetHours)
  return <PlaceCompareTable rows={rows} targetHoursLabel={targetHoursLabel} />
}
