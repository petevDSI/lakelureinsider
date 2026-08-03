export type StatusKind = 'event' | 'closure' | 'season' | 'project'

export type LifecycleStatus = 'upcoming' | 'active' | 'endingSoon' | 'ended'

export interface ScheduleBlock {
  /** ISO date string — when this item becomes active */
  start: string
  /** ISO date string — when this item ends. null means ongoing. */
  end: string | null
  kind: StatusKind
}

export interface ScheduledItem {
  id: string
  title: string
  schedule: ScheduleBlock
  /** event: URL path for the archive page at /archive/events/<archiveSlug> */
  archiveSlug?: string
  /** event: URL of the next occurrence when one is known */
  nextOccurrenceUrl?: string
  /** season: human-readable month the attraction typically reopens, e.g. "May" */
  reopensMonth?: string
  /** project: human-readable month/year completion, e.g. "July 2026" */
  completedDate?: string
  /** Optional note surfaced by EventStatus in 'active' / 'endingSoon' states */
  note?: string
}
