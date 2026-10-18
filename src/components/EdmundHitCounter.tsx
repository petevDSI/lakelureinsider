'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Old-school page hit counter for /edmund.
 *
 * Storage: public.site_counters row 'edmund_page' in the records Supabase project,
 * reached only through the edmund_counter() RPC with the public publishable key
 * (same pattern as the records search). The table itself has RLS on with no
 * policies, so the RPC is the only way in.
 *
 * A browser counts once per 12 hours (localStorage); repeat loads just read the
 * total. If the request fails or storage is blocked, the counter quietly hides.
 */
const BASE = 'https://krnxfqnniqbtlwczhuru.supabase.co'
const KEY = 'sb_publishable_dxlMjRBN26bOTgEfUkO4gA_t3sovmjP'
const STORAGE_KEY = 'edmund-counted-at'
const WINDOW_MS = 12 * 60 * 60 * 1000
const DIGITS = 7

const LINES = [
  'He has not noticed any of you.',
  "Edmund's team has been notified. Edmund's team is a goat.",
  'Every look is recorded in an official ledger made of kudzu.',
  'Edmund reviewed these numbers and ate the spreadsheet.',
  'Please keep looking. He needs the validation.',
  'That is a lot of people staring at one goat.',
  'Not a poll. Not an election. Goats cannot vote. Edmund asked anyway.',
  'Best viewed in Netscape Navigator 4.0 with a goat nearby.',
]

async function callCounter(countVisit: boolean): Promise<number> {
  const r = await fetch(`${BASE}/rest/v1/rpc/edmund_counter`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_count_visit: countVisit }),
  })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  const n = Number(await r.json())
  if (!Number.isFinite(n) || n < 0) throw new Error('bad count')
  return n
}

function shouldCountVisit(): boolean {
  try {
    const last = Number(localStorage.getItem(STORAGE_KEY) ?? 0)
    return !last || Date.now() - last > WINDOW_MS
  } catch {
    // Storage blocked: read only, so a reload loop can't inflate the number.
    return false
  }
}

function markCounted() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    /* ignore */
  }
}

const CSS = `
.edc { padding-block: 2.5rem 3.5rem; border-top: 3px solid var(--ink); background: var(--paper-2); text-align: center; }
.edc-box {
  display: inline-block; max-width: 100%; padding: 1rem 1.25rem 1.1rem;
  background: var(--paper); border: 3px solid var(--ink); box-shadow: 5px 5px 0 var(--ink);
}
.edc-kicker { font-family: var(--type); font-size: .8rem; letter-spacing: .14em; text-transform: uppercase; margin: 0 0 .6rem; }
.edc-kicker .new {
  display: inline-block; margin-left: .5rem; padding: 0 .35rem; background: var(--red); color: #fff5e6;
  font-family: var(--display); letter-spacing: .04em; transform: rotate(-4deg);
  animation: edc-blink 1.1s steps(1, end) infinite;
}
@keyframes edc-blink { 50% { opacity: .15; } }
.edc-digits {
  display: inline-flex; gap: 3px; padding: 5px; background: #000; border: 3px solid var(--ink);
  box-shadow: inset 0 0 0 2px #3a342b;
}
.edc-d {
  position: relative; width: clamp(1.7rem, 7.5vw, 2.6rem); padding-block: .3rem;
  font-family: var(--display); font-size: clamp(1.5rem, 6.5vw, 2.3rem); line-height: 1.1;
  color: #f3e9d2; background: linear-gradient(#242019 0 49%, #0d0b08 51% 100%);
  font-variant-numeric: tabular-nums;
}
.edc-d::after { content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: #000; opacity: .85; }
.edc-sub { font-family: var(--type); font-size: .95rem; margin: .6rem 0 0; }
.edc-line { font-family: var(--type); font-size: .95rem; max-width: 30rem; margin: 1.1rem auto 0; color: var(--ink-soft); text-wrap: balance; }
.edc-fine { font-family: var(--type); font-size: .72rem; max-width: 30rem; margin: .9rem auto 0; color: var(--ink-soft); opacity: .85; }
@media (prefers-reduced-motion: reduce) { .edc-kicker .new { animation: none; } }
`

export function EdmundHitCounter() {
  const [target, setTarget] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const raf = useRef(0)

  // Fetch (and maybe count) once per page load.
  useEffect(() => {
    let alive = true
    const count = shouldCountVisit()
    callCounter(count)
      .then((n) => {
        if (!alive) return
        if (count) markCounted()
        setTarget(n)
      })
      .catch(() => {
        /* leave hidden */
      })
    return () => {
      alive = false
    }
  }, [])

  // Roll the digits up like an odometer. Reduced motion (or a tiny count) jumps
  // straight to the total on the first frame.
  useEffect(() => {
    if (target === null) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reduce || target < 2 ? 0 : 1100
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = dur === 0 ? 1 : Math.min(1, (now - start) / dur)
      setProgress(1 - Math.pow(1 - t, 3))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target])

  if (target === null) return null

  const shown = Math.round(target * progress)
  const text = String(Math.min(shown, 10 ** DIGITS - 1)).padStart(DIGITS, '0')
  const line = LINES[target % LINES.length]

  return (
    <section className="edc" aria-labelledby="edc-h">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ed-wrap">
        <div className="edc-box">
          <p className="edc-kicker" id="edc-h">
            Edmund has been looked at<span className="new" aria-hidden="true">NEW!</span>
          </p>
          <div className="edc-digits" role="img" aria-label={`${target.toLocaleString('en-US')} times`}>
            {text.split('').map((d, i) => (
              <span className="edc-d" aria-hidden="true" key={i}>
                {d}
              </span>
            ))}
          </div>
          <p className="edc-sub">times. Thank you for visiting.</p>
        </div>
        <p className="edc-line">{line}</p>
        <p className="edc-fine">
          Edmund is not on any ballot. This is a hit counter, not a poll. Each browser is counted once every 12 hours.
        </p>
      </div>
    </section>
  )
}
