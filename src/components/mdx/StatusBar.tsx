type StatusType = 'open' | 'closed' | 'limited' | 'anticipated' | 'conflict'

interface StatusBarItem {
  label: string
  status: StatusType
  note: string
  verified?: string
}

interface Props {
  items: StatusBarItem[]
}

const DOT: Record<StatusType, string> = {
  open:        'bg-emerald-500',
  closed:      'bg-red-500',
  limited:     'bg-amber-500',
  anticipated: 'bg-sky-400',
  conflict:    'bg-orange-400',
}

export function StatusBar({ items = [] }: Props) {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex gap-2.5 rounded-lg border border-(--sand) bg-white p-3 shadow-sm">
          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${DOT[item.status]}`} aria-hidden="true" />
          <div>
            <div className="text-sm font-semibold text-(--forest)">{item.label}</div>
            <div className="text-xs text-(--ink)/70">{item.note}</div>
            {item.verified && (
              <div className="mt-0.5 text-[0.65rem] text-(--ink)/40">Verified {item.verified}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
