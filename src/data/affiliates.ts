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

  // Activities — Chimney Rock
  'getyourguide-chimney-rock': {
    id: 'getyourguide-chimney-rock',
    network: 'GetYourGuide',
    url: '#', // TODO: replace with GetYourGuide affiliate URL for Chimney Rock
    label: 'Book Chimney Rock Tickets & Tours on GetYourGuide',
  },
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
  // Activities — Lake Lure boat rentals
  boatsetter: {
    id: 'boatsetter',
    network: 'Boatsetter',
    // Plain URL until the affiliate application is approved. Honest and
    // working now; swap for the affiliate link and nothing else changes.
    url: 'https://www.boatsetter.com/boat-rentals/lake-lure--nc--united-states',
    label: 'Compare Boat Listings on Lake Lure',
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
