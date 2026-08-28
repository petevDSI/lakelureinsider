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

  // ─── Healthcare & emergency services (verified 2026-08-23) ──────────────────
  'healthcare.nearest-hospital.phone': {
    value: '828-286-5000',
    source: 'https://www.myrutherfordregional.com/emergency-room',
    lastVerified: '2026-08-23',
  },
  'healthcare.in-town-clinic.phone': {
    value: '828-625-4400',
    source: 'https://www.townoflakelure.com/fireems/page/blue-ridge-health-expands-healthcare-patients',
    lastVerified: '2026-08-23',
  },
  'healthcare.in-town-clinic.hours': {
    value: 'Mon–Fri, 8am–5pm',
    source: 'https://www.townoflakelure.com/fireems/page/blue-ridge-health-expands-healthcare-patients',
    lastVerified: '2026-08-23',
  },
  'healthcare.in-town-pharmacy.phone': {
    value: '828-625-0748',
    source: 'Ingles Markets store locator',
    lastVerified: '2026-08-23',
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

// ─── Healthcare & emergency services — providers near Lake Lure ──────────────
// No hospital, ER, or urgent care exists inside Lake Lure or Chimney Rock
// village. Blue Ridge Health (Lake Lure) is the only medical facility inside
// town limits found during research. Everything else requires a drive to
// Rutherfordton or Forest City. Re-verify phone numbers and hours periodically
// — these are the fields most likely to go stale between visits.

export type HealthcareCategory = 'hospital' | 'urgent-care' | 'primary-care' | 'dentist' | 'pharmacy'

export interface HealthcareProvider {
  id: string
  category: HealthcareCategory
  name: string
  address: string
  phone: string | null
  hours: string
  travelNote: string
  notes: string | null
  detailsUrl: string
  source: string
  lastVerified: string
}

export const HEALTHCARE_PROVIDERS: HealthcareProvider[] = [
  {
    id: 'rutherford-regional-er',
    category: 'hospital',
    name: 'Rutherford Regional Health System — Emergency Room',
    address: '288 S. Ridgecrest Ave, Rutherfordton, NC 28139',
    phone: '828-286-5000',
    hours: 'Emergency Room open 24/7',
    travelNote: 'About 20–25 minutes from downtown Lake Lure via US-64/74A — confirm with a live map for current conditions.',
    notes: 'The closest hospital and the closest true emergency room. Certified Chest Pain Center and Primary Stroke Center. Call 911 for a true emergency rather than driving yourself.',
    detailsUrl: 'https://www.myrutherfordregional.com/emergency-room',
    source: 'myrutherfordregional.com',
    lastVerified: '2026-08-23',
  },
  {
    id: 'mainstreet-family-care-forest-city',
    category: 'urgent-care',
    name: 'MainStreet Family Care — Forest City',
    address: '187 Lowes Blvd, Forest City, NC 28043',
    phone: '828-395-1232',
    hours: 'Mon–Fri 8am–8pm, Sat–Sun 9am–4pm',
    travelNote: 'About 30 minutes from Lake Lure.',
    notes: 'Walk-in, no appointment needed. Open seven days a week.',
    detailsUrl: 'https://www.mainstreetfamilycare.com/locations/forest-city/',
    source: 'mainstreetfamilycare.com',
    lastVerified: '2026-08-23',
  },
  {
    id: 'atrium-health-urgent-care-rutherford',
    category: 'urgent-care',
    name: 'Atrium Health Urgent Care — Rutherford',
    address: '181 Daniel Rd, Forest City, NC 28043',
    phone: null,
    hours: 'Hours vary — call ahead to confirm same-day availability',
    travelNote: 'About 30 minutes from Lake Lure.',
    notes: 'Listed hours were inconsistent across directory sites at last check — treat as a backup and confirm before driving out.',
    detailsUrl: 'https://www.solvhealth.com/atrium-health-urgent-care-forest-city-nc-gL3VDp',
    source: 'Solv Health listing',
    lastVerified: '2026-08-23',
  },
  {
    id: 'blue-ridge-health-lake-lure',
    category: 'primary-care',
    name: 'Blue Ridge Health — Lake Lure',
    address: '146 Nesbitt Ridge, off Hwy 9, near Ingles, Lake Lure, NC 28746',
    phone: '828-625-4400',
    hours: 'Mon–Fri, 8am–5pm',
    travelNote: 'Inside Lake Lure town limits — the only medical clinic actually in town.',
    notes: 'Nonprofit primary care and behavioral health. Walk-ins welcome, appointments preferred. Accepts private insurance, Medicare, and Medicaid, with a sliding scale for uninsured patients — worth knowing for an extended stay without local coverage.',
    detailsUrl: 'https://www.townoflakelure.com/fireems/page/blue-ridge-health-expands-healthcare-patients',
    source: 'Town of Lake Lure',
    lastVerified: '2026-08-23',
  },
  {
    id: 'blanton-miller-moore-rhea-dds',
    category: 'dentist',
    name: 'Blanton, Miller, Moore & Rhea DDS',
    address: '363 N. Main St, Rutherfordton, NC 28139',
    phone: '828-287-4187',
    hours: 'Call for hours',
    travelNote: 'About 20–25 minutes from Lake Lure.',
    notes: 'General dentistry. Accepting new patients as of last check.',
    detailsUrl: 'https://www.bmmdental.com/',
    source: 'bmmdental.com',
    lastVerified: '2026-08-23',
  },
  {
    id: 'foothills-periodontics-rutherfordton',
    category: 'dentist',
    name: 'Foothills Periodontics and Implant Dentistry',
    address: '135 McBrayer Dr, Rutherfordton, NC 28139',
    phone: '704-484-0148',
    hours: 'Call for hours',
    travelNote: 'About 20–25 minutes from Lake Lure.',
    notes: 'Specialist practice (periodontics and implants) — not a general or walk-in dentist.',
    detailsUrl: 'https://foothillsperio.com/',
    source: 'foothillsperio.com',
    lastVerified: '2026-08-23',
  },
  {
    id: 'ingles-pharmacy-lake-lure',
    category: 'pharmacy',
    name: 'Ingles Pharmacy #127',
    address: '276 NC-9, Lake Lure, NC 28746',
    phone: '828-625-0748',
    hours: 'Mon–Fri 9am–9pm, Sat–Sun 9am–6pm',
    travelNote: 'Inside Lake Lure — the most convenient option for visitors.',
    notes: 'Located inside the Ingles grocery store on Hwy 9.',
    detailsUrl: 'https://www.ingles-markets.com/storelocate/storeinfo.php?storenum=127',
    source: 'Ingles Markets',
    lastVerified: '2026-08-23',
  },
  {
    id: 'cvs-rutherfordton',
    category: 'pharmacy',
    name: 'CVS Pharmacy',
    address: '111 S. Main St, Rutherfordton, NC 28139',
    phone: '828-287-4227',
    hours: 'Mon–Fri 8am–9pm (closed 1:30–2pm), Sat 9am–6pm, Sun 10am–6pm',
    travelNote: 'About 20–25 minutes from Lake Lure.',
    notes: null,
    detailsUrl: 'https://www.cvs.com/store-locator/rutherfordton-nc-pharmacies/111-s-main-st-rutherfordton-nc-28139/storeid=3559',
    source: 'cvs.com',
    lastVerified: '2026-08-23',
  },
  {
    id: 'walgreens-rutherfordton',
    category: 'pharmacy',
    name: 'Walgreens Pharmacy',
    address: '121 Railroad Ave, Rutherfordton, NC 28139',
    phone: '828-286-9133',
    hours: 'Call for current pharmacy hours',
    travelNote: 'About 20–25 minutes from Lake Lure.',
    notes: null,
    detailsUrl: 'https://www.walgreens.com/locator/walgreens-121+railroad+ave-rutherfordton-nc-28139/id=17076',
    source: 'walgreens.com',
    lastVerified: '2026-08-23',
  },
]

export function healthcareProvidersLastVerified(): string | null {
  const dates = HEALTHCARE_PROVIDERS.map((p) => p.lastVerified).filter(
    (d): d is string => Boolean(d),
  )
  return dates.length ? dates.sort().at(-1)! : null
}

// ─── Rutherford County trail network — full directory ────────────────────────
// Sourced from the Rutherford Outdoor Coalition (rutherfordoutdoor.org), the
// nonprofit that builds/maintains/promotes trails across Rutherford County.
// This is the full county-wide list, distinct from the curated "More Hiking
// Nearby" AllTrails picks above — some trails (Bearwallow, Trombatore, Little
// Bradley Falls, Weed Patch Mountain, Youngs Mountain) appear in both lists
// with slightly different distance figures since the two sources measure
// differently. Individual trail-page URLs on the Coalition's site weren't
// scraped — link out to the overview page rather than guessing per-trail URLs.

export type TrailArea =
  | 'Hickory Nut Gorge'
  | 'Rutherford County'
  | 'Southern Rutherford'
  | 'Northern Rutherford'
  | 'Eastern Rutherford'

export type TrailDifficulty = 'Easy' | 'Moderate' | 'Strenuous'

export interface RutherfordTrail {
  id: string
  name: string
  area: TrailArea
  length: string
  difficulty: TrailDifficulty
  elevationGain: string
  estTime: string
}

export const RUTHERFORD_TRAILS_SOURCE_URL = 'https://rutherfordoutdoor.org/trails-overview'
export const RUTHERFORD_TRAILS_SOURCE_NAME = 'Rutherford Outdoor Coalition'
export const RUTHERFORD_TRAILS_LAST_VERIFIED = '2026-08-28'

export const RUTHERFORD_TRAIL_AREAS: TrailArea[] = [
  'Hickory Nut Gorge',
  'Rutherford County',
  'Southern Rutherford',
  'Northern Rutherford',
  'Eastern Rutherford',
]

export const RUTHERFORD_TRAILS: RutherfordTrail[] = [
  { id: 'alexanders-ford', name: 'Alexanders Ford', area: 'Rutherford County', length: '2.5 mi loop', difficulty: 'Moderate', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'bearwallow-mountain-trail', name: 'Bearwallow Mountain Trail', area: 'Hickory Nut Gorge', length: '2 mi one-way', difficulty: 'Moderate', elevationGain: '501–800 ft', estTime: '1.0–2.0 hr' },
  { id: 'big-bradley-falls-trail', name: 'Big Bradley Falls Trail', area: 'Hickory Nut Gorge', length: 'Not specified', difficulty: 'Moderate', elevationGain: '201–500 ft', estTime: '1.0–2.0 hr' },
  { id: 'broad-river-greenway', name: 'Broad River Greenway', area: 'Rutherford County', length: '12.9 mi (multiple trails)', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'broad-river-paddle-trail', name: 'Broad River Paddle Trail', area: 'Rutherford County', length: '49 mi (multiple segments)', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'buffalo-creek-park', name: 'Buffalo Creek Park', area: 'Rutherford County', length: '3.5 mi loop', difficulty: 'Moderate', elevationGain: '501–800 ft', estTime: '1.0–2.0 hr' },
  { id: 'catawba-falls-trail', name: 'Catawba Falls Trail', area: 'Hickory Nut Gorge', length: '3.5 mi full trail; 1.1 mi to lower falls', difficulty: 'Moderate', elevationGain: '801–1000 ft', estTime: '2.25–3.0 hr' },
  { id: 'chimney-rock-boulders-trail', name: 'Chimney Rock Boulders Trail', area: 'Hickory Nut Gorge', length: 'Not specified', difficulty: 'Moderate', elevationGain: '201–500 ft', estTime: '1.0–2.0 hr' },
  { id: 'chimney-rock-state-park-coalition', name: 'Chimney Rock State Park', area: 'Hickory Nut Gorge', length: '4+ mi (multiple trails)', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'cowpens-national-battlefield', name: 'Cowpens National Battlefield', area: 'Southern Rutherford', length: '4.5 mi (multiple trails)', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'crestview-park-walking-path', name: 'Crestview Park Walking Path', area: 'Rutherford County', length: 'Not specified', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'dittmer-watts-nature-trail-park', name: 'Dittmer-Watts Nature Trail Park', area: 'Rutherford County', length: '3.5 mi (multiple trails)', difficulty: 'Moderate', elevationGain: '201–500 ft', estTime: '1.0–2.0 hr' },
  { id: 'fence-trails', name: 'FENCE Trails', area: 'Rutherford County', length: '6 mi (multiple trails)', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'florence-nature-preserve', name: 'Florence Nature Preserve', area: 'Rutherford County', length: '5 mi (multiple trails)', difficulty: 'Moderate', elevationGain: '1001–1200 ft', estTime: '2.25–3.0 hr' },
  { id: 'green-river-game-lands', name: 'Green River Game Lands', area: 'Eastern Rutherford', length: '16 mi (multiple trails)', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'icc-trails', name: 'ICC Trails', area: 'Rutherford County', length: '3.5 mi (multiple trails)', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'joseph-mcdowell-historical-catawba-greenway', name: 'Joseph McDowell Historical Catawba Greenway', area: 'Rutherford County', length: '3.1 mi one-way', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'lake-james-state-park', name: 'Lake James State Park', area: 'Northern Rutherford', length: '25+ mi (multiple trails)', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'lake-lure-town-center-walkway', name: 'Lake Lure Town Center Walkway', area: 'Hickory Nut Gorge', length: '0.5 mi', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'little-bradley-falls-trail', name: 'Little Bradley Falls Trail', area: 'Hickory Nut Gorge', length: '1.9 mi one-way', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'little-white-oak-mountain', name: 'Little White Oak Mountain', area: 'Rutherford County', length: '3.5 mi', difficulty: 'Moderate', elevationGain: '201–500 ft', estTime: '1.0–2.0 hr' },
  { id: 'missing-40-trail', name: 'Missing 40 Trail', area: 'Rutherford County', length: '1 mi loop', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'morse-park-trails', name: 'Morse Park Trails', area: 'Rutherford County', length: '1 mi', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'norman-wilder-forest', name: 'Norman Wilder Forest', area: 'Rutherford County', length: 'Not specified', difficulty: 'Moderate', elevationGain: '501–800 ft', estTime: '1.0–2.0 hr' },
  { id: 'old-fort-gateway-trails', name: 'Old Fort Gateway Trails', area: 'Rutherford County', length: '6 mi', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'pearsons-falls', name: "Pearson's Falls", area: 'Rutherford County', length: 'Not specified', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'purple-martin-greenway', name: 'Purple Martin Greenway', area: 'Rutherford County', length: 'Not specified', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'rocky-broad-riverwalk', name: 'Rocky Broad Riverwalk', area: 'Rutherford County', length: '0.13 mi', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'rumbling-bald-chimney-rock-trail', name: 'Rumbling Bald at Chimney Rock State Park Trail', area: 'Hickory Nut Gorge', length: '1.5 mi', difficulty: 'Moderate', elevationGain: '201–500 ft', estTime: '1.0–2.0 hr' },
  { id: 'rutherford-county-walking-path', name: 'Rutherford County Walking Path', area: 'Rutherford County', length: '0.5 mi', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'south-mountains-christian-camp', name: 'South Mountains Christian Camp', area: 'Southern Rutherford', length: '3+ mi', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'south-mountains-game-lands', name: 'South Mountains Game Lands', area: 'Southern Rutherford', length: '20 mi (multiple trails)', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'south-mountains-state-park', name: 'South Mountains State Park', area: 'Southern Rutherford', length: '40 mi (multiple trails)', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'strawberry-gap', name: 'Strawberry Gap', area: 'Hickory Nut Gorge', length: '5.1 mi', difficulty: 'Moderate', elevationGain: '1001–1200 ft', estTime: '2.25–3.0 hr' },
  { id: 'summey-park-walking-trails', name: 'Summey Park Walking Trails', area: 'Rutherford County', length: '0.25 mi', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'thermal-belt-rail-trail', name: 'Thermal Belt Rail Trail', area: 'Rutherford County', length: '13.5 mi', difficulty: 'Moderate', elevationGain: '201–500 ft', estTime: '4.25–5.0 hr' },
  { id: 'trombatore-trail-coalition', name: 'Trombatore Trail', area: 'Hickory Nut Gorge', length: '5 mi one-way', difficulty: 'Strenuous', elevationGain: '1200+ ft', estTime: '2.25–3.0 hr' },
  { id: 'vaughn-creek-greenway', name: 'Vaughn Creek Greenway', area: 'Rutherford County', length: '1.6 mi', difficulty: 'Easy', elevationGain: '0–200 ft', estTime: '1.0–2.0 hr' },
  { id: 'weed-patch-mountain-trail-coalition', name: 'Weed Patch Mountain Trail', area: 'Rutherford County', length: '18.5 mi', difficulty: 'Strenuous', elevationGain: '1200+ ft', estTime: '6.25+ hr' },
  { id: 'wildcat-rock-little-bearwallow', name: 'Wildcat Rock / Little Bearwallow', area: 'Hickory Nut Gorge', length: '4.8 mi one-way', difficulty: 'Strenuous', elevationGain: '1200+ ft', estTime: '3.25–4.0 hr' },
  { id: 'youngs-mountain-trail-coalition', name: "Young's Mountain Trail", area: 'Rutherford County', length: '4.3 mi one-way', difficulty: 'Moderate', elevationGain: '1001–1200 ft', estTime: '2.25–3.0 hr' },
]

// ─── Places to eat — Lake Lure & Chimney Rock restaurants ────────────────────
// Cross-platform rating snapshot (Google, Tripadvisor, Facebook) for
// restaurants around Lake Lure and Chimney Rock Village. Google ratings
// pulled directly from Google Maps listings; Tripadvisor from tripadvisor.com
// (robots.txt allows fetching); Facebook uses Meta's "% recommend" format,
// since Facebook Pages no longer show a 5-star average. Yelp is intentionally
// excluded — yelp.com blocks automated access (bot-detection challenge) and
// we don't bypass that.
//
// Lured Market & Grill IS included below. It's also the subject of an active,
// unresolved eviction dispute this outlet is reporting on (see /news), and
// this site has an open petition supporting it — flagging that plainly here
// and on the page itself. Per Pete (2026-08-28): the ratings are public data
// from Google/Tripadvisor, not this outlet's own opinion, so there's no
// reason to withhold them. Facebook wasn't available for this one — its page
// returned "content isn't available" at last check.
//
// Old Rock Cafe (431 Main St, Chimney Rock) is excluded — confirmed closed
// due to Hurricane Helene flooding damage (per Pete, 2026-08-28), matching
// its own Google Maps listing ("Permanently closed"), even though it's still
// listed on chimneyrock.org's own eat/drink page as of this writing.

export interface PlatformRating {
  rating: number
  count: number
}

export interface FacebookRating {
  recommendPercent: number
  count: number
}

export type RestaurantArea = 'Lake Lure' | 'Chimney Rock Village'

export interface Restaurant {
  id: string
  name: string
  area: RestaurantArea
  cuisine: string
  priceRange: string
  address: string
  phone: string | null
  detailsUrl: string
  google: PlatformRating | null
  tripadvisor: PlatformRating | null
  facebook: FacebookRating | null
  source: string
  lastVerified: string
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'la-strada-at-lake-lure',
    name: 'La Strada At Lake Lure',
    area: 'Lake Lure',
    cuisine: 'Italian, American',
    priceRange: '$$',
    address: '2693 Memorial Hwy, Lake Lure, NC 28746',
    phone: '828-625-1118',
    detailsUrl: 'https://lastradaatlakelure.com/',
    google: { rating: 4.3, count: 2331 },
    tripadvisor: { rating: 4.4, count: 1825 },
    facebook: { recommendPercent: 88, count: 1355 },
    source: 'Google Maps, Tripadvisor, Facebook',
    lastVerified: '2026-08-28',
  },
  {
    id: 'appalachia-restaurant',
    name: 'Appalachia Restaurant',
    area: 'Lake Lure',
    cuisine: 'New American, Appalachian',
    priceRange: '$$$',
    address: '361 Charlotte Dr, Lake Lure, NC 28746 (inside The Lodge on Lake Lure)',
    phone: '828-655-0634',
    detailsUrl: 'https://www.appalachiarestaurant.com/',
    google: { rating: 4.8, count: 157 },
    tripadvisor: { rating: 4.8, count: 62 },
    facebook: { recommendPercent: 100, count: 10 },
    source: 'Google Maps, Tripadvisor, Facebook',
    lastVerified: '2026-08-28',
  },
  {
    id: 'victory-kitchen-restaurant',
    name: 'Victory Kitchen & Restaurant',
    area: 'Lake Lure',
    cuisine: 'American, Breakfast & Brunch',
    priceRange: '$',
    address: '959 Buffalo Creek Rd, Lake Lure, NC 28746',
    phone: '828-436-5023',
    detailsUrl: 'https://www.facebook.com/victorykitchen1/',
    google: { rating: 4.6, count: 659 },
    tripadvisor: { rating: 4.6, count: 126 },
    facebook: { recommendPercent: 96, count: 243 },
    source: 'Google Maps, Tripadvisor, Facebook',
    lastVerified: '2026-08-28',
  },
  {
    id: 'el-lago-mexican-restaurant',
    name: 'El Lago Mexican Restaurant',
    area: 'Lake Lure',
    cuisine: 'Mexican',
    priceRange: '$$',
    address: '119 Arcade St, Lake Lure, NC 28746',
    phone: '828-625-9051',
    detailsUrl: 'https://www.facebook.com/p/El-Lago-At-Lake-Lure-Beach-100063509866055/',
    google: { rating: 4.3, count: 517 },
    tripadvisor: { rating: 3.7, count: 129 },
    facebook: { recommendPercent: 92, count: 30 },
    source: 'Google Maps, Tripadvisor, Facebook',
    lastVerified: '2026-08-28',
  },
  {
    id: 'legends-on-the-lake',
    name: 'Legends on the Lake',
    area: 'Lake Lure',
    cuisine: 'American, Bar & Grill',
    priceRange: '$$',
    address: '153 Mountains Blvd, Lake Lure, NC 28746 (Rumbling Bald on Lake Lure)',
    phone: '828-694-3032',
    detailsUrl: 'https://rumblingbald.com/venue/legends-on-the-lake/',
    google: { rating: 4.1, count: 830 },
    tripadvisor: { rating: 3.8, count: 358 },
    facebook: { recommendPercent: 92, count: 32 },
    source: 'Google Maps, Tripadvisor, Facebook',
    lastVerified: '2026-08-28',
  },
  {
    id: 'lakehouse-restaurant-bar-grill',
    name: 'Lake House Restaurant Bar & Grill',
    area: 'Lake Lure',
    cuisine: 'American',
    priceRange: '$$',
    address: '1020 Memorial Hwy, Lake Lure, NC 28746',
    phone: '828-625-4075',
    detailsUrl: 'https://www.lakehouselakelure.com/',
    google: { rating: 4.2, count: 2928 },
    tripadvisor: { rating: 3.2, count: 99 },
    facebook: { recommendPercent: 88, count: 450 },
    source: 'Google Maps, Tripadvisor, Facebook',
    lastVerified: '2026-08-28',
  },
  {
    id: 'canoe-kitchen-and-bar',
    name: 'Canoe Kitchen and Bar',
    area: 'Lake Lure',
    cuisine: 'American, Small Plates',
    priceRange: '$$',
    address: '454 Memorial Hwy, Lake Lure, NC 28746',
    phone: null,
    detailsUrl: 'https://www.canoekitchenandbar.com/',
    google: { rating: 4.6, count: 456 },
    tripadvisor: null,
    facebook: null,
    source: 'Google Maps (not yet listed on Tripadvisor; Facebook page did not expose a review count at last check)',
    lastVerified: '2026-08-28',
  },
  {
    id: 'the-highlands-reserve',
    name: 'The Highlands Reserve',
    area: 'Lake Lure',
    cuisine: 'American, Seafood',
    priceRange: '$$$',
    address: '143 Whitney Blvd, Lake Lure, NC 28746',
    phone: '828-532-4266',
    detailsUrl: 'https://thehighlands-reserve.com/',
    google: { rating: 4.6, count: 805 },
    tripadvisor: { rating: 3.7, count: 6 },
    facebook: { recommendPercent: 100, count: 6 },
    source: 'Google Maps, Tripadvisor, Facebook',
    lastVerified: '2026-08-28',
  },
  {
    id: 'the-828',
    name: 'The 828',
    area: 'Lake Lure',
    cuisine: 'American, Sports Bar & Grill — recently opened',
    priceRange: '$$',
    address: '3100 Memorial Hwy, Lake Lure, NC 28746',
    phone: '828-532-8087',
    detailsUrl: 'https://www.the828taproom.com/',
    google: { rating: 4.6, count: 159 },
    tripadvisor: { rating: 5.0, count: 3 },
    facebook: { recommendPercent: 96, count: 20 },
    source: 'Google Maps, Tripadvisor, Facebook',
    lastVerified: '2026-08-28',
  },
  {
    id: 'lured-market-and-grill',
    name: 'Lured Market & Grill',
    area: 'Lake Lure',
    cuisine: 'American, Pub Fare, Market/Deli',
    priceRange: '$$',
    address: '2655 Memorial Hwy, Lake Lure, NC 28746',
    phone: '828-844-4339',
    detailsUrl: 'https://www.luredmarketandgrill.com/',
    google: { rating: 4.8, count: 234 },
    tripadvisor: { rating: 4.6, count: 41 },
    facebook: null,
    source: 'Google Maps, Tripadvisor (Facebook page unavailable at last check)',
    lastVerified: '2026-08-28',
  },
  {
    id: 'riverwatch-bar-grill',
    name: 'RiverWatch Bar & Grill',
    area: 'Chimney Rock Village',
    cuisine: 'American, Bar & Grill',
    priceRange: '$$',
    address: '379 Main St, Chimney Rock, NC 28720',
    phone: '828-625-1030',
    detailsUrl: 'https://riverwatchgrill.com/',
    google: { rating: 4.6, count: 2812 },
    tripadvisor: { rating: 4.3, count: 877 },
    facebook: { recommendPercent: 92, count: 1343 },
    source: 'Google Maps, Tripadvisor, Facebook',
    lastVerified: '2026-08-28',
  },
  {
    id: 'chimney-rock-smokehouse',
    name: 'Chimney Rock Smokehouse',
    area: 'Chimney Rock Village',
    cuisine: 'Barbecue',
    priceRange: '$$',
    address: '430 Main St, Chimney Rock, NC 28720',
    phone: '828-239-8939',
    detailsUrl: 'https://www.chimneyrocksmokehouse.com/',
    google: { rating: 4.7, count: 921 },
    tripadvisor: { rating: 4.6, count: 45 },
    facebook: { recommendPercent: 92, count: 61 },
    source: 'Google Maps, Tripadvisor, Facebook',
    lastVerified: '2026-08-28',
  },
]

export const RESTAURANT_AREAS: RestaurantArea[] = ['Lake Lure', 'Chimney Rock Village']

// Facebook shows "% recommend" instead of a 5-star average. To fold it into a
// single blended score alongside Google/Tripadvisor stars, we convert with a
// standard linear mapping: 0% recommend -> 1.0 stars, 100% recommend -> 5.0
// stars. This is an approximation, disclosed on the page — not a claim that
// Facebook itself computes a star rating.
export function facebookRecommendToStars(recommendPercent: number): number {
  return 1 + 4 * (recommendPercent / 100)
}

export interface CumulativeRating {
  score: number
  totalReviews: number
  platformCount: number
}

// Review-count-weighted average across whichever platforms have data for a
// given restaurant (at least Google is always present in this data set).
export function computeCumulativeRating(restaurant: Restaurant): CumulativeRating {
  const parts: { rating: number; count: number }[] = []
  if (restaurant.google) parts.push(restaurant.google)
  if (restaurant.tripadvisor) parts.push(restaurant.tripadvisor)
  if (restaurant.facebook) {
    parts.push({
      rating: facebookRecommendToStars(restaurant.facebook.recommendPercent),
      count: restaurant.facebook.count,
    })
  }

  const totalReviews = parts.reduce((sum, p) => sum + p.count, 0)
  const weightedSum = parts.reduce((sum, p) => sum + p.rating * p.count, 0)

  return {
    score: totalReviews > 0 ? Math.round((weightedSum / totalReviews) * 10) / 10 : 0,
    totalReviews,
    platformCount: parts.length,
  }
}

export function restaurantsLastVerified(): string | null {
  const dates = RESTAURANTS.map((r) => r.lastVerified).filter(
    (d): d is string => Boolean(d),
  )
  return dates.length ? dates.sort().at(-1)! : null
}
