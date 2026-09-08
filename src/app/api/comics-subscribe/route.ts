import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Reuses the same RESEND_API_KEY already configured in Vercel for
// src/app/api/contact/route.ts — no new env var needed.
const RESEND_API_KEY = process.env.RESEND_API_KEY

// The "Comics Alerts" segment in Resend — created by Pete in the
// dashboard on 2026-09-08. Segments in Resend are NOT saved filters;
// a contact's `source` property does not automatically put it in any
// segment. Membership is explicit — a contact has to be added to a
// segment ID one at a time via contacts.segments.add(). This is the
// ID broadcasts should target to reach comics subscribers only.
const COMICS_ALERTS_SEGMENT_ID = '9304cd12-29a1-4524-bf80-e598a9855972'

function getResend() {
  if (!RESEND_API_KEY) return null
  return new Resend(RESEND_API_KEY)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const resend = getResend()
  if (!resend) {
    return NextResponse.json(
      { error: 'Sign-ups aren’t configured yet — check back shortly.' },
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
  // every field trip this. Report success without contacting Resend, so
  // the bot doesn't learn it was caught.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : ''

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // resend.contacts.create() upserts on email — resubmitting (or
  // re-subscribing after an unsubscribe) just updates the existing
  // contact rather than erroring, so no "already subscribed" branch
  // is needed here.
  //
  // `source` must exist as a Contact Property in the Resend dashboard
  // before it can be set here — Resend rejects unknown properties
  // with a 422 (confirmed live via Vercel runtime logs on 2026-09-08).
  // Pete created the `source` (string) property in the dashboard, so
  // this is safe to send now.
  const normalizedEmail = email.toLowerCase()

  const { error } = await resend.contacts.create({
    email: normalizedEmail,
    unsubscribed: false,
    properties: { source: 'comics-alert' },
  })

  if (error) {
    console.error('comics-subscribe: Resend error creating contact', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 502 })
  }

  // Segment membership is a separate call from contact creation (see
  // note above) — without this, the contact exists but never shows up
  // in the Comics Alerts segment, so a broadcast targeting that
  // segment would silently miss them.
  const { error: segmentError } = await resend.contacts.segments.add({
    email: normalizedEmail,
    segmentId: COMICS_ALERTS_SEGMENT_ID,
  })

  if (segmentError) {
    // The contact was created successfully — don't fail the signup
    // over this, just log it so it can be added to the segment by hand
    // if needed.
    console.error('comics-subscribe: Resend error adding to segment', segmentError)
  }

  return NextResponse.json({ ok: true })
}
