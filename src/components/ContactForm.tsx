'use client'

import { useState, type FormEvent } from 'react'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — real visitors never see or fill this
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, website }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="not-prose rounded-xl border border-(--sand) bg-(--sand)/40 p-6 text-center">
        <p className="font-display text-lg font-bold text-(--forest)">Message sent — thanks!</p>
        <p className="mt-2 text-sm text-(--ink)/70">
          We read every message and will get back to you as soon as we can.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="not-prose space-y-4">
      {/* Honeypot field, visually and semantically hidden from real visitors */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-(--ink)">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm text-(--ink) focus:border-(--lake) focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-(--ink)">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          maxLength={200}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm text-(--ink) focus:border-(--lake) focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-(--ink)">
          Subject <span className="font-normal text-(--ink)/50">(optional)</span>
        </label>
        <input
          type="text"
          id="subject"
          maxLength={150}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm text-(--ink) focus:border-(--lake) focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-(--ink)">
          Message
        </label>
        <textarea
          id="message"
          required
          maxLength={4000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-md border border-(--sand) px-3 py-2 text-sm text-(--ink) focus:border-(--lake) focus:outline-none"
        />
      </div>

      {status === 'error' && <p className="text-sm text-red-700">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-md bg-(--forest) px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
