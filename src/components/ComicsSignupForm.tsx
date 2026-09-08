'use client'

import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ComicsSignupForm() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot — real visitors never see or fill this
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/comics-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <p className="font-semibold text-(--forest)">You&rsquo;re signed up.</p>
        <p className="mt-1 text-sm text-(--ink)/70">
          We&apos;ll email you when a new episode of &ldquo;State of the Herd&rdquo; goes up
          &mdash; nothing else.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Honeypot field, visually and semantically hidden from real visitors */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="comics-website">Website</label>
        <input
          type="text"
          id="comics-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="comics-email" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="comics-email"
          placeholder="Email address"
          required
          maxLength={200}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-(--ink)/20 px-3 py-2.5 text-sm text-(--ink) placeholder:text-(--ink)/40 focus:border-(--clay) focus:outline-none sm:flex-1"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="shrink-0 rounded-md bg-(--clay) px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Signing up…' : 'Get alerts'}
        </button>
      </div>

      {status === 'error' && <p className="mt-2 text-sm text-(--clay)">{errorMessage}</p>}

      <p className="mt-2 text-xs text-(--ink)/50">
        One email per new episode. No spam, unsubscribe anytime.
      </p>
    </form>
  )
}
