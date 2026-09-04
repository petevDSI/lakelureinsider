import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

// Server-only client — uses the service_role key, which bypasses RLS.
// The subscribers table has RLS enabled with NO policies for anon/
// authenticated, so this API route is the only way in or out. Mirrors
// src/app/api/petition/route.ts's lured_petition.signatures setup.
function getClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

function hashIp(ip: string) {
  return createHash('sha256').update(ip).digest('hex')
}

function getIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const supabase = getClient()
  if (!supabase) {
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
  // every field trip this. Report success without writing anything, so the
  // bot doesn't learn it was caught.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

  const email = str(body.email, 200)
  const name = str(body.name, 100) || null
  const source = str(body.source, 60) || 'edmund-for-mayor'

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const ip = getIp(req)
  const ipHash = hashIp(ip)

  // Cheap abuse control: cap sign-ups per IP in a rolling 10-minute window.
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count: recentFromIp } = await supabase
    .schema('edmund_campaign')
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', tenMinAgo)

  if ((recentFromIp ?? 0) >= 5) {
    return NextResponse.json(
      { error: 'Too many sign-ups from this connection recently. Try again later.' },
      { status: 429 },
    )
  }

  const { error } = await supabase.schema('edmund_campaign').from('subscribers').insert({
    email,
    name,
    source,
    ip_hash: ipHash,
  })

  if (error) {
    // Unique violation on lower(email) — already subscribed.
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
