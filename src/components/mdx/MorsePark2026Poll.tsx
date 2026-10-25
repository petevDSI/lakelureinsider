'use client'

import { useEffect, useState } from 'react'

/**
 * Reader poll for the Morse Park concepts article.
 *
 * Storage: park_poll_options / park_poll_votes in the records Supabase project,
 * reached only through the park_poll_results() and park_poll_vote() RPCs with the
 * public publishable key (same pattern as EdmundHitCounter). Both tables have RLS
 * on with no policies, so the RPCs are the only way in. One vote per browser,
 * tracked by a random token in localStorage. Unscientific by design.
 */
const BASE = 'https://krnxfqnniqbtlwczhuru.supabase.co'
const KEY = 'sb_publishable_dxlMjRBN26bOTgEfUkO4gA_t3sovmjP'
const POLL = 'morse-park-2026'
const TOKEN_KEY = 'morse-park-2026-token'
const VOTED_KEY = 'morse-park-2026-voted'

interface Row {
  option_id: string
  label: string
  votes: number
}

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }

async function rpc<T>(fn: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}/rest/v1/rpc/${fn}`, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  return r.json()
}

function safeGet(k: string): string | null {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
function safeSet(k: string, v: string) {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* storage blocked: poll still works for this page view */
  }
}

function getToken(): string {
  let t = safeGet(TOKEN_KEY)
  if (!t || t.length < 16) {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    t = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    safeSet(TOKEN_KEY, t)
  }
  return t
}

export function MorsePark2026Poll() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [choice, setChoice] = useState<string>('')
  const [voted, setVoted] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let live = true
    rpc<Row[]>('park_poll_results', { p_poll: POLL })
      .then((r) => live && setRows(r))
      .catch(() => live && setError('The poll is unavailable right now. Please try again later.'))
    const prior = safeGet(VOTED_KEY)
    if (prior) setVoted(prior)
    return () => {
      live = false
    }
  }, [])

  async function submit() {
    if (!choice) return
    setBusy(true)
    setError('')
    try {
      const recorded = await rpc<string>('park_poll_vote', { p_poll: POLL, p_option: choice, p_token: getToken() })
      safeSet(VOTED_KEY, recorded)
      setVoted(recorded)
      setRows(await rpc<Row[]>('park_poll_results', { p_poll: POLL }))
    } catch {
      setError('Your vote could not be recorded. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const total = rows?.reduce((s, r) => s + r.votes, 0) ?? 0
  const showResults = voted !== null && rows !== null

  return (
    <section
      className="not-prose my-10 rounded-xl border border-(--sand) bg-white p-5 sm:p-7"
      aria-labelledby="morse-poll-title"
    >
      <h3 id="morse-poll-title" className="font-display text-xl font-bold text-(--forest)">
        Reader poll: Which concept comes closest to the park you would like to see?
      </h3>
      <p className="mt-1 text-sm text-(--ink)/70">
        One vote per browser. Results appear after you vote. This is an unscientific reader poll, not a Town survey.
      </p>

      {!showResults && rows && (
        <form
          className="mt-4 space-y-2"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          {rows.map((r) => (
            <label
              key={r.option_id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-(--sand) px-3 py-2 text-sm hover:bg-(--paper)"
            >
              <input
                type="radio"
                name="morse-poll"
                value={r.option_id}
                checked={choice === r.option_id}
                onChange={() => setChoice(r.option_id)}
              />
              <span>{r.label}</span>
            </label>
          ))}
          <button
            type="submit"
            disabled={!choice || busy}
            className="mt-3 rounded-lg bg-(--forest) px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? 'Recording…' : 'Vote and see results'}
          </button>
        </form>
      )}

      {showResults && (
        <div className="mt-4 space-y-3" aria-live="polite">
          {[...rows].sort((a, b) => b.votes - a.votes).map((r) => {
            const pct = total ? Math.round((r.votes / total) * 100) : 0
            return (
              <div key={r.option_id}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className={r.option_id === voted ? 'font-semibold' : ''}>
                    {r.label}
                    {r.option_id === voted ? ' (your vote)' : ''}
                  </span>
                  <span className="tabular-nums text-(--ink)/70">
                    {r.votes} · {pct}%
                  </span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-(--sand)">
                  <div className="h-full rounded-full bg-(--lake)" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
          <p className="text-xs text-(--ink)/60">
            {total} {total === 1 ? 'vote' : 'votes'} so far. Percentages are rounded and may not sum to 100.
          </p>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </section>
  )
}
