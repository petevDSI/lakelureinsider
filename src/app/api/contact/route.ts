import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Server-only. CONTACT_TO_EMAIL and RESEND_API_KEY are plain (non-
// NEXT_PUBLIC_) env vars, so they're never bundled to the client and never
// appear in this public repo's source. This route is the only place the
// destination address is referenced at all.
const CONTACT_TO = process.env.CONTACT_TO_EMAIL
const RESEND_API_KEY = process.env.RESEND_API_KEY

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getResend() {
  if (!RESEND_API_KEY) return null
  return new Resend(RESEND_API_KEY)
}

export async function POST(req: NextRequest) {
  const resend = getResend()
  if (!resend || !CONTACT_TO) {
    return NextResponse.json(
      { error: 'The contact form is not configured yet — check back shortly.' },
      { status: 503 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot — a hidden field real visitors never fill in. Bots that fill
  // every field trip this. Report success without sending anything, so the
  // bot doesn't learn it was caught.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

  const name = str(body.name, 100)
  const email = str(body.email, 200)
  const subject = str(body.subject, 150)
  const message = str(body.message, 4000)

  if (!name) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (!message) {
    return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 })
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Lake Lure Insider <onboarding@resend.dev>',
      to: CONTACT_TO,
      replyTo: email,
      subject: subject ? `[Contact] ${subject}` : `[Contact] New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    })

    if (error) {
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
