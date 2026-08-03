export interface Fact {
  value: string | null
  source: string | null
  lastVerified: string | null
}

export const facts: Record<string, Fact> = {
  // Chimney Rock State Park
  'chimney-rock.admission.adult': {
    value: null, // TODO: VERIFY
    source: null, // TODO: VERIFY — check chimneyrock.com
    lastVerified: null,
  },
  'chimney-rock.admission.child': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
  'chimney-rock.hours.summer': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
  'chimney-rock.hours.winter': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },
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
  'lake-lure.beach.hours': {
    value: null, // TODO: VERIFY
    source: null,
    lastVerified: null,
  },

  // Drive times from nearby cities
  'drive.asheville-to-lake-lure.minutes': {
    value: null, // TODO: VERIFY — approximately 45–50 min
    source: null,
    lastVerified: null,
  },
  'drive.charlotte-to-lake-lure.minutes': {
    value: null, // TODO: VERIFY — approximately 90 min
    source: null,
    lastVerified: null,
  },
}

export function verifiedLine(key: string): string {
  const fact = facts[key]
  if (!fact?.lastVerified) return ''
  return `Verified ${fact.lastVerified}`
}

export function factValue(key: string): string {
  return facts[key]?.value ?? 'call ahead to confirm'
}
