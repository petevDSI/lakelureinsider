import Link from 'next/link'

interface Pick {
  label: string
  href: string
}

interface QuickPicksProps {
  picks: Pick[]
}

export function QuickPicks({ picks }: QuickPicksProps) {
  if (!picks || picks.length === 0) return null
  return (
    <div className="not-prose my-6 flex flex-wrap gap-2">
      {picks.map((pick) => (
        <Link
          key={pick.href}
          href={pick.href}
          className="rounded-full border border-(--lake) px-4 py-1.5 text-sm font-medium text-(--lake) transition-colors hover:bg-(--lake) hover:text-white"
        >
          {pick.label}
        </Link>
      ))}
    </div>
  )
}
