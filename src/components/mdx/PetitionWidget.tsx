'use client'

import { useEffect, useState } from 'react'
import { SITE_URL } from '@/lib/site-config'

const PETITION_URL = `${SITE_URL}/petition`
const SHARE_TEXT =
  "I just signed the petition to save Lured Market in Lake Lure, NC. Join me:"

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
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    // Deferred to an effect (rather than a lazy useState initializer) on purpose:
    // this value must be false on the server-rendered HTML to match hydration,
    // then flip true post-mount once `navigator` is available client-side.
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true)
    }
  }, [])

  async function handleNativeShare() {
    try {
      await navigator.share({ title: 'Save Lured Market', text: SHARE_TEXT, url: PETITION_URL })
    } catch {
      // User canceled the share sheet — nothing to do.
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(PETITION_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — the link buttons below still work.
    }
  }

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
    <div className="not-prose my-10 overflow-hidden rounded-xl border border-(--sand) bg-white">
      <div className="border-b border-(--sand) bg-(--forest) px-6 py-5 text-center">
        <p className="text-3xl font-bold tabular-nums text-white sm:text-4xl">
          {count === null ? '—' : count.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-white/80">
          {count === 1 ? 'signature so far' : 'signatures so far'}
        </p>
      </div>

      {(status === 'success' || status === 'already') ? (
        <div className="px-6 py-8 text-center">
          <p className="font-display text-lg font-bold text-(--forest)">
            {status === 'already' ? "You're already signed — thank you." : 'Thank you for signing.'}
          </p>
          <p className="mt-2 text-sm text-(--ink)/70">
            Share this page with anyone else who cares about keeping Lured Market open.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(PETITION_URL)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-(--forest) text-white transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.35C16.3 4.24 15.28 4.15 14.1 4.15c-2.46 0-4.15 1.5-4.15 4.26V10.5H7.45v3H9.95V21h3.55Z" />
              </svg>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(PETITION_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-(--ink) text-white transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M18.3 3h3l-6.6 7.55L22.5 21h-6.1l-4.8-6.3L5.9 21H2.9l7.05-8.07L2 3h6.25l4.35 5.76L18.3 3Zm-1.05 16.2h1.66L7.85 4.7H6.07l11.18 14.5Z" />
              </svg>
            </a>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${SHARE_TEXT} ${PETITION_URL}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-(--lake) text-white transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12.04 2.5c-5.26 0-9.54 4.27-9.54 9.54 0 1.68.44 3.31 1.28 4.75L2.5 21.5l4.86-1.27a9.5 9.5 0 0 0 4.68 1.24h.01c5.26 0 9.54-4.27 9.54-9.54s-4.28-9.43-9.55-9.43Zm5.6 13.47c-.24.66-1.38 1.26-1.9 1.33-.5.08-1.1.11-1.78-.11-.41-.13-.94-.3-1.62-.6-2.84-1.23-4.7-4.1-4.84-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.53-.34.7-.34l.5.01c.16 0 .38-.06.6.46.24.58.8 2 .87 2.15.07.14.12.31.02.5-.1.19-.15.31-.29.47-.14.17-.3.37-.43.5-.14.14-.29.29-.13.58.17.29.75 1.24 1.62 2.01 1.11.99 2.04 1.3 2.34 1.44.3.14.47.12.65-.07.17-.19.73-.85.93-1.14.19-.29.39-.24.65-.14.27.1 1.68.79 1.97.94.28.14.47.21.54.33.07.12.07.68-.17 1.33Z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy petition link"
              className="flex h-11 items-center gap-1.5 rounded-full border border-(--sand) px-4 text-sm font-semibold text-(--forest) transition-colors hover:bg-(--sand)/40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden="true">
                <path d="M9 12a4 4 0 0 0 5.66 0l2.83-2.83a4 4 0 1 0-5.66-5.66L10.5 4.85" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12a4 4 0 0 0-5.66 0l-2.83 2.83a4 4 0 1 0 5.66 5.66l1.32-1.32" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {copied ? 'Copied!' : 'Copy link'}
            </button>

            {canNativeShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex h-11 items-center gap-1.5 rounded-full bg-(--clay) px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                More options…
              </button>
            )}
          </div>
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
            <label className="text-sm font-medium text-(--ink)">
              First name *
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm"
                placeholder="Jane"
              />
            </label>
            <label className="text-sm font-medium text-(--ink)">
              Last name *
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm"
                placeholder="Smith"
              />
            </label>
          </div>

          <label className="text-sm font-medium text-(--ink)">
            Email *
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm"
              placeholder="jane@example.com"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
            <label className="text-sm font-medium text-(--ink)">
              City *
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm"
                placeholder="Lake Lure"
              />
            </label>
            <label className="text-sm font-medium text-(--ink)">
              State *
              <input
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm"
                placeholder="NC"
                maxLength={2}
              />
            </label>
            <label className="text-sm font-medium text-(--ink)">
              ZIP *
              <input
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm"
                placeholder="28746"
                inputMode="numeric"
                maxLength={10}
              />
            </label>
          </div>

          <label className="text-sm font-medium text-(--ink)">
            Why does this matter to you? (optional, may be shown publicly)
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm"
            />
          </label>

          {status === 'error' && (
            <p className="text-sm font-medium text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-1 rounded-md bg-(--clay) px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === 'submitting' ? 'Signing…' : 'Sign the Petition'}
          </button>

          <p className="text-[10px] leading-relaxed text-(--ink)/50">
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
        <div className="border-t border-(--sand) px-6 py-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-(--lake)">
            Recent signatures
          </p>
          <ul className="space-y-3">
            {recent.map((s, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold text-(--forest)">
                  {s.first_name} {s.last_name.charAt(0)}.
                </span>
                <span className="text-(--ink)/60"> — {s.city}, {s.state}</span>
                {s.comment && <p className="mt-0.5 text-(--ink)/70">&ldquo;{s.comment}&rdquo;</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
