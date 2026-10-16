'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Public search of the Lake Lure records archive (town minutes, agendas, packets).
 * Data lives in the Lake Lure Insider records Supabase project; this component only
 * ever uses the public publishable key and read-only RPC functions.
 */
const BASE = 'https://krnxfqnniqbtlwczhuru.supabase.co'
const KEY = 'sb_publishable_dxlMjRBN26bOTgEfUkO4gA_t3sovmjP'
const PAGE = 25
const LIB = 40

const TYPES: Record<string, string> = {
  minutes: 'Minutes',
  packet: 'Meeting packet',
  agenda: 'Agenda',
  press_release: 'Press release',
  audit: 'Audit',
  ordinance: 'Ordinance',
  resolution: 'Resolution',
  legal: 'Legal document',
  other: 'Other',
}

interface Hit {
  document_id: number
  title: string
  doc_type: string
  meeting_date: string | null
  page_number: number
  snippet: string
  storage_path: string | null
  source_url: string | null
  total: number
}

interface LibDoc {
  id: number
  title: string
  doc_type: string
  meeting_date: string | null
  page_count: number | null
  storage_path: string | null
}

interface Form {
  q: string
  a_all: string
  a_phrase: string
  a_any: string
  a_none: string
  a_na: string
  a_nb: string
  a_nn: string
  type: string
  board: string
  from: string
  to: string
  sort: string
  once: boolean
}

const EMPTY: Form = {
  q: '', a_all: '', a_phrase: '', a_any: '', a_none: '', a_na: '', a_nb: '', a_nn: '5',
  type: '', board: '', from: '', to: '', sort: 'best', once: false,
}

const EXAMPLES = [
  'Pritchett',
  'dam spillway',
  'Morse Park',
  'insurance payment',
  '"public comment"',
  '"boat slip" or "boat dock" -fee',
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function fmtDate(d: string | null) {
  if (!d) return 'Undated'
  const p = d.split('-')
  return `${MONTHS[+p[1] - 1]} ${+p[2]}, ${p[0]}`
}
function pdfUrl(path: string, page?: number) {
  return `${BASE}/storage/v1/object/public/lakelure-docs/${encodeURI(path)}${page ? `#page=${page}` : ''}`
}
async function api<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(BASE + path, {
    method: body ? 'POST' : 'GET',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  return r.json()
}

/** Turn a snippet from the database (with <mark> tags) into safe React nodes. */
function Snippet({ html }: { html: string }) {
  const parts = html.split(/<mark>([\s\S]*?)<\/mark>/)
  return (
    <>
      …
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-yellow-200 px-0.5 text-(--ink)">{p}</mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
      …
    </>
  )
}

const inputCls =
  'w-full rounded-md border-[1.5px] border-(--sand) bg-white px-3 py-2.5 text-(--ink) placeholder:text-(--ink)/40 focus:border-(--lake) focus:outline-none focus:ring-2 focus:ring-(--lake)/30'
const labelCls = 'flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-(--ink)/60'

export function RecordsSearch() {
  const [tab, setTab] = useState<'simple' | 'adv'>('simple')
  const [f, setF] = useState<Form>(EMPTY)
  const [boards, setBoards] = useState<string[]>([])
  const [hits, setHits] = useState<Hit[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')
  const [reads, setReads] = useState('')
  const [searched, setSearched] = useState(false)
  const [emptyResult, setEmptyResult] = useState(false)
  const seq = useRef(0)
  const offset = useRef(0)

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((s) => ({ ...s, [k]: v }))

  const terms = useCallback((form: Form, t: 'simple' | 'adv') => {
    const tr = (s: string) => s.trim() || null
    if (t === 'simple') return { p_all: tr(form.q) }
    const near = form.a_na.trim() && form.a_nb.trim()
    return {
      p_all: tr(form.a_all),
      p_phrase: tr(form.a_phrase),
      p_any: tr(form.a_any),
      p_none: tr(form.a_none),
      p_near_a: near ? form.a_na.trim() : null,
      p_near_b: near ? form.a_nb.trim() : null,
      p_near_n: parseInt(form.a_nn, 10) || 5,
    }
  }, [])

  const describe = useCallback((form: Form, t: 'simple' | 'adv') => {
    const x = terms(form, t) as Record<string, string | number | null>
    const parts: string[] = []
    if (t === 'simple') {
      if (x.p_all) parts.push(`matching ${x.p_all}`)
    } else {
      if (x.p_all) parts.push(`all of: ${String(x.p_all).split(/\s+/).join(', ')}`)
      if (x.p_phrase) parts.push(`the exact phrase “${x.p_phrase}”`)
      if (x.p_any) parts.push(`any of: ${String(x.p_any).split(/\s*,\s*/).filter(Boolean).join(' or ')}`)
      if (x.p_near_a) parts.push(`${x.p_near_a} within ${x.p_near_n} words of ${x.p_near_b}`)
    }
    let out = 'Showing pages ' + parts.join(', and ')
    if (x.p_none) out += `, but not pages mentioning ${String(x.p_none).split(/\s*,\s*/).filter(Boolean).join(' or ')}`
    const lim: string[] = []
    if (form.type) lim.push((TYPES[form.type] || form.type).toLowerCase())
    if (form.board) lim.push('board: ' + form.board)
    if (form.from || form.to) lim.push(`dated ${form.from ? 'from ' + fmtDate(form.from) + ' ' : ''}${form.to ? 'to ' + fmtDate(form.to) : ''}`.trim())
    if (lim.length) out += ' · limited to ' + lim.join(', ')
    return out + '.'
  }, [terms])

  const run = useCallback(
    async (reset: boolean, form: Form, t: 'simple' | 'adv') => {
      const x = terms(form, t) as Record<string, string | number | null>
      if (!(x.p_all || x.p_phrase || x.p_any || x.p_near_a)) {
        setStatus(
          t === 'simple'
            ? 'Enter a word, name or phrase to search.'
            : 'Fill in at least one of the search fields (words, phrase, any-of, or near).',
        )
        return
      }
      const mine = ++seq.current
      if (reset) {
        offset.current = 0
        setHits([])
        setEmptyResult(false)
        try {
          const u = new URLSearchParams({ tab: t })
          Object.entries(form).forEach(([k, v]) => {
            if (v === '' || v === false) return
            if ((k === 'sort' && v === 'best') || (k === 'a_nn' && v === '5')) return
            u.set(k, v === true ? '1' : String(v))
          })
          history.replaceState(null, '', '#' + u.toString())
        } catch {}
      }
      setSearched(true)
      setStatus('Searching…')
      setReads(describe(form, t))
      try {
        const rows = await api<Hit[]>('/rest/v1/rpc/search_advanced', {
          ...x,
          p_board: form.board || null,
          p_doc_type: form.type || null,
          p_from: form.from || null,
          p_to: form.to || null,
          p_one_per_doc: form.once,
          p_sort: form.sort,
          p_limit: PAGE,
          p_offset: offset.current,
        })
        if (mine !== seq.current) return
        if (reset && !rows.length) {
          setEmptyResult(true)
          setTotal(0)
          setStatus('0 results')
          return
        }
        offset.current += rows.length
        setHits((h) => (reset ? rows : [...h, ...rows]))
        const tot = rows.length ? Number(rows[0].total) : total
        setTotal(tot)
        const unit = form.once ? 'document' : 'page'
        const order = { best: 'best matches first', newest: 'newest first', oldest: 'oldest first' }[form.sort]
        setStatus(`${tot.toLocaleString()} matching ${unit}${tot === 1 ? '' : 's'} · showing ${offset.current.toLocaleString()}, ${order}`)
      } catch {
        if (mine !== seq.current) return
        setStatus('Search is unavailable right now. Please try again in a moment.')
      }
    },
    [terms, describe, total],
  )

  // Load board list, then restore a shared search link (#tab=adv&a_all=dam…).
  useEffect(() => {
    let alive = true
    api<string[]>('/rest/v1/rpc/list_boards', {})
      .then((b) => alive && setBoards(b || []))
      .catch(() => {})
      .then(() => {
        if (!alive) return
        const u = new URLSearchParams(window.location.hash.slice(1))
        if (!u.has('tab')) return
        const next: Form = { ...EMPTY }
        ;(Object.keys(EMPTY) as (keyof Form)[]).forEach((k) => {
          if (k === 'once') next.once = u.get('once') === '1'
          else if (u.has(k)) (next as unknown as Record<string, string>)[k] = u.get(k) as string
        })
        const t = u.get('tab') === 'adv' ? 'adv' : 'simple'
        setF(next)
        setTab(t)
        void run(true, next, t)
      })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const change = <K extends keyof Form>(k: K, v: Form[K]) => {
    const next = { ...f, [k]: v }
    setF(next)
    const x = terms(next, tab) as Record<string, unknown>
    if (x.p_all || x.p_phrase || x.p_any || x.p_near_a) void run(true, next, tab)
  }

  return (
    <div>
      {/* Mode tabs */}
      <div role="tablist" aria-label="Search mode" className="mb-4 flex gap-1 border-b-[1.5px] border-(--sand)">
        {(['simple', 'adv'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            tabIndex={tab === t ? 0 : -1}
            onClick={() => setTab(t)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const n = tab === 'simple' ? 'adv' : 'simple'
                setTab(n)
                document.getElementById(`tab-${n}`)?.focus()
              }
            }}
            className={`-mb-[1.5px] rounded-t-lg border-[1.5px] border-b-0 px-5 py-2.5 text-sm font-semibold transition-colors ${
              tab === t
                ? 'border-(--sand) bg-white text-(--lake)'
                : 'border-transparent text-(--ink)/60 hover:text-(--forest)'
            }`}
          >
            {t === 'simple' ? 'Simple search' : 'Advanced search'}
          </button>
        ))}
      </div>

      <form
        role="search"
        onSubmit={(e) => { e.preventDefault(); void run(true, f, tab) }}
      >
        {tab === 'simple' ? (
          <div id="panel-simple" role="tabpanel" aria-labelledby="tab-simple">
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <input
                type="search"
                value={f.q}
                onChange={(e) => set('q', e.target.value)}
                placeholder={'Try: Pritchett, dam spillway, "town hall" -lease'}
                aria-label="Search records"
                autoComplete="off"
                className={inputCls + ' text-base sm:flex-1 sm:text-lg'}
              />
              <button type="submit" className="rounded-md bg-(--lake) px-6 py-3 font-semibold text-white hover:brightness-110">
                Search
              </button>
            </div>
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-sm text-(--ink)/60">
              <span>Examples:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => {
                    const next = { ...f, q: ex }
                    setF(next)
                    void run(true, next, 'simple')
                  }}
                  className="rounded-full border border-(--sand) bg-white px-3 py-1 text-sm hover:border-(--lake) hover:text-(--lake)"
                >
                  {ex.replace(/"/g, '')}
                </button>
              ))}
            </div>
            <details className="mt-3.5 text-sm text-(--ink)/70">
              <summary className="cursor-pointer font-semibold text-(--lake)">Search tips</summary>
              <table className="mt-2 w-full max-w-xl rounded-lg border border-(--sand) bg-white text-[13.5px]">
                <tbody>
                  {[
                    ['dam spillway', 'pages that contain both words (AND)'],
                    ['"town hall"', 'the exact phrase'],
                    ['mayor or manager', 'either word (OR)'],
                    ['lease -airbnb', 'lease, but not pages that mention airbnb (NOT)'],
                    ['"boat dock" or "boat slip" -fee', 'combine them freely'],
                  ].map(([c, d]) => (
                    <tr key={c} className="border-b border-(--sand) last:border-0">
                      <td className="px-3 py-2"><code className="rounded bg-(--paper) px-1.5 py-0.5 font-mono text-(--ink)">{c}</code></td>
                      <td className="px-3 py-2">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2">
                Searching is not case sensitive. Word endings are matched, so “lease” also finds “leases” and “leasing”.
                For more control, use the Advanced search tab.
              </p>
            </details>
          </div>
        ) : (
          <div id="panel-adv" role="tabpanel" aria-labelledby="tab-adv" className="grid gap-4 rounded-lg border border-(--sand) bg-white p-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">All of these words <b className="ml-1 font-mono text-[11px] tracking-wider text-(--lake)">AND</b></span>
              <input className={inputCls} value={f.a_all} onChange={(e) => set('a_all', e.target.value)} placeholder="dam spillway" autoComplete="off" />
              <small className="text-xs text-(--ink)/60">Every word must appear on the page.</small>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">This exact phrase</span>
              <input className={inputCls} value={f.a_phrase} onChange={(e) => set('a_phrase', e.target.value)} placeholder="boat slip" autoComplete="off" />
              <small className="text-xs text-(--ink)/60">The words together, in this order.</small>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Any of these <b className="ml-1 font-mono text-[11px] tracking-wider text-(--lake)">OR</b></span>
              <input className={inputCls} value={f.a_any} onChange={(e) => set('a_any', e.target.value)} placeholder="Pritchett, Perkins, Bowers" autoComplete="off" />
              <small className="text-xs text-(--ink)/60">Separate options with commas. Use quotes inside for a phrase.</small>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">None of these <b className="ml-1 font-mono text-[11px] tracking-wider text-(--lake)">NOT</b></span>
              <input className={inputCls} value={f.a_none} onChange={(e) => set('a_none', e.target.value)} placeholder="airbnb, rental" autoComplete="off" />
              <small className="text-xs text-(--ink)/60">Leave out pages that mention these. Separate with commas.</small>
            </label>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-semibold">Words near each other</span>
              <div className="flex flex-wrap items-center gap-2">
                <input className={inputCls + ' min-w-32 flex-1'} value={f.a_na} onChange={(e) => set('a_na', e.target.value)} placeholder="mayor" aria-label="First word" autoComplete="off" />
                <span>within</span>
                <input type="number" min={1} max={10} className={inputCls + ' w-16'} value={f.a_nn} onChange={(e) => set('a_nn', e.target.value)} aria-label="Number of words apart" />
                <span>words of</span>
                <input className={inputCls + ' min-w-32 flex-1'} value={f.a_nb} onChange={(e) => set('a_nb', e.target.value)} placeholder="Pritchett" aria-label="Second word" autoComplete="off" />
              </div>
              <small className="text-xs text-(--ink)/60">In either order. Good for tying a person to a topic, such as a name near “dam”.</small>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <button type="submit" className="rounded-md bg-(--lake) px-6 py-3 font-semibold text-white hover:brightness-110">Search</button>
              <button
                type="button"
                className="px-1 py-1.5 text-(--lake) underline"
                onClick={() => setF((s) => ({ ...s, a_all: '', a_phrase: '', a_any: '', a_none: '', a_na: '', a_nb: '', a_nn: '5' }))}
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-(--sand) bg-white p-4">
          <h2 className="mb-2.5 font-mono text-xs font-medium uppercase tracking-wider text-(--ink)/60">Narrow and arrange</h2>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <label className={labelCls}>
              Document type
              <select className={inputCls + ' !w-auto'} value={f.type} onChange={(e) => change('type', e.target.value)}>
                <option value="">All types</option>
                {['minutes', 'packet', 'agenda', 'press_release', 'audit', 'ordinance', 'resolution', 'legal', 'other'].map((k) => (
                  <option key={k} value={k}>{TYPES[k]}</option>
                ))}
              </select>
            </label>
            <label className={labelCls}>
              Board or body
              <select className={inputCls + ' !w-auto'} value={f.board} onChange={(e) => change('board', e.target.value)}>
                <option value="">All boards</option>
                {boards.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label className={labelCls}>
              From
              <input type="date" className={inputCls + ' !w-auto'} value={f.from} onChange={(e) => change('from', e.target.value)} />
            </label>
            <label className={labelCls}>
              To
              <input type="date" className={inputCls + ' !w-auto'} value={f.to} onChange={(e) => change('to', e.target.value)} />
            </label>
            <label className={labelCls}>
              Sort by
              <select className={inputCls + ' !w-auto'} value={f.sort} onChange={(e) => change('sort', e.target.value)}>
                <option value="best">Best match</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.once} onChange={(e) => change('once', e.target.checked)} />
            Show each document once, using its best page
          </label>
        </div>
      </form>

      {reads && searched && (
        <p className="mt-5 rounded-r-md border-l-[3px] border-(--lake) bg-white px-3.5 py-2.5 text-sm">{reads}</p>
      )}

      <p role="status" aria-live="polite" className="mb-2.5 mt-6 font-mono text-[13px] text-(--ink)/60">{status}</p>

      <ol className="flex list-none flex-col gap-3 p-0">
        {emptyResult && (
          <li className="rounded-lg border border-dashed border-(--sand) bg-white p-5 text-(--ink)/70">
            No pages matched. Try fewer or simpler words, check the spelling, loosen the “near” distance, or clear the filters under “Narrow and arrange”.
          </li>
        )}
        {hits.map((h, i) => {
          const url = h.storage_path ? pdfUrl(h.storage_path, h.page_number) : h.source_url || '#'
          return (
            <li key={`${h.document_id}-${h.page_number}-${i}`} className="rounded-lg border border-(--sand) bg-white px-4 py-4 transition-colors hover:border-(--lake) sm:px-5">
              <h3 className="font-display text-lg font-semibold leading-snug">
                <a href={url} target="_blank" rel="noopener" className="text-(--forest) hover:text-(--lake) hover:underline">{h.title}</a>
              </h3>
              <div className="mb-2.5 mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12.5px] text-(--ink)/60">
                <span>{fmtDate(h.meeting_date)}</span>
                <span>{TYPES[h.doc_type] || h.doc_type}</span>
                <span>Page {h.page_number}</span>
              </div>
              <p className="break-words text-(--ink)"><Snippet html={h.snippet} /></p>
              <a href={url} target="_blank" rel="noopener" className="mt-2.5 inline-block text-sm font-semibold text-(--lake)">
                Open original PDF at page {h.page_number} →
              </a>
            </li>
          )
        })}
      </ol>
      {hits.length > 0 && hits.length < total && (
        <button
          type="button"
          onClick={() => void run(false, f, tab)}
          className="mx-auto mt-5 block rounded-md border-[1.5px] border-(--lake) px-6 py-2.5 font-semibold text-(--lake) hover:bg-(--lake)/5"
        >
          Show more results
        </button>
      )}

      <Library />
    </div>
  )
}

function Library() {
  const [docs, setDocs] = useState<LibDoc[]>([])
  const [total, setTotal] = useState(0)
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(true)
  const offset = useRef(0)
  const started = useRef(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(
        `${BASE}/rest/v1/documents?select=id,title,doc_type,meeting_date,page_count,storage_path&order=meeting_date.desc.nullslast,id.desc`,
        { headers: { apikey: KEY, Prefer: 'count=exact', Range: `${offset.current}-${offset.current + LIB - 1}` } },
      )
      const cr = r.headers.get('content-range')
      if (cr && cr.includes('/')) setTotal(+cr.split('/')[1] || 0)
      const rows: LibDoc[] = await r.json()
      offset.current += rows.length
      setDocs((d) => [...d, ...rows])
    } catch {
      setErr(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (started.current) return
    started.current = true
    void load()
  }, [load])

  return (
    <section className="mt-12" aria-labelledby="lib-h">
      <h2 id="lib-h" className="mb-3 font-display text-xl font-bold text-(--forest)">Document library</h2>
      <div className="overflow-x-auto rounded-lg border border-(--sand) bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-(--sand) text-left font-mono text-xs uppercase tracking-wider text-(--ink)/60">
              <th className="whitespace-nowrap px-3.5 py-2.5 font-medium">Document</th>
              <th className="whitespace-nowrap px-3.5 py-2.5 font-medium">Type</th>
              <th className="whitespace-nowrap px-3.5 py-2.5 font-medium">Meeting date</th>
              <th className="px-3.5 py-2.5 text-right font-medium">Pages</th>
            </tr>
          </thead>
          <tbody>
            {err && <tr><td colSpan={4} className="px-3.5 py-3">The document list could not be loaded.</td></tr>}
            {!err && !docs.length && loading && <tr><td colSpan={4} className="px-3.5 py-3">Loading…</td></tr>}
            {docs.map((d) => (
              <tr key={d.id} className="border-b border-(--sand) align-top last:border-0">
                <td className="px-3.5 py-2.5">
                  {d.storage_path ? (
                    <a href={pdfUrl(d.storage_path)} target="_blank" rel="noopener" className="font-medium text-(--lake) hover:underline">{d.title}</a>
                  ) : d.title}
                </td>
                <td className="px-3.5 py-2.5">{TYPES[d.doc_type] || d.doc_type}</td>
                <td className="whitespace-nowrap px-3.5 py-2.5">{fmtDate(d.meeting_date)}</td>
                <td className="px-3.5 py-2.5 text-right tabular-nums">{d.page_count ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <p className="mt-2.5 text-sm text-(--ink)/60">
          Showing {docs.length.toLocaleString()} of {total.toLocaleString()} documents, newest first.
        </p>
      )}
      {docs.length < total && (
        <button
          type="button"
          disabled={loading}
          onClick={() => void load()}
          className="mx-auto mt-4 block rounded-md border-[1.5px] border-(--lake) px-6 py-2.5 font-semibold text-(--lake) hover:bg-(--lake)/5 disabled:opacity-50"
        >
          Show more documents
        </button>
      )}
    </section>
  )
}
