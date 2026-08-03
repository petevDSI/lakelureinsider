#!/usr/bin/env node
/**
 * Hero h1 contrast check — measures the COMPUTED color of the hero h1 against
 * the hero background using Playwright, then calculates the WCAG 2.1 contrast
 * ratio. Fails the build below 4.5:1.
 *
 * This replaces the previous source-grep approach (checking that text-white is
 * on the element and .prose h1 is inside @layer components). That check would
 * have passed during all three prior regressions — the class was always present
 * and a different mechanism defeated it each time. getComputedStyle() measures
 * what the browser actually paints, regardless of mechanism.
 *
 * Runs only when VERCEL=1 or CI=1. Local builds skip unless you set CI=1.
 * To run locally: CI=1 npm run build
 */

import { execSync, spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const IS_CI = Boolean(process.env.VERCEL || process.env.CI)

if (!IS_CI) {
  console.log('[contrast] Not in CI — skipping. Run with CI=1 to enable locally.')
  process.exit(0)
}

// Install Chromium on CI. Vercel caches node_modules between builds, so this
// is fast after the first deploy.
console.log('[contrast] Installing Playwright Chromium...')
execSync('npx playwright install --with-deps chromium', { stdio: 'inherit' })

const { chromium } = await import('playwright')

// Every page with a hero image — all must pass
const HERO_PAGES = [
  '/whats-open-now',
  '/chimney-rock/tickets-and-hours',
  '/things-to-do/boat-rentals',
]

const PORT = 3099

// ── WCAG relative luminance + contrast ratio ─────────────────────────────────

function toLinear(c8bit) {
  const s = c8bit / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function relativeLuminance(r, g, b) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function contrastRatio(c1, c2) {
  const l1 = relativeLuminance(...c1)
  const l2 = relativeLuminance(...c2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function parseCssColor(str) {
  // getComputedStyle always returns rgb() or rgba()
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])] : null
}

// ── Server startup ────────────────────────────────────────────────────────────

async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url)
      if (res.status < 500) return
    } catch {
      // server not up yet
    }
    await sleep(250)
  }
  throw new Error(`[contrast] next start at ${url} did not become ready within ${timeoutMs}ms`)
}

// ── Main ──────────────────────────────────────────────────────────────────────

const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env },
})

server.stdout.on('data', d => process.stdout.write(d))
server.stderr.on('data', d => process.stderr.write(d))

let failed = false

try {
  await waitForServer(`http://localhost:${PORT}/`)
  const browser = await chromium.launch()

  for (const pagePath of HERO_PAGES) {
    const page = await browser.newPage()
    try {
      await page.goto(`http://localhost:${PORT}${pagePath}`, { waitUntil: 'domcontentloaded' })

      const heroCount = await page.locator('.full-bleed').count()
      if (heroCount === 0) {
        console.log(`[contrast] ${pagePath}: no .full-bleed element — skipping`)
        continue
      }

      const h1Count = await page.locator('.full-bleed h1').count()
      if (h1Count === 0) {
        console.log(`[contrast] ${pagePath}: no h1 inside .full-bleed — skipping`)
        continue
      }

      // getComputedStyle resolves CSS variables and the full cascade — this is
      // the color the browser will paint, not a class name or source pattern.
      //
      // Background: the hero div has bg-[--forest] as an opaque fallback when
      // the image is missing or slow. The gradient scrims make the actual visual
      // background darker, so this is the LIGHTEST (most conservative) background
      // we test against. If white passes against forest, it passes against the
      // darker rendered background too.
      const [h1ColorStr, bgColorStr] = await page.evaluate(() => {
        const h1 = document.querySelector('.full-bleed h1')
        const hero = document.querySelector('.full-bleed')
        return [
          window.getComputedStyle(h1).color,
          window.getComputedStyle(hero).backgroundColor,
        ]
      })

      const h1Color = parseCssColor(h1ColorStr)
      const bgColor = parseCssColor(bgColorStr)

      if (!h1Color || !bgColor) {
        console.error(`[contrast] FAIL ${pagePath}: cannot parse colors — h1="${h1ColorStr}" bg="${bgColorStr}"`)
        failed = true
        continue
      }

      const ratio = contrastRatio(h1Color, bgColor)

      if (ratio < 4.5) {
        console.error(
          `\n[contrast] FAIL ${pagePath}\n` +
          `  Computed h1 color:  ${h1ColorStr}\n` +
          `  Hero background:    ${bgColorStr}\n` +
          `  Contrast ratio:     ${ratio.toFixed(2)}:1  (WCAG AA requires ≥ 4.5:1)\n`
        )
        failed = true
      } else {
        console.log(`[contrast] PASS ${pagePath} — ${ratio.toFixed(1)}:1  (h1: ${h1ColorStr})`)
      }
    } finally {
      await page.close()
    }
  }

  await browser.close()
} finally {
  server.kill()
}

if (failed) {
  console.error('\n[contrast] Hero contrast check FAILED — fix before deploying.\n')
  process.exit(1)
}

console.log('[contrast] All hero pages passed.')
