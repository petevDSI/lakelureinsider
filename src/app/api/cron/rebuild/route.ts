/**
 * Daily rebuild trigger — called by Vercel Cron at 9 AM UTC.
 * POSTs to the Vercel Deploy Hook to kick off a fresh build.
 *
 * Why a daily rebuild:
 * This is a fully static site. Time-sensitive content (open/closed status,
 * construction timelines, event countdowns) is computed at build time.
 * The cron keeps the published HTML current without requiring manual deploys.
 *
 * Authorization:
 * Vercel Cron sends Authorization: Bearer <CRON_SECRET>.
 * All other callers get 401.
 *
 * Env vars required:
 *   CRON_SECRET      — set in Vercel project settings, never committed
 *   DEPLOY_HOOK_URL  — the Vercel Deploy Hook URL for this project
 */
export const runtime = 'nodejs'

export async function GET(request: Request): Promise<Response> {
  const authHeader = request.headers.get('Authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const hookUrl = process.env.DEPLOY_HOOK_URL
  if (!hookUrl) {
    console.error('[cron/rebuild] DEPLOY_HOOK_URL is not set')
    return new Response('DEPLOY_HOOK_URL not configured', { status: 500 })
  }

  try {
    const res = await fetch(hookUrl, { method: 'POST' })
    const data = await res.json() as { job?: { id: string } }
    console.log('[cron/rebuild] Deploy hook triggered — job:', data.job?.id ?? '(no id)')
    return Response.json({ ok: true, jobId: data.job?.id ?? null })
  } catch (err) {
    console.error('[cron/rebuild] Failed to trigger deploy hook:', err)
    return Response.json({ ok: false, error: String(err) }, { status: 502 })
  }
}
