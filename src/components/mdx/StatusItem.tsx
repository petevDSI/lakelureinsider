type StatusType = 'open' | 'closed' | 'limited' | 'anticipated' | 'conflict'

interface Props {
  name: string
  status: StatusType
  detail: string
  sourceUrl?: string
  sourceLabel?: string
  verified?: string
}

const CONFIG: Record<StatusType, { dot: string; ring: string; label: string }> = {
  open:        { dot: 'bg-emerald-500', ring: 'border-emerald-200 bg-emerald-50',   label: 'Open' },
  closed:      { dot: 'bg-red-500',     ring: 'border-red-200 bg-red-50',           label: 'Closed' },
  limited:     { dot: 'bg-amber-500',   ring: 'border-amber-200 bg-amber-50',       label: 'Limited' },
  anticipated: { dot: 'bg-sky-400',     ring: 'border-sky-200 bg-sky-50',           label: 'Expected soon' },
  conflict:    { dot: 'bg-orange-400',  ring: 'border-orange-200 bg-orange-50',     label: 'Sources conflict' },
}

export function StatusItem({ name, status, detail, sourceUrl, sourceLabel, verified }: Props) {
  const c = CONFIG[status]
  return (
    <div className={`my-4 flex gap-3 rounded-lg border p-4 ${c.ring}`}>
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${c.dot}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <strong className="text-[--forest]">{name}</strong>
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[--ink]/40">{c.label}</span>
        </div>
        <p className="mt-0.5 text-sm leading-snug text-[--ink]/80">{detail}</p>
        {(sourceUrl || verified) && (
          <p className="mt-1.5 text-[0.7rem] text-[--ink]/40">
            {sourceUrl && (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[--lake]">
                {sourceLabel ?? sourceUrl}
              </a>
            )}
            {sourceUrl && verified && ' · '}
            {verified && `Verified ${verified}`}
          </p>
        )}
      </div>
    </div>
  )
}
