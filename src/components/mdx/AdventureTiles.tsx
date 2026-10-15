interface Tile {
  title: string
  blurb: string
  who: string
  href: string
  tone: 'forest' | 'lake' | 'deep' | 'sand'
  icon: 'pontoon' | 'ski' | 'paddle' | 'fish'
}

const TONES: Record<Tile['tone'], string> = {
  forest: 'bg-(--forest) text-white',
  lake: 'bg-(--lake) text-white',
  deep: 'bg-[#1F5560] text-white',
  sand: 'bg-(--sand) text-(--forest)',
}

function Icon({ name }: { name: Tile['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
      {name === 'pontoon' && (
        <g {...common}>
          <path d="M6 30h36l-4 7H10z" />
          <path d="M12 30v-8h24v8" />
          <path d="M18 22v-5h12v5" />
          <path d="M4 42c4 0 4-2 8-2s4 2 8 2 4-2 8-2 4 2 8 2 4-2 8-2" />
        </g>
      )}
      {name === 'ski' && (
        <g {...common}>
          <path d="M8 36l20-4 12 2" />
          <circle cx="26" cy="12" r="3" />
          <path d="M26 15l-4 10 6 4M24 19l-8-3M26 17l9 4" />
          <path d="M4 42c4 0 4-2 8-2s4 2 8 2 4-2 8-2 4 2 8 2 4-2 8-2" />
        </g>
      )}
      {name === 'paddle' && (
        <g {...common}>
          <path d="M6 32c10 6 26 6 36 0-10-4-26-4-36 0z" />
          <path d="M14 14l22 14" />
          <path d="M11 11l6 4M33 25l6 4" />
          <path d="M4 42c4 0 4-2 8-2s4 2 8 2 4-2 8-2 4 2 8 2 4-2 8-2" />
        </g>
      )}
      {name === 'fish' && (
        <g {...common}>
          <path d="M6 26c6-9 18-12 28-4l8-6v20l-8-6C24 38 12 35 6 26z" />
          <circle cx="16" cy="24" r="1.5" />
        </g>
      )}
    </svg>
  )
}

export function AdventureTiles({ tiles }: { tiles: Tile[] }) {
  if (!tiles || tiles.length === 0) return null
  return (
    <div className="not-prose my-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((t) => (
        <a
          key={t.title}
          href={t.href}
          className={`group relative flex no-underline [&_*]:!text-inherit [&_*]:no-underline min-h-[11rem] flex-col justify-between overflow-hidden rounded-2xl p-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--clay) ${TONES[t.tone]}`}
        >
          <Icon name={t.icon} />
          <div>
            <h3 className="font-display text-xl font-bold leading-tight">{t.title}</h3>
            <p className="mt-1 text-sm leading-snug opacity-90">{t.blurb}</p>
            <p className="mt-2 text-xs font-semibold opacity-80">{t.who}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
