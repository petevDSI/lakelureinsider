// ─────────────────────────────────────────────────────────────────────────────
// facts.ts — single source of truth for every factual claim that can go stale.
// Do NOT write prices, hours, distances, or phone numbers in MDX prose.
// Reference them via <Fact id="..." /> or factValue().
// ─────────────────────────────────────────────────────────────────────────────

const SRC_CR = 'https://www.chimneyrockpark.com/'
const CR_VERIFIED = '2026-08-02'

// ─── Chimney Rock — numeric price constants (used by PassCalculator) ────────

export const CR_PRICES = {
  adultDay: 17,
  youthDay: 8,           // ages 5–15; ages 4 and under always free
  adultAnnual: 32,
  youthAnnual: 14,
  familyAnnual: 80,      // covers 2 adults + up to 3 youth
  adultUpgrade: 15,      // from day ticket; same day OR within 30 days with receipt
  youthUpgrade: 6,       // from day ticket; same day OR within 30 days with receipt
  familyUpgrade: null as null, // no family upgrade rate published — status: unconfirmed
} as const

// ─── Chimney Rock — seasonal hours ──────────────────────────────────────────

export type SeasonStatus = 'confirmed' | 'unconfirmed' | 'closed'

export interface TrailClosing {
  name: string
  closes: string
}

export interface SeasonHoursDetail {
  entryOpen: string
  entryClose?: string  // undefined = source does not list a separate entry cutoff
  parkClose: string
  trailClosings?: TrailClosing[]
}

export interface ChimneyRockSeason {
  key: string
  name: string
  dateRange: string
  status: SeasonStatus
  hours?: SeasonHoursDetail
  notes?: string
  source: string
  lastVerified: string
}

export const CR_SEASONS = {
  main: {
    key: 'main',
    name: 'Main Season',
    dateRange: 'March 8 – November 1',
    status: 'confirmed' as const,
    hours: {
      entryOpen: '8:30 AM',
      entryClose: '5:30 PM',
      parkClose: '7:00 PM',
      trailClosings: [
        { name: 'Skyline Trail', closes: '5:00 PM' },
        { name: 'Hickory Nut Falls Trail', closes: '6:00 PM' },
      ],
    },
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  fallWinter: {
    key: 'fallWinter',
    name: 'Fall/Winter Season',
    dateRange: 'November 2 – December 31',
    status: 'confirmed' as const,
    hours: {
      entryOpen: '8:30 AM',
      entryClose: '4:30 PM',
      parkClose: '6:00 PM',
    },
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  earlyYear: {
    key: 'earlyYear',
    name: 'Early Year',
    dateRange: 'January 1 – March 7',
    status: 'unconfirmed' as const,
    notes:
      'Hours for this period are not published at chimneyrockpark.com. Do not infer the park is closed — call ahead or check the website before visiting.',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  thanksgiving: {
    key: 'thanksgiving',
    name: 'Thanksgiving Day',
    dateRange: 'Thanksgiving Day (4th Thursday in November)',
    status: 'confirmed' as const,
    hours: {
      entryOpen: '8:30 AM',
      // source says "8:30am-3pm" — does not specify separate entry cutoff vs park close
      parkClose: '3:00 PM',
    },
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  christmasEve: {
    key: 'christmasEve',
    name: 'Christmas Eve',
    dateRange: 'December 24',
    status: 'confirmed' as const,
    hours: {
      entryOpen: '8:30 AM',
      // source says "8:30am-3pm" — does not specify separate entry cutoff vs park close
      parkClose: '3:00 PM',
    },
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  christmasDay: {
    key: 'christmasDay',
    name: 'Christmas Day',
    dateRange: 'December 25',
    status: 'closed' as const,
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
} as const satisfies Record<string, ChimneyRockSeason>

// ─── Season detection (evaluates at build time for SSG pages) ───────────────

function nthWeekdayOfMonth(
  year: number,
  month: number,
  dayOfWeek: number,
  n: number,
): Date {
  const first = new Date(year, month, 1)
  const diff = (dayOfWeek - first.getDay() + 7) % 7
  return new Date(year, month, 1 + diff + (n - 1) * 7)
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function getCurrentChimneyRockSeason(
  now: Date = new Date(),
): ChimneyRockSeason {
  const m = now.getMonth() + 1
  const d = now.getDate()

  if (m === 12 && d === 25) return CR_SEASONS.christmasDay
  if (m === 12 && d === 24) return CR_SEASONS.christmasEve

  const thanksgiving = nthWeekdayOfMonth(now.getFullYear(), 10, 4, 4) // Nov = 10 (0-indexed), Thu = 4
  if (sameDay(now, thanksgiving)) return CR_SEASONS.thanksgiving

  if (m < 3 || (m === 3 && d < 8)) return CR_SEASONS.earlyYear
  if (m < 11 || (m === 11 && d === 1)) return CR_SEASONS.main
  return CR_SEASONS.fallWinter
}

// ─── General facts lookup (used by <Fact> component and factValue()) ─────────

export interface Fact {
  value: string | null
  source: string | null
  lastVerified: string | null
}

export const facts: Record<string, Fact> = {
  // Chimney Rock — admission (string format for prose rendering)
  'chimney-rock.admission.adult-day': {
    value: '$17',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.admission.youth-day': {
    value: '$8',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.admission.adult-annual': {
    value: '$32',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.admission.youth-annual': {
    value: '$14',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.admission.family-annual': {
    value: '$80',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.admission.adult-upgrade': {
    value: '$15',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.admission.youth-upgrade': {
    value: '$6',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  // Chimney Rock — hours (prose-friendly strings)
  'chimney-rock.hours.main.entry-close': {
    value: '5:30 PM',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.hours.main.park-close': {
    value: '7:00 PM',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.hours.fallwinter.entry-close': {
    value: '4:30 PM',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.hours.fallwinter.park-close': {
    value: '6:00 PM',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.hours.gate-open': {
    value: '8:30 AM',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.trail.skyline.close': {
    value: '5:00 PM',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  'chimney-rock.trail.hickory-nut-falls.close': {
    value: '6:00 PM',
    source: SRC_CR,
    lastVerified: CR_VERIFIED,
  },
  // Chimney Rock — dogs policy
  'chimney-rock.dogs.trails': {
    value: 'Permitted on all trails on a leash no longer than 6 feet',
    source: 'https://www.chimneyrockpark.com/ + https://www.ncparks.gov/',
    lastVerified: '2026-08-02',
  },
  'chimney-rock.dogs.elevator': {
    value: 'Not permitted in the elevator or Sky Lounge (service animals excepted)',
    source: 'https://www.chimneyrockpark.com/ + https://www.ncparks.gov/',
    lastVerified: '2026-08-02',
  },
  // Chimney Rock — elevator & accessibility
  'chimney-rock.elevator.status': {
    value: null, // TODO: VERIFY current operational status — may be closed for maintenance
    source: null,
    lastVerified: null,
  },
  'chimney-rock.elevator.stories': {
    value: null, // TODO: VERIFY exact figure — commonly cited as 26 stories
    source: null,
    lastVerified: null,
  },
  'chimney-rock.elevator.feet': {
    value: null, // TODO: VERIFY exact figure — commonly cited as 258 feet
    source: null,
    lastVerified: null,
  },
  'chimney-rock.stairs.count': {
    value: null, // TODO: VERIFY exact step count — commonly cited as 499 but needs verification
    source: null,
    lastVerified: null,
  },
  // Chimney Rock — misc
  'chimney-rock.phone': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
  'chimney-rock.elevation.feet': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
  'chimney-rock.hickory-nut-falls.height.feet': {
    value: '404',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-02',
  },
  // Absence claim: no resale platform (GetYourGuide, Viator, etc.) carries
  // Chimney Rock tickets. Value is the human-readable month/year to show in
  // prose. Update value + lastVerified together whenever re-verified.
  'chimney-rock.resale.none-found': {
    value: 'August 2026',
    source: 'GetYourGuide search "Chimney Rock North Carolina" (197 results, 0 relevant); Viator search same query — 2026-08-03',
    lastVerified: '2026-08-03',
  },

  // Lake Lure
  'lake-lure.area.acres': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
  'lake-lure.beach.admission.adult': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
  'lake-lure.beach.admission.child': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
  'lake-lure.beach.hours': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
  'lake-lure.boat-rental.hourly': {
    value: '$125–$140 for a 20–22 ft pontoon',
    source: 'https://lakelureadventurecompany.com/adventures',
    lastVerified: '2026-08-03',
  },

  // Drive times
  'drive.lake-lure-to-chimney-rock.minutes': {
    value: '~7 minutes',
    source: 'Google Maps directions + townoflakelure.com July 2026',
    lastVerified: '2026-08-02',
  },
  'drive.lake-lure-to-chimney-rock.miles': {
    value: '3.2 miles',
    source: 'Google Maps directions + townoflakelure.com July 2026',
    lastVerified: '2026-08-02',
  },
  'drive.lake-lure-to-chimney-rock.route': {
    value: 'US-64 W / US-74A W',
    source: 'Google Maps directions',
    lastVerified: '2026-08-02',
  },
  'chimney-rock.road.reconstruction-2029': {
    value: 'US 64/74A permanent reconstruction between Bat Cave and Chimney Rock continues through 2029 — expect intermittent construction delays',
    source: 'WCNC / Tryon Daily Bulletin',
    lastVerified: '2026-07-31',
  },
  'drive.asheville-to-lake-lure.minutes': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
  'drive.charlotte-to-lake-lure.minutes': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },

  // Chimney Rock — weddings
  'chimney-rock.wedding.fee.range': {
    value: '$175–$600',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-02',
  },
  'chimney-rock.wedding.admission.standard-adult': {
    value: '$17',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-02',
  },
  'chimney-rock.wedding.admission.standard-youth': {
    value: '$8',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-02',
  },
  'chimney-rock.wedding.admission.group-adult': {
    value: '$14',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-02',
  },
  'chimney-rock.wedding.admission.group-youth': {
    value: '$6',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-02',
  },
  'chimney-rock.wedding.venue.chimney-rock.stairs-from-elevator': {
    value: '44',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-02',
  },
  'chimney-rock.wedding.venue.vista-rock.stairs': {
    value: '~150',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-02',
  },
  'chimney-rock.wedding.pavilion.holiday-restriction': {
    value: null, // TODO: VERIFY — other venues say "no holidays or holiday weekends"; Pavilion listing does not mention this restriction
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-02',
  },

  // Lake Lure Inn & Spa — weddings
  'lake-lure-inn.spa.status': {
    value: 'Temporarily closed',
    source: 'https://stayridgeline.com/',
    lastVerified: '2026-08-02',
  },
  'lake-lure-inn.contact.phone': {
    value: '828-625-2525',
    source: 'https://stayridgeline.com/',
    lastVerified: '2026-08-02',
  },
  'lake-lure-inn.contact.email': {
    value: 'lakelure@stayridgeline.com',
    source: 'https://stayridgeline.com/',
    lastVerified: '2026-08-02',
  },
  'lake-lure-inn.bonfire.price': {
    value: '$600 + tax',
    source: 'https://stayridgeline.com/',
    lastVerified: '2026-08-02',
  },

  // Lake Lure — boat rentals (prose-facing strings)
  'boat-rental.pontoon.hourly-range': {
    value: '$125–$140',
    source: 'https://lakelureadventurecompany.com/adventures',
    lastVerified: '2026-08-03',
  },
  'boat-rental.pontoon.half-day-range': {
    value: '$460–$500',
    source: 'https://lakelureadventurecompany.com/adventures',
    lastVerified: '2026-08-03',
  },
  'boat-rental.pontoon.full-day-range': {
    value: '$880–$920',
    source: 'https://lakelureadventurecompany.com/adventures',
    lastVerified: '2026-08-03',
  },
  'boat-rental.cheapest-full-day': {
    value: '$260',
    source: 'https://discoverlakelife.com/rentals/',
    lastVerified: '2026-08-03',
  },
  'boat-rental.peer-to-peer.starting': {
    value: '$31/hr',
    source:
      'https://www.boatsetter.com/boat-rentals/lake-lure--nc--united-states',
    lastVerified: '2026-08-03',
  },
  'boat-rental.half-day-breakeven': {
    value: '3.7 hours',
    source: 'https://lakelureadventurecompany.com/adventures',
    lastVerified: '2026-08-03',
  },
  'boat-rental.full-day-breakeven': {
    value: '7 hours',
    source: 'https://lakelureadventurecompany.com/adventures',
    lastVerified: '2026-08-03',
  },
}

// ─── Chimney Rock — wedding data ─────────────────────────────────────────────

const SRC_CR_WEDDING = 'https://www.chimneyrockpark.com/'
const CR_WEDDING_VERIFIED = '2026-08-02'

export interface WeddingVenue {
  key: string
  name: string
  maxGuests: number
  access: string
  accessDifficulty: 'easy' | 'moderate' | 'strenuous'
  restrictions: string
  notes?: string
  accessible: boolean
  source: string
  lastVerified: string
}

export const CR_WEDDING_VENUES: Record<string, WeddingVenue> = {
  chimneyRock: {
    key: 'chimneyRock',
    name: 'Chimney Rock',
    maxGuests: 15,
    access: 'Elevator, then 44 stairs to summit',
    accessDifficulty: 'moderate',
    restrictions: 'Seasonal; no holidays or holiday weekends',
    accessible: false,
    source: SRC_CR_WEDDING,
    lastVerified: CR_WEDDING_VERIFIED,
  },
  hickoryNutFalls: {
    key: 'hickoryNutFalls',
    name: 'Hickory Nut Falls',
    maxGuests: 15,
    access: '1.5-mile round-trip moderate hike required for all guests',
    accessDifficulty: 'moderate',
    restrictions: 'Seasonal; no holidays or holiday weekends',
    notes: '404-foot waterfall backdrop',
    accessible: false,
    source: SRC_CR_WEDDING,
    lastVerified: CR_WEDDING_VERIFIED,
  },
  lakeLureLookout: {
    key: 'lakeLureLookout',
    name: 'Lake Lure Lookout',
    maxGuests: 10,
    access: 'Elevator to Sky Lounge, across patio, down a few steps',
    accessDifficulty: 'easy',
    restrictions: 'Seasonal; no holidays or holiday weekends',
    accessible: false,
    source: SRC_CR_WEDDING,
    lastVerified: CR_WEDDING_VERIFIED,
  },
  outdoorClassroom: {
    key: 'outdoorClassroom',
    name: 'Outdoor Classroom',
    maxGuests: 70,
    access: 'Secluded forest alcove; benches provided; rental includes Pavilion',
    accessDifficulty: 'easy',
    restrictions: 'Seasonal; no holidays or holiday weekends',
    accessible: false,
    source: SRC_CR_WEDDING,
    lastVerified: CR_WEDDING_VERIFIED,
  },
  pavilion: {
    key: 'pavilion',
    name: 'The Pavilion',
    maxGuests: 150,
    access: 'Vehicle and handicap access — the only fully accessible venue',
    accessDifficulty: 'easy',
    restrictions: 'Seasonal; holiday restriction status unconfirmed (see facts)',
    notes: 'Covered. Rental includes Outdoor Classroom.',
    accessible: true,
    source: SRC_CR_WEDDING,
    lastVerified: CR_WEDDING_VERIFIED,
  },
  vistaRock: {
    key: 'vistaRock',
    name: 'Vista Rock',
    maxGuests: 15,
    access: '~150 stairs up the Outcroppings Trail',
    accessDifficulty: 'strenuous',
    restrictions: 'Seasonal; no holidays or holiday weekends',
    notes: 'More privacy than the Chimney',
    accessible: false,
    source: SRC_CR_WEDDING,
    lastVerified: CR_WEDDING_VERIFIED,
  },
}

export interface WeddingFeeTier {
  maxGuests: number
  fee: number
}

export const CR_WEDDING_FEES: WeddingFeeTier[] = [
  { maxGuests: 5, fee: 175 },
  { maxGuests: 15, fee: 200 },
  { maxGuests: 20, fee: 250 },
  { maxGuests: 25, fee: 275 },
  { maxGuests: 30, fee: 300 },
  { maxGuests: 40, fee: 350 },
  { maxGuests: 50, fee: 400 },
  { maxGuests: 60, fee: 450 },
  { maxGuests: 70, fee: 500 },
  { maxGuests: 100, fee: 550 },
  { maxGuests: 150, fee: 600 },
]

export const CR_WEDDING_ADMISSION = {
  standardAdult: 17,     // <10 guests total
  standardYouth: 8,      // <10 guests total, ages 5–15
  groupAdult: 14,        // 10+ guests total
  groupYouth: 6,         // 10+ guests total, ages 5–15
  groupThreshold: 10,    // total guests at which group rate applies
} as const

export interface WeddingRentalOption {
  key: string
  label: string
  venues: string
  duration: string | null
  price: number
}

export const CR_WEDDING_RENTALS: WeddingRentalOption[] = [
  { key: 'none', label: 'Ceremony only', venues: 'Ceremony site only', duration: null, price: 0 },
  { key: 'oc-2hr', label: 'Outdoor Classroom', venues: 'Outdoor Classroom', duration: '2 hours', price: 150 },
  { key: 'oc-pavilion-half', label: 'OC + Pavilion half day', venues: 'Outdoor Classroom + Pavilion', duration: '4 hours', price: 300 },
  { key: 'oc-pavilion-full', label: 'OC + Pavilion full day', venues: 'Outdoor Classroom + Pavilion', duration: '8 hours', price: 550 },
]

export function getWeddingFee(totalGuests: number): number {
  for (const tier of CR_WEDDING_FEES) {
    if (totalGuests <= tier.maxGuests) return tier.fee
  }
  return CR_WEDDING_FEES[CR_WEDDING_FEES.length - 1].fee
}

export function getWeddingAdmission(adults: number, youth: number): number {
  const total = adults + youth
  if (total >= CR_WEDDING_ADMISSION.groupThreshold) {
    return adults * CR_WEDDING_ADMISSION.groupAdult + youth * CR_WEDDING_ADMISSION.groupYouth
  }
  return adults * CR_WEDDING_ADMISSION.standardAdult + youth * CR_WEDDING_ADMISSION.standardYouth
}

// ─── Lake Lure Inn & Spa — wedding data ──────────────────────────────────────

export interface InnWeddingVenue {
  name: string
  maxGuests: number | null
  notes: string
}

export const LAKE_LURE_INN_WEDDING = {
  venues: [
    {
      name: 'Roosevelt Hall',
      maxGuests: 75,
      notes: 'Used for filming Dirty Dancing (1987). Eight chandeliers, 11-ft ceilings, grand fireplace.',
    },
    {
      name: 'Dining Room + Veranda Terrace + Poolside',
      maxGuests: 215,
      notes: 'Most popular combination.',
    },
    { name: 'Powers Room', maxGuests: 20, notes: 'Private dining, French doors.' },
    { name: 'Grand Lobby', maxGuests: null, notes: '' },
    { name: 'Lakeside Gazebo', maxGuests: null, notes: 'Includes surrounding meadows.' },
    { name: 'The Lawn', maxGuests: null, notes: 'Tents available.' },
  ] as InnWeddingVenue[],
  transport: {
    trolley: '32-passenger historic trolley for guest transport',
    carriage: 'Horse and carriage for newlyweds',
  },
  bonfire: {
    description: "Beach bonfire welcome party — 2-hour private rental, tiki torches, s'mores, music",
  },
  source: 'https://stayridgeline.com/',
  lastVerified: '2026-08-02',
} as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function factValue(key: string): string {
  return facts[key]?.value ?? '{{TODO}}'
}

export function verifiedLine(key: string): string {
  const f = facts[key]
  if (!f?.lastVerified) return ''
  return `Verified ${f.lastVerified}`
}

// ─── Lake Lure — boat rental operators ───────────────────────────────────────
// Fill these in by calling or visiting each operator. Never invent a rate:
// leave null and it renders as an em dash. Set lastVerified per operator on
// the day you confirm it. Re-verify every March before season.

export type BoatType =
  | 'pontoon'
  | 'kayak'
  | 'paddleboard'
  | 'jetski'
  | 'fishing'
  | 'slip'

export interface RentalRate {
  hourly: number | null
  halfDay: number | null // typically 4 hours
  fullDay: number | null // typically 8 hours
}

export interface BoatRentalOperator {
  id: string
  name: string
  types: BoatType[]
  capacity: string | null
  rates: RentalRate
  fuelIncluded: boolean | null
  deposit: string | null
  cancellation: string | null
  delivery: boolean | null
  captainOption: boolean | null
  phone: string | null
  website: string | null
  note: string | null
  source: string | null
  lastVerified: string | null
}

export const BOAT_RENTALS: BoatRentalOperator[] = [
  {
    id: 'lake-lure-adventure-company',
    name: 'Lake Lure Adventure Company',
    types: ['pontoon', 'kayak', 'paddleboard'],
    capacity: '6–10 passengers',
    rates: { hourly: 125, halfDay: 460, fullDay: 880 },
    fuelIncluded: null, // TODO: VERIFY — is fuel billed separately?
    deposit: null, // TODO: VERIFY
    cancellation: null, // TODO: VERIFY
    delivery: null, // TODO: VERIFY
    captainOption: null, // TODO: VERIFY
    phone: null, // TODO: VERIFY
    website: 'https://lakelureadventurecompany.com/',
    note: '20 ft boat, 6–8 passengers. A 22 ft boat for up to 10 runs $140/hr, $500 half day, $920 full day.',
    source: 'https://lakelureadventurecompany.com/adventures',
    lastVerified: '2026-08-03',
  },
  {
    id: 'lake-lure-tours',
    name: 'Lake Lure Tours',
    types: ['pontoon'],
    capacity: 'Up to 13 passengers',
    rates: { hourly: null, halfDay: null, fullDay: null }, // TODO: VERIFY all
    fuelIncluded: null,
    deposit: null,
    cancellation: null,
    delivery: null,
    captainOption: null,
    phone: null,
    website: 'https://www.lakeluretours.com/boat-rentals',
    note: 'Marina-based. Also operates the narrated Dirty Dancing boat tour.',
    source: 'https://www.lakeluretours.com/boat-rentals',
    lastVerified: '2026-08-03',
  },
  {
    id: 'lake-lure-boat-rental',
    name: 'Lake Lure Boat Rental',
    types: ['pontoon'],
    capacity: null, // TODO: VERIFY
    rates: { hourly: null, halfDay: null, fullDay: null }, // TODO: VERIFY all
    fuelIncluded: null,
    deposit: null,
    cancellation: null,
    delivery: true, // advertises multiple pickup/dropoff points — confirm scope
    captainOption: null,
    phone: null,
    website: 'https://lakelureboatrental.com/',
    note: 'Family owned. Multiple pickup and dropoff locations around the lake.',
    source: 'https://lakelureboatrental.com/',
    lastVerified: '2026-08-03',
  },
  {
    id: 'discover-lake-life',
    name: 'Lake Life',
    types: ['pontoon'],
    capacity: 'Up to 13 passengers',
    rates: { hourly: null, halfDay: null, fullDay: 260 },
    fuelIncluded: null,
    deposit: null,
    cancellation: null,
    delivery: null,
    captainOption: null,
    phone: null,
    website: 'https://discoverlakelife.com/rentals/',
    note: 'Advertises a 13-passenger pontoon from $260/day — confirm what that rate includes.',
    source: 'https://discoverlakelife.com/rentals/',
    lastVerified: '2026-08-03',
  },
  {
    id: 'carolina-properties',
    name: 'Carolina Properties',
    types: ['pontoon'],
    capacity: null, // TODO: VERIFY
    rates: { hourly: null, halfDay: null, fullDay: null }, // TODO: VERIFY all
    fuelIncluded: null,
    deposit: null,
    cancellation: null,
    delivery: true,
    captainOption: null,
    phone: null,
    website: 'https://www.carolinapropertiesnc.com/boat-rentals-573956778',
    note: 'Delivers boats to lakefront rental properties — useful if you are already staying on the water.',
    source: 'https://www.carolinapropertiesnc.com/boat-rentals-573956778',
    lastVerified: '2026-08-03',
  },
]

// Peer-to-peer marketplaces. Listed apart — these are not local operators.
export interface BoatMarketplace {
  id: string
  name: string
  startingRate: number | null
  note: string
  source: string
  lastVerified: string
}

export const BOAT_MARKETPLACES: BoatMarketplace[] = [
  {
    id: 'boatsetter',
    name: 'Boatsetter',
    startingRate: 31,
    note: 'Peer-to-peer. Individual owners set their own rates, terms, and pickup points.',
    source:
      'https://www.boatsetter.com/boat-rentals/lake-lure--nc--united-states',
    lastVerified: '2026-08-03',
  },
  {
    id: 'docklyne',
    name: 'Docklyne',
    startingRate: 175,
    note: 'Aggregates listings from local marinas.',
    source: 'https://docklyne.com/boat-rentals/lake-lure--nc--united-states',
    lastVerified: '2026-08-03',
  },
]

// Newest lastVerified across all operators — drives the page freshness line.
export function boatRentalsLastVerified(): string | null {
  const dates = BOAT_RENTALS.map((o) => o.lastVerified).filter(
    (d): d is string => Boolean(d),
  )
  return dates.length ? dates.sort().at(-1)! : null
}
