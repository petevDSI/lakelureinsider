interface SectionHeaderProps {
  kicker: string
  children: React.ReactNode
}

export function SectionHeader({ kicker, children }: SectionHeaderProps) {
  return (
    <div className="not-prose mb-4 mt-14">
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[--lake]">
        {kicker}
      </p>
      <h2 className="font-display text-2xl font-bold text-[--forest] sm:text-3xl">
        {children}
      </h2>
    </div>
  )
}
