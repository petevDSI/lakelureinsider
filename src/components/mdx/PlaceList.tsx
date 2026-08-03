import { getPlaces, getPlacesExcludingSubcategory } from '@/lib/places'
import { PlaceListFilter } from '@/components/places/PlaceListFilter'

interface Props {
  category: string
  excludeSubcategory?: string
}

export async function PlaceList({ category, excludeSubcategory }: Props) {
  const places = excludeSubcategory
    ? getPlacesExcludingSubcategory(category, excludeSubcategory)
    : getPlaces(category)

  if (places.length === 0) return null

  return <PlaceListFilter places={places} />
}
