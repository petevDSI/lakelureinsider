import { getScheduleItem, computeStatus } from '@/lib/schedule'
import type { LifecycleStatus } from '@/types/schedule'

interface Props {
  id: string
}

const CONFIG: Record<LifecycleStatus, { dot: string; label: string; textColor: string }> = {
  upcoming:   { dot: 'bg-sky-400',     label: 'Upcoming',   textColor: 'text-sky-700' },
  active:     { dot: 'bg-emerald-500', label: 'Active',     textColor: 'text-emerald-700' },
  endingSoon: { dot: 'bg-amber-500',   label: 'Ends soon',  textColor: 'text-amber-700' },
  ended:      { dot: 'bg-gray-400',    label: 'Ended',      textColor: 'text-gray-500' },
}

function formatDate(iso: string): string {
  // Parse date-only strings (e.g. "2026-08-31") as UTC so the displayed date
  // matches the calendar date as written. Without timeZone: 'UTC', the UTC
  // midnight instant would display as the previous day in America/New_York.
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    timeZone: 'UTC',
  })
}

export function EventStatus({ id }: Props) {
  const item = getScheduleItem(id)
  if (!item) return null

  const status = computeStatus(item)
  const { dot, label, textColor } = CONFIG[status]
  const { start, end, kind } = item.schedule

  let dateNote = ''
  if (status === 'upcoming') {
    dateNote = `Starts ${formatDate(start)}`
  } else if (status === 'endingSoon' && end) {
    dateNote = `Ends ${formatDate(end)}`
  } else if (status === 'ended' && end) {
    dateNote = kind === 'season'
      ? `Closed for season — typically reopens ${item.reopensMonth ?? 'spring'}`
      : `Ended ${formatDate(end)}`
  } else if (status === 'active' && end) {
    dateNote = `Through ${formatDate(end)}`
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[--sand] bg-white px-2.5 py-0.5 text-xs font-medium shadow-sm">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      <span className={textColor}>{label}</span>
      {dateNote && (
        <span className="text-[--ink]/50">· {dateNote}</span>
      )}
    </span>
  )
}
