interface Tile {
  title: string
  blurb: string
  who?: string
  href: string
  tone: 'forest' | 'lake' | 'deep' | 'sand'
  icon: 'pontoon' | 'ski' | 'paddle' | 'fish' | 'plate' | 'boot' | 'bag' | 'spa' | 'apple' | 'grape' | 'golf' | 'climb' | 'horse' | 'mountain' | 'bed' | 'tent' | 'ring' | 'compass'
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
      {name === 'plate' && (
        <g {...common}>
          <circle cx="24" cy="26" r="13" />
          <circle cx="24" cy="26" r="7" />
          <path d="M5 10v10M9 10v10M5 15h4M7 20v18M43 10c-4 4-4 12 0 14v14" />
        </g>
      )}
      {name === 'boot' && (
        <g {...common}>
          <path d="M14 6v22l-8 6v6h32c0-6-6-8-12-10l-4-4V6z" />
          <path d="M14 14h12M14 20h12" />
        </g>
      )}
      {name === 'bag' && (
        <g {...common}>
          <path d="M9 16h30l-2 26H11z" />
          <path d="M17 20v-6a7 7 0 0114 0v6" />
        </g>
      )}
      {name === 'spa' && (
        <g {...common}>
          <path d="M24 38c-10-3-14-12-14-20 8 0 13 5 14 12 1-7 6-12 14-12 0 8-4 17-14 20z" />
          <path d="M24 30v10" />
        </g>
      )}
      {name === 'apple' && (
        <g {...common}>
          <path d="M24 16c-6-5-16-2-16 8 0 8 6 18 12 18 2 0 3-1 4-1s2 1 4 1c6 0 12-10 12-18 0-10-10-13-16-8z" />
          <path d="M24 16c0-4 2-8 6-10" />
        </g>
      )}
      {name === 'grape' && (
        <g {...common}>
          <circle cx="16" cy="22" r="5" /><circle cx="28" cy="22" r="5" /><circle cx="22" cy="31" r="5" /><circle cx="34" cy="31" r="0.1" />
          <circle cx="22" cy="40" r="3" />
          <path d="M22 17c0-5 4-8 9-8" />
        </g>
      )}
      {name === 'golf' && (
        <g {...common}>
          <path d="M18 6v32M18 6l14 5-14 6" />
          <ellipse cx="18" cy="40" rx="12" ry="4" />
          <circle cx="36" cy="34" r="2" />
        </g>
      )}
      {name === 'climb' && (
        <g {...common}>
          <path d="M4 40l12-22 8 12 6-8 14 18z" />
          <circle cx="31" cy="12" r="3" />
        </g>
      )}
      {name === 'horse' && (
        <g {...common}>
          <path d="M10 40V26c0-6 4-10 8-12l6-8 2 6c6 2 10 6 10 14v14" />
          <path d="M18 14l-6 6 6 2" />
          <circle cx="24" cy="16" r="0.8" />
        </g>
      )}
      {name === 'mountain' && (
        <g {...common}>
          <path d="M3 40L18 12l8 14 5-8 14 22z" />
          <path d="M14 19l4 4 4-4" />
        </g>
      )}
      {name === 'bed' && (
        <g {...common}>
          <path d="M6 38V12M6 28h36v10M42 28v-6c0-4-3-6-7-6H20v12" />
          <circle cx="13" cy="22" r="3" />
        </g>
      )}
      {name === 'tent' && (
        <g {...common}>
          <path d="M4 40L24 8l20 32z" />
          <path d="M24 40V24l-7 16M24 24l7 16" />
        </g>
      )}
      {name === 'ring' && (
        <g {...common}>
          <circle cx="24" cy="30" r="11" />
          <path d="M17 12l3-5h8l3 5-7 5z" />
        </g>
      )}
      {name === 'compass' && (
        <g {...common}>
          <circle cx="24" cy="24" r="17" />
          <path d="M31 17l-5 10-10 5 5-10z" />
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
            {t.who && <p className="mt-2 text-xs font-semibold opacity-80">{t.who}</p>}
          </div>
        </a>
      ))}
    </div>
  )
}
