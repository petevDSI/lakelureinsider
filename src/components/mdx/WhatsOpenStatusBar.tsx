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
    <div className="flex gap-2.5 rounded-lg border border-[--sand] bg-white p-3 shadow-sm">
      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${DOT[status] ?? 'bg-gray-400'}`} aria-hidden="true" />
      <div>
        <div className="text-sm font-semibold text-[--forest]">{label}</div>
        <div className="text-xs text-[--ink]/70">{note}</div>
        <div className="mt-0.5 text-[0.65rem] text-[--ink]/40">Verified {verified}</div>
      </div>
    </div>
  )
}

export function WhatsOpenStatusBar() {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Card label="Chimney Rock Park"        status="open"    note="Open daily · Elevator operational"        verified="2026-08-03" />
      <Card label="Lake Lure"                status="open"    note="Reopened May 2026 · Swimming & boating"   verified="2026-08-03" />
      <Card label="Lake Lure Beach"          status="open"    note="Open through Labor Day Sept 7"            verified="2026-08-03" />
      <Card label="Flowering Bridge Gardens" status="open"    note="Open free 24 hrs · Bridge demolished"     verified="2026-08-03" />
      <Card label="US 64/74A"                status="limited" note="Open · Construction through 2029"         verified="2026-08-03" />
    </div>
  )
}
