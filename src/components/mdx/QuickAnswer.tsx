interface QuickAnswerProps {
  items?: Record<string, string>
  children?: React.ReactNode
}

export function QuickAnswer({ items, children }: QuickAnswerProps) {
  return (
    <div className="not-prose my-8 rounded-lg border border-(--sand) bg-(--sand) px-6 py-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-(--forest)">
        Quick Answer
      </p>
      {items && Object.keys(items).length > 0 ? (
        <dl className="grid gap-2 sm:grid-cols-2">
          {Object.entries(items).map(([key, val]) => (
            <div key={key} className="flex flex-col">
              <dt className="text-sm font-medium text-(--ink)/60">{key}</dt>
              <dd className="text-base font-semibold text-(--ink)">{val}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="text-(--ink)">{children}</div>
      )}
    </div>
  )
}
