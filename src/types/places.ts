export type PlaceTag =
  | 'petFriendly'
  | 'fuelIncluded'
  | 'delivery'
  | 'waterfront'
  | 'rvHookup'
  | 'tentSites'

export interface Rate {
  duration: string
  price: number
}

export interface RateCard {
  label?: string
  rates: Rate[]
  fuelIncluded?: boolean
  unconfirmed?: boolean
  minimumHours?: number
}

export interface PlaceRecord {
  id: string
  name: string
  category: string
  subcategory?: string
  address?: string | null
  phone?: string | null
  website?: string | null
  coordinates?: { lat: number; lng: number } | null
  hours?: string | null
  priceFrom?: number | null
  priceUnit?: string | null
  priceNotes?: string | null
  rateCards?: RateCard[]
  conflictNote?: string | null
  tags?: PlaceTag[]
  insiderNote?: string | null
  source: string
  lastVerified: string
}
