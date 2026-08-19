import type { ScheduledItem } from '@/types/schedule'

/**
 * Authoritative list of time-bounded items tracked by the lifecycle system.
 *
 * End-behavior by kind:
 *   event    → archive to /archive/events/<archiveSlug>; URL stays indexed.
 *              Build fails if end is >7 days past and item is still here.
 *   closure  → remove from page + noindex when ended.
 *              Build fails if end is >7 days past and item is still here.
 *   season   → flip to "Closed for season" message; never archived.
 *   project  → move to "Recently completed" list; visible 6 months then archive.
 *
 * MAINTENANCE: When a closure or event item ends and the 7-day grace period
 * passes, the build will fail until you either:
 *   - Remove the item from this array (closures, expired events)
 *   - Move it to content/archive/events/ and remove from this array (events)
 */
export const SCHEDULE_ITEMS: ScheduledItem[] = [
  {
    id: 'green-salamander-art-trail',
    title: 'Green Salamander Art Trail',
    schedule: { start: '2026-05-01', end: '2026-08-31', kind: 'event' },
    archiveSlug: 'green-salamander-art-trail-2026',
    note: '33 sculptures displayed through August 31 — auctioned at the End-of-Season Celebration benefiting the Hickory Nut Chamber of Commerce.',
  },
  {
    id: 'lake-lure-centennial',
    title: 'Lake Lure Centennial Celebration',
    schedule: { start: '2026-09-01', end: '2026-09-30', kind: 'event' },
    archiveSlug: 'lake-lure-centennial-2026',
    note: 'Celebration on the water — exact date TBD. Check townoflakelure.com for details as September approaches.',
  },
  {
    id: 'boys-camp-road-bridge',
    title: 'Boys Camp Road Bridge Reconstruction',
    // 120 days from July 27 = November 24
    schedule: { start: '2026-07-27', end: '2026-11-24', kind: 'project' },
    note: '120-day construction timeline. Temporary bridge remains in use throughout — Boys Camp Road stays passable.',
  },
  {
    id: 'lake-lure-beach-season',
    title: 'Lake Lure Beach',
    schedule: { start: '2026-05-15', end: '2026-09-07', kind: 'season' },
    reopensMonth: 'May',
    note: 'Daily 10 AM–6 PM through August 11, then weekends only through Labor Day (September 7).',
  },
  {
    id: 'washburn-marina-rebuild',
    title: 'Washburn Marina Reconstruction',
    schedule: { start: '2024-10-01', end: '2026-07-01', kind: 'project' },
    completedDate: 'July 2026',
    note: 'Reopened July 2026 after 22-month post-Helene reconstruction.',
  },
]
