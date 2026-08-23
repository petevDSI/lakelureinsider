'use client'

import { useEffect, useState } from 'react'

interface Signer {
  first_name: string
  last_name: string
  city: string
  state: string
  comment: string | null
  created_at: string
}

type Status = 'idle' | 'submitting' | 'success' | 'already' | 'error'

export function PetitionWidget() {
  const [count, setCount] = useState<number | null>(null)
  const [recent, setRecent] = useState<Signer[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [comment, setComment] = useState('')
  const [website, setWebsite] = useState('') // honeypot

  async function loadCount() {
    try {
      const res = await fetch('/api/petition')
      const data = await res.json()
      setCount(data.count)
      setRecent(data.recent ?? [])
    } catch {
      // Leave count as-is; the page still works without it.
    }
  }

  useEffect(() => {
    loadCount()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/petition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, city, state, zip, comment, website }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error ?? 'Something went wrong.')
        return
      }
      if (data.alreadySigned) {
        setStatus('already')
      } else {
        setStatus('success')
      }
      loadCount()
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="not-prose my-10 overflow-hidden rounded-xl border border-[--sand] bg-white">
      <div className="border-b border-[--sand] bg-[--forest] px-6 py-5 text-center">
        <p className="text-3xl font-bold tabular-nums text-white sm:text-4xl">
          {count === null ? '—' : count.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-white/80">
          {count === 1 ? 'signature so far' : 'signatures so far'}
        </p>
      </div>

      {(status === 'success' || status === 'already') ? (
        <div className="px-6 py-8 text-center">
          <p className="font-display text-lg font-bold text-[--forest]">
            {status === 'already' ? "You're already signed — thank you." : 'Thank you for signing.'}
          </p>
          <p className="mt-2 text-sm text-[--ink]/70">
            Share this page with anyone else who cares about keeping Lured Market open.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-3 px-6 py-6">
          {/* Honeypot field — hidden from real visitors via CSS, not `type=hidden`,
              since some bots skip inputs with type=hidden. */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label>
              Leave this field blank
              <input
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-[--ink]">
              First name *
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-md border border-[--sand] px-3 py-2 text-sm"
                placeholder="Jane"
              />
            </label>
            <label className="text-sm font-medium text-[--ink]">
              Last name *
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-md border border-[--sand] px-3 py-2 text-sm"
                placeholder="Smith"
              />
            </label>
          </div>

          <label className="text-sm font-medium text-[--ink]">
            Email *
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-[--sand] px-3 py-2 text-sm"
              placeholder="jane@example.com"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
            <label className="text-sm font-medium text-[--ink]">
              City *
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-md border border-[--sand] px-3 py-2 text-sm"
                placeholder="Lake Lure"
              />
            </label>
            <label className="text-sm font-medium text-[--ink]">
              State *
              <input
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 w-full rounded-md border border-[--sand] px-3 py-2 text-sm"
                placeholder="NC"
                maxLength={2}
              />
            </label>
            <label className="text-sm font-medium text-[--ink]">
              ZIP *
              <input
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="mt-1 w-full rounded-md border border-[--sand] px-3 py-2 text-sm"
                placeholder="28746"
                inputMode="numeric"
                maxLength={10}
              />
            </label>
          </div>

          <label className="text-sm font-medium text-[--ink]">
            Why does this matter to you? (optional, may be shown publicly)
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              className="mt-1 w-full rounded-md border border-[--sand] px-3 py-2 text-sm"
            />
          </label>

          {status === 'error' && (
            <p className="text-sm font-medium text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-1 rounded-md bg-[--clay] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === 'submitting' ? 'Signing…' : 'Sign the Petition'}
          </button>

          <p className="text-[10px] leading-relaxed text-[--ink]/50">
            Your name and city/state may be shown publicly on this page. Your email address and
            ZIP code are never shown or shared — see our{' '}
            <a href="/privacy" className="underline">
              privacy policy
            </a>
            .
          </p>
        </form>
      )}

      {recent.length > 0 && (
        <div className="border-t border-[--sand] px-6 py-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[--lake]">
            Recent signatures
          </p>
          <ul className="space-y-3">
            {recent.map((s, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold text-[--forest]">
                  {s.first_name} {s.last_name.charAt(0)}.
                </span>
                <span className="text-[--ink]/60"> — {s.city}, {s.state}</span>
                {s.comment && <p className="mt-0.5 text-[--ink]/70">&ldquo;{s.comment}&rdquo;</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
