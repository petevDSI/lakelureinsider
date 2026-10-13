'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface NewsTickerItem {
  href: string
  title: string
}

// Rotating "latest news" banner. Renders the first story without JavaScript;
// with JavaScript it cycles through the stories every 7 seconds and pauses on
// hover/focus. Reduced-motion users get the newest story only.
export function NewsTicker({ items }: { items: NewsTickerItem[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (items.length < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 7000)
    return () => window.clearInterval(id)
  }, [items.length, paused])

  if (items.length === 0) return null
  const current = items[index]

  return (
    <div
      className="border-b border-(--sand) bg-(--clay)/10 px-page py-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <span className="shrink-0 rounded bg-(--clay) px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-white">
          Latest
        </span>
        <p className="min-w-0 flex-1 text-sm font-semibold text-(--forest)" aria-live="polite">
          <Link href={current.href} className="line-clamp-2 hover:underline sm:truncate">
            {current.title}
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-3">
          {items.length > 1 && (
            <span className="hidden gap-1 sm:flex" aria-hidden="true">
              {items.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-(--clay)' : 'bg-(--clay)/30'}`}
                />
              ))}
            </span>
          )}
          <Link href="/news" className="text-sm font-semibold text-(--lake) underline-offset-2 hover:underline">
            All news →
          </Link>
        </div>
      </div>
    </div>
  )
}
