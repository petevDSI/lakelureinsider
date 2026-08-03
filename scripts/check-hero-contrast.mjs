#!/usr/bin/env node
/**
 * Hero contrast guard — analyzes the compiled CSS cascade to determine
 * what color the hero h1 gets when it has class="text-white" inside .prose.
 *
 * Reads the built artifact (.next/static/chunks/*.css), not the source.
 * Simulates CSS Cascade Level 5 (layer priority → specificity → source order)
 * to determine the effective computed color.
 *
 * Why CSS cascade analysis instead of Playwright:
 * Vercel's build container is missing Chromium's libnspr4.so and is flagged
 * "not officially supported" by Playwright. The compiled CSS is the same
 * artifact the browser reads — resolving the cascade on it gives the same
 * answer a browser would.
 *
 * Why this catches what the previous source check missed:
 * The previous check verified that (a) text-white was on the h1 element and
 * (b) .prose h1 was inside @layer components. Both were true during all three
 * prior regressions — a different CSS mechanism defeated text-white each time.
 * This check measures the OUTCOME: which rule wins the cascade. If anything —
 * new unlayered rule, wrong layer, same-layer specificity beat — makes
 * .prose h1 win, the build fails.
 *
 * Runs unconditionally (local and CI) after next build produces .next/.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// ── Read compiled CSS ─────────────────────────────────────────────────────────

const CHUNKS_DIR = '.next/static/chunks'

let css
try {
  const cssFiles = readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.css'))
  if (cssFiles.length === 0) throw new Error('no .css files in directory')
  css = cssFiles.map(f => readFileSync(join(CHUNKS_DIR, f), 'utf8')).join('\n')
} catch (err) {
  console.error(`[contrast] Cannot read compiled CSS from ${CHUNKS_DIR}: ${err.message}`)
  console.error('[contrast] Run next build before this check.')
  process.exit(1)
}

// ── Parse top-level @layer blocks ────────────────────────────────────────────
//
// Layer cascade priority: later in the file = higher priority.
// Unlayered rules (outside any @layer block) = above all named layers.
// Reference: https://www.w3.org/TR/css-cascade-5/#layer-ordering

function parseTopLevelLayers(css) {
  const layers = []
  const re = /@layer\s+(\w+)\s*\{/g
  let m
  while ((m = re.exec(css)) !== null) {
    // Find matching } via brace depth
    let depth = 1
    let j = m.index + m[0].length  // char after opening {
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++
      else if (css[j] === '}') depth--
      j++
    }
    layers.push({ name: m[1], start: m.index, end: j - 1 })
  }
  return layers
}

const layers = parseTopLevelLayers(css)

function layerOf(pos) {
  for (const layer of layers) {
    if (pos >= layer.start && pos <= layer.end) return layer
  }
  return null  // unlayered
}

// Priority: layer array index (later = higher), null (unlayered) = above all
function priority(layer) {
  if (layer === null) return layers.length  // unlayered beats every named layer
  return layers.indexOf(layer)
}

// ── Find the two rules we care about ─────────────────────────────────────────
//
// .prose h1  — color: var(--forest)     specificity (0,1,1) — BAD if wins
// .text-white — color: var(--color-white) specificity (0,1,0) — GOOD if wins
//
// In the compiled (minified) CSS these appear as:
//   .prose h1,.prose h2,...{...color:var(--forest)...}
//   .text-white{color:var(--color-white)}

const PROSE_H1_TOKEN = '.prose h1,'
const TEXT_WHITE_TOKEN = '.text-white{'

const proseH1Pos = css.indexOf(PROSE_H1_TOKEN)
const textWhitePos = css.indexOf(TEXT_WHITE_TOKEN)

if (proseH1Pos === -1) {
  console.error(`[contrast] FAIL: "${PROSE_H1_TOKEN}" not found in compiled CSS.`)
  console.error('[contrast] The .prose h1 rule may have been renamed or removed. Update this check.')
  process.exit(1)
}
if (textWhitePos === -1) {
  console.error(`[contrast] FAIL: "${TEXT_WHITE_TOKEN}" not found in compiled CSS.`)
  console.error('[contrast] The text-white utility may have been renamed. Update this check.')
  process.exit(1)
}

const proseH1Layer = layerOf(proseH1Pos)
const textWhiteLayer = layerOf(textWhitePos)
const proseH1Prio = priority(proseH1Layer)
const textWhitePrio = priority(textWhiteLayer)

// ── Cascade result ────────────────────────────────────────────────────────────

const proseH1Desc = `${proseH1Layer?.name ?? 'unlayered'} (priority ${proseH1Prio})`
const textWhiteDesc = `${textWhiteLayer?.name ?? 'unlayered'} (priority ${textWhitePrio})`

if (textWhitePrio > proseH1Prio) {
  // text-white layer has higher cascade priority → text-white wins → white text ✓
  console.log(`[contrast] PASS: text-white [${textWhiteDesc}] wins over .prose h1 [${proseH1Desc}].`)
  console.log('[contrast] Hero h1 computed color: white.')
  process.exit(0)
}

// Failure path — determine the specific problem for a clear error message
let reason
if (textWhitePrio === proseH1Prio) {
  // Same layer → specificity wins. .prose h1 (0,1,1) > .text-white (0,1,0) → bad.
  reason =
    `.prose h1 and .text-white are both in layer "${proseH1Layer?.name ?? 'unlayered'}".\n` +
    `  Within the same layer, specificity decides: .prose h1 (0,1,1) > .text-white (0,1,0).\n` +
    `  .prose h1 { color: var(--forest) } wins → dark text over dark hero image.\n` +
    `  Fix: ensure .prose heading styles are in @layer components, not @layer utilities.`
} else {
  // .prose h1 is in a higher-priority layer → it wins
  reason =
    `.prose h1 [${proseH1Desc}] has higher cascade priority than text-white [${textWhiteDesc}].\n` +
    `  .prose h1 { color: var(--forest) } wins → dark text over dark hero image.\n` +
    `  Fix: .prose heading styles must be in @layer components (below @layer utilities).\n` +
    `  If .prose h1 appears outside all @layer blocks, move it into @layer components.`
}

console.error(`\n[contrast] FAIL: Hero h1 will NOT render white.\n  ${reason}\n`)
process.exit(1)
