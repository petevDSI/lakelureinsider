import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const HOST = 'lakelureinsider.com'
const SITE_URL = `https://${HOST}`
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function collectMdxFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) collectMdxFiles(full, results)
    else if (entry.name.endsWith('.mdx')) results.push(full)
  }
  return results
}

function buildUrlList() {
  // Mirror the logic in src/app/sitemap.ts exactly.
  // Static pages that are always indexable:
  const urls = [SITE_URL, `${SITE_URL}/affiliate-disclosure`, `${SITE_URL}/privacy`]

  const contentDir = path.join(ROOT, 'content')
  for (const file of collectMdxFiles(contentDir)) {
    const { data } = matter(fs.readFileSync(file, 'utf8'))
    if (data.stub) continue
    if (!data.slug) continue
    urls.push(data.slug ? `${SITE_URL}/${data.slug}` : SITE_URL)
  }

  return urls
}

async function submit() {
  const env = process.env.VERCEL_ENV
  const key = process.env.INDEXNOW_KEY

  if (env !== 'production') {
    console.log(`[IndexNow] Skipping — VERCEL_ENV=${env ?? '(unset)'}, submission is production-only`)
    return
  }

  if (!key) {
    // Don't fail the build, but make it loud.
    console.error('[IndexNow] Error: INDEXNOW_KEY is not set. Add it to Vercel environment variables.')
    return
  }

  const urlList = buildUrlList()
  const payload = {
    host: HOST,
    key,
    keyLocation: `${SITE_URL}/${key}.txt`,
    urlList,
  }

  console.log(`[IndexNow] Submitting ${urlList.length} URLs...`)

  let res
  try {
    res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[IndexNow] Network error:', err.message)
    return
  }

  console.log(`[IndexNow] Response: ${res.status} ${res.statusText}`)

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error(`[IndexNow] Submission failed${body ? ': ' + body : ''}`)
    // Intentionally not throwing — a IndexNow failure is not a build failure.
  }
}

submit()
