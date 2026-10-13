// Self-contained status bar for /whats-open-now.
// Hardcodes current status rather than accepting array props from MDX,
// avoiding the next-mdx-remote v6 limitation with inline array-of-objects props.

const DOT: Record<string, string> = {
  open:        'bg-emerald-500',
  closed:      'bg-red-500',
  limited:     'bg-amber-500',
  anticipated: 'bg-sky-400',
  conflict:    'bg-orange-400',
}

interface Item {
  label: string
  status: string
  note: string
  verified: string
}

function Card({ label, status, note, verified }: Item) {
  return (
    <div className="flex gap-2.5 rounded-lg border border-(--sand) bg-white p-3 shadow-sm">
      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${DOT[status] ?? 'bg-gray-400'}`} aria-hidden="true" />
      <div>
        <div className="text-sm font-semibold text-(--forest)">{label}</div>
        <div className="text-xs text-(--ink)/70">{note}</div>
        <div className="mt-0.5 text-[0.65rem] text-(--ink)/40">Verified {verified}</div>
      </div>
    </div>
  )
}

export function WhatsOpenStatusBar() {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Card label="Chimney Rock Park"        status="open"    note="Open daily · Hours shorten Nov 2 (last entry 4:30, closes 6)" verified="2026-10-13" />
      <Card label="Lake Lure"                status="open"    note="Reopened May 2026 · Boating open · Lake near full pond" verified="2026-10-11" />
      <Card label="Lake Lure Beach"          status="closed"  note="Closed for the winter · Returns around Memorial Day 2027" verified="2026-10-13" />
      <Card label="Flowering Bridge Gardens" status="open"    note="Open free 24 hrs · New Rainbow Bridge ready for visitors"     verified="2026-10-13" />
      <Card label="US 64/74A"                status="limited" note="Open · Eastbound lane near Dogwood RV Park closed (as of Oct 11)" verified="2026-10-13" />
    </div>
  )
}
