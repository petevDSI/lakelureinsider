import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

// Server-only client — uses the service_role key, which bypasses RLS.
// The signatures table has RLS enabled with NO policies for anon/authenticated,
// so this API route is the only way in or out. SUPABASE_URL /
// SUPABASE_SERVICE_ROLE_KEY are plain (non-NEXT_PUBLIC_) env vars — never
// bundled to the client.
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
const ZIP_RE = /^\d{5}(-\d{4})?$/

export async function GET() {
  const supabase = getClient()
  if (!supabase) {
    return NextResponse.json({ count: 0, recent: [], configured: false })
  }

  const { count } = await supabase
    .schema('lured_petition')
    .from('signatures')
    .select('*', { count: 'exact', head: true })

  const { data: recent } = await supabase
    .schema('lured_petition')
    .from('signatures')
    .select('first_name, last_name, city, state, comment, created_at')
    .order('created_at', { ascending: false })
    .limit(12)

  return NextResponse.json({ count: count ?? 0, recent: recent ?? [], configured: true })
}

export async function POST(req: NextRequest) {
  const supabase = getClient()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Petition signing is not configured yet — check back shortly.' },
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

  const firstName = str(body.firstName, 60)
  const lastName = str(body.lastName, 60)
  const email = str(body.email, 200)
  const city = str(body.city, 100)
  const state = str(body.state, 40)
  const zip = str(body.zip, 10)
  const comment = str(body.comment, 500) || null

  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'Please enter your first and last name.' }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (!city || !state) {
    return NextResponse.json({ error: 'Please enter your city and state.' }, { status: 400 })
  }
  if (!zip || !ZIP_RE.test(zip)) {
    return NextResponse.json({ error: 'Please enter a valid ZIP code.' }, { status: 400 })
  }

  const ip = getIp(req)
  const ipHash = hashIp(ip)

  // Cheap abuse control: cap signatures per IP in a rolling 10-minute window.
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count: recentFromIp } = await supabase
    .schema('lured_petition')
    .from('signatures')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', tenMinAgo)

  if ((recentFromIp ?? 0) >= 5) {
    return NextResponse.json(
      { error: 'Too many signatures from this connection recently. Try again later.' },
      { status: 429 },
    )
  }

  const { error } = await supabase.schema('lured_petition').from('signatures').insert({
    first_name: firstName,
    last_name: lastName,
    email,
    city,
    state,
    zip,
    comment,
    ip_hash: ipHash,
  })

  if (error) {
    // Unique violation on lower(email) — they've already signed.
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, alreadySigned: true })
    }
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
