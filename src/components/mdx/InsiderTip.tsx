interface InsiderTipProps {
  children: React.ReactNode
}

export function InsiderTip({ children }: InsiderTipProps) {
  return (
    <aside className="not-prose my-8 border-l-4 border-[--clay] bg-[--paper] px-6 py-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[--clay]">
        Insider Tip
      </p>
      <div className="text-base leading-relaxed text-[--ink]">{children}</div>
    </aside>
  )
}
