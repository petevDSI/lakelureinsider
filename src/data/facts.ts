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
  'chimney-rock.hickory-nut-falls.ranking': {
    value: 'One of the tallest waterfalls east of the Mississippi River',
    source: 'https://www.chimneyrockpark.com/view_trail/hickory-nut-falls-trail/',
    lastVerified: '2026-08-19',
  },
  // Chimney Rock — trail distances & difficulty (paid access area)
  'chimney-rock.trail.riverwalk.distance': {
    value: '0.1 mile one way',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.riverwalk.difficulty': {
    value: 'Easy',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.great-woodland-adventure.distance': {
    value: '0.4 mile loop',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.great-woodland-adventure.difficulty': {
    value: 'Easy',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.four-seasons.distance': {
    value: '0.7 mile one way',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.four-seasons.difficulty': {
    value: 'Strenuous',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.hickory-nut-falls.distance': {
    value: '0.7 mile one way (1.4 miles round trip)',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.hickory-nut-falls.difficulty': {
    value: 'Moderate',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.hickory-nut-falls.time': {
    value: '45 minutes to 1 hour',
    source: 'https://www.chimneyrockpark.com/view_trail/hickory-nut-falls-trail/',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.outcroppings.distance': {
    value: '0.2 mile one way',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.outcroppings.difficulty': {
    value: 'Strenuous',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.exclamation-point.distance': {
    value: '0.3 mile one way',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.exclamation-point.difficulty': {
    value: 'Strenuous',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.skyline.distance': {
    value: '1.1 miles one way (2.2 miles round trip)',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.skyline.difficulty': {
    value: 'Moderate to strenuous',
    source: 'https://www.chimneyrockpark.com/skyline-trail/',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.skyline.time': {
    value: '2 to 2.5 hours',
    source: 'https://www.chimneyrockpark.com/skyline-trail/',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.rumbling-bald.distance': {
    value: '1.5 mile loop',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.rumbling-bald.difficulty': {
    value: 'Moderate',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.weed-patch-mountain.distance': {
    value: '8.5 miles one way',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.weed-patch-mountain.difficulty': {
    value: 'Strenuous',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.tunnel.distance': {
    value: '0.15 mile one way',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trail.tunnel.difficulty': {
    value: 'Moderate',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  // Eagle Rock Access (Buffalo Creek Park) — separate free-access area, own closure status
  'chimney-rock.trails.eagle-rock-access.status': {
    value: 'Closed until further notice',
    source: 'https://www.ncparks.gov/state-parks/chimney-rock-state-park/trails',
    lastVerified: '2026-08-19',
  },
  'chimney-rock.trails.main-park.closures': {
    value: 'No trail closures reported in the main (paid-access) park',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-19',
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
    value: '$12',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },
  'lake-lure.beach.admission.child': {
    value: '$8 — ages 4–12, must be 45 in or taller',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },
  'lake-lure.beach.hours': {
    value: '10 AM–6 PM',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
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
    value: '~52 minutes',
    source: 'distance-cities.com driving directions (US-74A W)',
    lastVerified: '2026-08-20',
  },
  'drive.charlotte-to-lake-lure.minutes': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
  'drive.lake-lure-to-black-mountain.miles': {
    value: '23 miles',
    source: 'distance-cities.com driving directions (NC-9 N)',
    lastVerified: '2026-08-20',
  },
  'drive.lake-lure-to-black-mountain.minutes': {
    value: '~44 minutes',
    source: 'distance-cities.com driving directions (NC-9 N)',
    lastVerified: '2026-08-20',
  },
  'drive.lake-lure-to-hendersonville.miles': {
    value: '21 miles',
    source: 'distance-cities.com driving directions (US-64 W)',
    lastVerified: '2026-08-20',
  },
  'drive.lake-lure-to-hendersonville.minutes': {
    value: '~40 minutes',
    source: 'distance-cities.com driving directions (US-64 W)',
    lastVerified: '2026-08-20',
  },
  'drive.lake-lure-to-asheville.miles': {
    value: '28 miles',
    source: 'distance-cities.com driving directions (US-74A W)',
    lastVerified: '2026-08-20',
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

  // ─── Current status — Chimney Rock State Park (verified 2026-08-03) ──────────
  'chimney-rock.open.status': {
    value: 'Open daily',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-03',
  },
  'chimney-rock.open.reopened': {
    value: 'Late June 2025 — nine months after Hurricane Helene',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-03',
  },
  'chimney-rock.elevator.operational': {
    value: 'Operational — included with all tickets',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-03',
  },
  // Two official sources give conflicting reservation guidance — store both
  'chimney-rock.reservations.park-says': {
    value: 'Recommended for busy weekends and holidays',
    source: 'https://www.chimneyrockpark.com/',
    lastVerified: '2026-08-03',
  },
  'chimney-rock.reservations.ncparks-says': {
    value: 'Timed-entry reservations are required',
    source: 'https://www.ncparks.gov/',
    lastVerified: '2026-08-03',
  },

  // ─── Current status — Lake Lure (verified 2026-08-03) ────────────────────────
  'lake-lure.open.status': {
    value: 'Officially reopened May 15, 2026',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },
  'lake-lure.open.closure-duration': {
    value: '20-month closure following Hurricane Helene',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },

  // ─── Current status — Washburn Marina (verified 2026-08-03) ──────────────────
  'washburn-marina.open.status': {
    value: 'Reopened July 2026, 22 months after Helene',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },
  'washburn-marina.fuel.status': {
    value: 'Not yet operating — anticipated August 2026, not confirmed',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },
  'lake-lure.tours.departure': {
    value: 'Lake Lure Beach — not Washburn Marina',
    source: 'Locally confirmed 2026-08-03',
    lastVerified: '2026-08-03',
  },

  // ─── Current status — Lake Lure Beach (verified 2026-08-03) ─────────────────
  'lake-lure.beach.schedule.daily-through': {
    value: 'August 11, 2026 — then weekends only through Labor Day',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },
  'lake-lure.beach.season.end': {
    value: 'Labor Day — September 7, 2026',
    source: 'townoflakelure.com July 2026 Town News Summary — confirmed (Town page shows 9/27/26 which is a typo)',
    lastVerified: '2026-08-03',
  },
  'lake-lure.beach.admission.senior': {
    value: '$9',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },
  'lake-lure.beach.aqua-park.age7plus': {
    value: '$10 per 50-minute session',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },
  'lake-lure.beach.aqua-park.age4to6': {
    value: '$5 per 50-minute session',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },

  // ─── Current status — Flowering Bridge (verified 2026-08-03) ─────────────────
  'flowering-bridge.gardens.status': {
    value: 'Open free, 24 hours a day, year-round',
    source: 'https://lakelurefloweringbridge.org/faqs/',
    lastVerified: '2026-08-03',
  },
  'flowering-bridge.gardens.address': {
    value: '3070 Memorial Hwy, Lake Lure, NC — east and west banks of the Rocky Broad River',
    source: 'https://lakelurefloweringbridge.org/faqs/',
    lastVerified: '2026-08-03',
  },
  'flowering-bridge.bridge.status': {
    value: 'Demolished — demolition began August 18, 2025',
    source: 'https://lakelurefloweringbridge.org/faqs/',
    lastVerified: '2026-08-03',
  },
  'flowering-bridge.replacement.status': {
    value: 'Under discussion — not committed, not funded, not scheduled',
    source: 'https://lakelurefloweringbridge.org/faqs/',
    lastVerified: '2026-08-03',
  },

  // ─── Roads (verified 2026-08-03) ─────────────────────────────────────────────
  'road.us64.status': {
    value: 'Open to all traffic since late March 2026',
    source: 'townoflakelure.com July 2026 Town News Summary + drivenc.gov',
    lastVerified: '2026-08-03',
  },

  // ─── Active construction (verified 2026-08-03) ───────────────────────────────
  'construction.lake-blvd.period': {
    value: 'August 3–7, 2026 — partial closures, crews directing traffic',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },
  'construction.boys-camp-bridge.status': {
    value: 'Under construction from week of July 27, 2026 (120-day timeline) — temporary bridge remains passable throughout',
    source: 'townoflakelure.com July 2026 Town News Summary',
    lastVerified: '2026-08-03',
  },
  'construction.village-streetscape.funding': {
    value: '$5.5M NC Commerce grant + DOT Carbon Reduction grant for Chimney Rock Village streetscape',
    source: 'chimneyrockvillagenc.gov news July 12, 2026',
    lastVerified: '2026-08-03',
  },
  'construction.replacement-dam.status': {
    value: 'FEMA-approved detailed design phase — $3.5M total, 35% Town match, construction expected late summer 2026',
    source: 'townoflakelure.com July 2026 Town News Summary',
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

// ─── EV charging — nearest public stations ───────────────────────────────────
// There is no public EV charging at Lake Lure or Chimney Rock itself. This is
// the honest nearby list, sourced from ChargeHub (chargehub.com) station
// records. Distance/drive time is by road from Lake Lure's town center, not
// straight-line — re-verify with live directions if the route matters to you.
// Re-check port availability before relying on any of these; port counts and
// network status can change.

export type ChargerSpeed = 'level2' | 'dcFast' | 'supercharger'

export interface EvCharger {
  id: string
  name: string
  network: string
  city: string
  address: string
  distanceMiles: number
  driveMinutes: number
  route: string
  ports: number
  speed: ChargerSpeed
  connectors: string
  cost: string
  passportEnabled: boolean
  note: string | null
  detailsUrl: string
  source: string
  lastVerified: string
}

export const EV_CHARGERS: EvCharger[] = [
  {
    id: 'black-mountain-police-station',
    name: 'Black Mountain Police Station',
    network: 'ChargeUp',
    city: 'Black Mountain, NC',
    address: '106 Montreat Road, Black Mountain, NC 28711',
    distanceMiles: 23,
    driveMinutes: 44,
    route: 'NC-9 N',
    ports: 2,
    speed: 'level2',
    connectors: 'J1772',
    cost: 'Free',
    passportEnabled: false,
    note: 'Closest option to Lake Lure, but the smallest network here — requires the ChargeUp app and has no live status reporting. Confirm it\'s working before you drive out for it specifically.',
    detailsUrl: 'https://chargehub.com/en/ev-charging-stations?locId=3911&fromMap=true',
    source: 'ChargeHub station data',
    lastVerified: '2026-08-20',
  },
  {
    id: 'hendersonville-dogwood-lot',
    name: 'City of Hendersonville — Dogwood Parking Lot',
    network: 'ChargePoint',
    city: 'Hendersonville, NC',
    address: '430 North Church Street, Hendersonville, NC 28792',
    distanceMiles: 21,
    driveMinutes: 40,
    route: 'US-64 W',
    ports: 2,
    speed: 'level2',
    connectors: 'J1772',
    cost: 'Free',
    passportEnabled: true,
    note: 'Both ports were showing available as of the last check. Downtown lot, walkable to Main Street shops and restaurants while you charge.',
    detailsUrl: 'https://chargehub.com/en/ev-charging-stations?locId=3826&fromMap=true',
    source: 'ChargeHub station data',
    lastVerified: '2026-08-20',
  },
  {
    id: 'asheville-tunnel-rd-supercharger',
    name: 'Asheville — S Tunnel Road Supercharger',
    network: 'Tesla',
    city: 'Asheville, NC',
    address: '4 South Tunnel Road, Asheville, NC 28805',
    distanceMiles: 28,
    driveMinutes: 52,
    route: 'US-74A W',
    ports: 8,
    speed: 'supercharger',
    connectors: 'Tesla NACS (CCS via adapter)',
    cost: 'Pricing varies — set in the Tesla app',
    passportEnabled: false,
    note: 'The fast option for Tesla drivers, and NACS/CCS-adapter-equipped non-Teslas. Near the Asheville Mall area, so there\'s somewhere to be while it charges.',
    detailsUrl: 'https://chargehub.com/en/ev-charging-stations?locId=32677&fromMap=true',
    source: 'ChargeHub station data',
    lastVerified: '2026-08-20',
  },
  {
    id: 'asheville-ford',
    name: 'Asheville Ford',
    network: 'ChargePoint',
    city: 'Asheville, NC',
    address: '611 Brevard Road, Asheville, NC 28806',
    distanceMiles: 28,
    driveMinutes: 52,
    route: 'US-74A W',
    ports: 6,
    speed: 'dcFast',
    connectors: '2× J1772 (Level 2) + 4× CCS (DC fast)',
    cost: '$0.35/kWh, plus $5/hr parking after 4 hours',
    passportEnabled: true,
    note: 'All 6 ports showing available as of the last check — the most capable non-Tesla fast-charging stop on this list. Public dealership lot, no purchase required.',
    detailsUrl: 'https://chargehub.com/en/ev-charging-stations?locId=21856&fromMap=true',
    source: 'ChargeHub station data',
    lastVerified: '2026-08-20',
  },
  {
    id: 'asheville-chamber-of-commerce',
    name: 'Asheville Chamber of Commerce & Visitors Center',
    network: 'ChargeUp',
    city: 'Asheville, NC',
    address: '36 Montford Avenue, Asheville, NC 28801',
    distanceMiles: 28,
    driveMinutes: 52,
    route: 'US-74A W',
    ports: 2,
    speed: 'level2',
    connectors: 'J1772',
    cost: 'Unknown — requires ChargeUp app login',
    passportEnabled: false,
    note: 'Limited access hours (roughly 5 AM–10 PM), and pricing isn\'t published. Worth knowing about if you\'re combining Lake Lure with a downtown Asheville day, less so as a dedicated trip.',
    detailsUrl: 'https://chargehub.com/en/ev-charging-stations?locId=2751&fromMap=true',
    source: 'ChargeHub station data',
    lastVerified: '2026-08-20',
  },
]

export function evChargersLastVerified(): string | null {
  const dates = EV_CHARGERS.map((c) => c.lastVerified).filter(
    (d): d is string => Boolean(d),
  )
  return dates.length ? dates.sort().at(-1)! : null
}
