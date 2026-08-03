export interface AffiliateEntry {
  id: string
  network: string
  url: string
  label: string
}

export const affiliates: Record<string, AffiliateEntry> = {
  // Lodging
  'booking-lake-lure': {
    id: 'booking-lake-lure',
    network: 'Booking.com',
    url: '#', // TODO: replace with affiliate URL
    label: 'Find Hotels at Lake Lure',
  },
  'vrbo-lake-lure': {
    id: 'vrbo-lake-lure',
    network: 'VRBO',
    url: '#', // TODO: replace with affiliate URL
    label: 'Browse Vacation Rentals at Lake Lure',
  },
  'airbnb-chimney-rock': {
    id: 'airbnb-chimney-rock',
    network: 'Airbnb',
    url: '#', // TODO: replace with affiliate URL
    label: 'Find Cabins near Chimney Rock',
  },

  // Activities
  'chimney-rock-tickets': {
    id: 'chimney-rock-tickets',
    network: 'Chimney Rock State Park',
    url: '#', // TODO: replace with affiliate URL
    label: 'Buy Chimney Rock Tickets Online',
  },
  'lake-lure-boat-rental': {
    id: 'lake-lure-boat-rental',
    network: 'Lake Lure Adventure Company',
    url: '#', // TODO: replace with affiliate URL
    label: 'Reserve a Boat Rental',
  },
  'viator-chimney-rock': {
    id: 'viator-chimney-rock',
    network: 'Viator',
    url: '#', // TODO: replace with affiliate URL
    label: 'Browse Chimney Rock Tours',
  },
}

export function getAffiliate(id: string): AffiliateEntry | undefined {
  return affiliates[id]
}
