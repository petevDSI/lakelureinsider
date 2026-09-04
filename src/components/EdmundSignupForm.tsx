'use client'

import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function EdmundSignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot — real visitors never see or fill this
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [alreadySubscribed, setAlreadySubscribed] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/edmund-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, website, source: 'edmund-for-mayor' }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setAlreadySubscribed(Boolean(data.alreadySubscribed))
      setStatus('success')
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-[#C9A227] bg-white p-6 text-center">
        <p className="font-display text-lg font-bold text-[#0B2545]">
          {alreadySubscribed ? 'You’re already on the list — thank you.' : 'You’re in. Welcome to the herd.'}
        </p>
        <p className="mt-2 text-sm text-[#1C2321]/70">
          We&apos;ll only email when there&apos;s real Edmund news or new campaign gear — no
          spam, same as any campaign worth trusting.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      {/* Honeypot field, visually and semantically hidden from real visitors */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="edmund-website">Website</label>
        <input
          type="text"
          id="edmund-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="edmund-name" className="sr-only">
          Name (optional)
        </label>
        <input
          type="text"
          id="edmund-name"
          placeholder="Name (optional)"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-[#0B2545]/20 px-3 py-2.5 text-sm text-[#0B2545] placeholder:text-[#0B2545]/40 focus:border-[#B31942] focus:outline-none sm:flex-1"
        />
        <label htmlFor="edmund-email" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="edmund-email"
          placeholder="Email address"
          required
          maxLength={200}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-[#0B2545]/20 px-3 py-2.5 text-sm text-[#0B2545] placeholder:text-[#0B2545]/40 focus:border-[#B31942] focus:outline-none sm:flex-1"
        />
      </div>

      {status === 'error' && <p className="mt-3 text-sm text-[#B31942]">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-3 w-full rounded-md bg-[#B31942] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {status === 'submitting' ? 'Signing you up…' : 'Join the Herd'}
      </button>

      <p className="mt-3 text-xs text-[#1C2321]/50">
        No spam, no PAC calls. Unsubscribe anytime — Edmund won&apos;t take it personally.
      </p>
    </form>
  )
}
