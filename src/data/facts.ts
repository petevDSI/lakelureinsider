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
  entryClose: string
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
      entryClose: '3:00 PM',
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
      entryClose: '3:00 PM',
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
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
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
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },

  // Drive times
  'drive.lake-lure-to-chimney-rock.minutes': {
    value: 'about 15 minutes', // TODO: VERIFY — approximate; confirm with current mapping
    source: null,
    lastVerified: null,
  },
  'drive.lake-lure-to-chimney-rock.miles': {
    value: 'about 8 miles', // TODO: VERIFY — approximate road distance
    source: null,
    lastVerified: null,
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
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function factValue(key: string): string {
  return facts[key]?.value ?? '{{TODO}}'
}

export function verifiedLine(key: string): string {
  const f = facts[key]
  if (!f?.lastVerified) return ''
  return `Verified ${f.lastVerified}`
}
