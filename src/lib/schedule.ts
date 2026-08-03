import type { ScheduledItem, LifecycleStatus } from '@/types/schedule'
import { SCHEDULE_ITEMS } from '@/data/schedule'

const ENDING_SOON_DAYS = 14
const STALE_FAIL_DAYS = 7

export function computeStatus(item: ScheduledItem, buildDate: Date = new Date()): LifecycleStatus {
  const start = new Date(item.schedule.start)
  const end = item.schedule.end ? new Date(item.schedule.end) : null

  if (start > buildDate) return 'upcoming'

  if (!end) return 'active'

  if (end < buildDate) return 'ended'

  const daysUntilEnd = (end.getTime() - buildDate.getTime()) / (1000 * 60 * 60 * 24)
  return daysUntilEnd <= ENDING_SOON_DAYS ? 'endingSoon' : 'active'
}

export function getScheduleItem(id: string): ScheduledItem | undefined {
  return SCHEDULE_ITEMS.find((item) => item.id === id)
}

/**
 * Build enforcement: fail if any event or closure item has an end date more
 * than STALE_FAIL_DAYS in the past. These items must be cleaned up — either
 * removed (closures) or moved to /archive/events/ (events).
 *
 * Called from getAllPages() in content.ts so it runs at Next.js build time.
 */
export function enforceScheduleStaleness(buildDate: Date = new Date()): void {
  const stale = SCHEDULE_ITEMS.filter((item) => {
    const { kind, end } = item.schedule
    if (kind !== 'event' && kind !== 'closure') return false
    if (!end) return false
    const endDate = new Date(end)
    const daysPast = (buildDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysPast > STALE_FAIL_DAYS
  })

  if (stale.length === 0) return

  const details = stale
    .map((item) => `  • ${item.id} (${item.schedule.kind}, ended ${item.schedule.end})`)
    .join('\n')

  throw new Error(
    `[schedule] Build error: ${stale.length} stale schedule item(s) must be cleaned up:\n` +
    details + '\n\n' +
    `  Closures: remove from src/data/schedule.ts\n` +
    `  Events: create content/archive/events/<archiveSlug>.mdx then remove from schedule.ts`,
  )
}
