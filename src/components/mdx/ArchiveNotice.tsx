import Link from 'next/link'
import { getScheduleItem, computeStatus } from '@/lib/schedule'

interface Props {
  id: string
}

function formatDate(iso: string): string {
  // See EventStatus.tsx — same rationale: parse date-only ISO strings in UTC.
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    timeZone: 'UTC',
  })
}

export function ArchiveNotice({ id }: Props) {
  const item = getScheduleItem(id)
  if (!item) return null

  const status = computeStatus(item)
  if (status !== 'ended') return null
  if (item.schedule.kind !== 'event') return null

  const endDate = item.schedule.end ? formatDate(item.schedule.end) : null

  return (
    <div className="my-6 rounded-lg border border-(--sand) bg-(--sand)/40 px-4 py-3 text-sm text-(--ink)/70">
      <span className="font-semibold text-(--ink)">This event ended{endDate ? ` ${endDate}` : ''}.</span>
      {item.archiveSlug && (
        <> You&apos;re viewing the archived page.{' '}
          {item.nextOccurrenceUrl ? (
            <Link href={item.nextOccurrenceUrl} className="text-(--lake) underline underline-offset-2">
              See the current listing →
            </Link>
          ) : (
            <span>Check back for the next occurrence.</span>
          )}
        </>
      )}
    </div>
  )
}
