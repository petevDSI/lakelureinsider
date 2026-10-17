#!/usr/bin/env node
// Syncs the Shopify product catalog into src/data/shop-catalog.json.
//
// Why: every /products/<slug> page and the Google Merchant Center feed
// (/merchant-feed.tsv) are built from this file, so prices, colors, sizes,
// stock and the store's own product descriptions never drift from Shopify.
// It runs at the start of `npm run build` (and therefore on the daily rebuild
// cron). If Shopify can't be reached, the committed snapshot is left untouched
// so the build still succeeds. Run it by hand with:
//   node scripts/sync-shop-catalog.mjs
//
// Uses the PUBLIC Storefront API token already in src/data/shop.ts (the same
// one the Buy Button embeds use) — no admin credentials involved.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const shopTs = fs.readFileSync(path.join(root, 'src/data/shop.ts'), 'utf8')
const domain = shopTs.match(/SHOPIFY_DOMAIN\s*=\s*'([^']+)'/)?.[1]
const token = shopTs.match(/SHOPIFY_STOREFRONT_ACCESS_TOKEN\s*=\s*'([^']+)'/)?.[1]
const outFile = path.join(root, 'src/data/shop-catalog.json')
const API_VERSION = '2026-01'

if (!domain || !token) {
  console.warn('[shop-catalog] Could not read Shopify domain/token from src/data/shop.ts — keeping existing snapshot.')
  process.exit(0)
}

async function gql(query, variables = {}) {
  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) throw new Error(`Storefront API HTTP ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors))
  return json.data
}

// Keep only simple structural tags (the store's descriptions use paragraphs,
// bold, line breaks, rules, and a size-guide table) and drop every attribute,
// so the stored HTML is safe to render as-is.
const ALLOWED_TAGS = new Set([
  'p', 'strong', 'em', 'b', 'i', 'br', 'hr', 'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tr', 'td', 'th', 'h2', 'h3', 'h4',
])
function sanitizeHtml(html) {
  return html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
      const name = tag.toLowerCase()
      if (!ALLOWED_TAGS.has(name)) return ''
      return match.startsWith('</') ? `</${name}>` : `<${name}>`
    })
    .trim()
}

const LIST_QUERY = `query($after: String) {
  products(first: 100, after: $after) {
    nodes { id }
    pageInfo { hasNextPage endCursor }
  }
}`

const PRODUCT_QUERY = `query($id: ID!, $after: String) {
  product(id: $id) {
    id handle title productType vendor tags description descriptionHtml
    images(first: 10) { nodes { url altText } }
    variants(first: 100, after: $after) {
      nodes {
        id sku availableForSale
        price { amount }
        selectedOptions { name value }
        image { url }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`

async function main() {
  const ids = []
  let after = null
  do {
    const data = await gql(LIST_QUERY, { after })
    ids.push(...data.products.nodes.map((n) => n.id))
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (after)

  if (ids.length === 0) throw new Error('Storefront API returned zero products')

  const products = {}
  for (const id of ids) {
    let product = null
    const variants = []
    let cursor = null
    do {
      const data = await gql(PRODUCT_QUERY, { id, after: cursor })
      product = data.product
      if (!product) break
      variants.push(...product.variants.nodes)
      cursor = product.variants.pageInfo.hasNextPage ? product.variants.pageInfo.endCursor : null
    } while (cursor)
    if (!product) continue

    const numericId = id.split('/').pop()
    products[numericId] = {
      id: numericId,
      handle: product.handle,
      title: product.title,
      productType: product.productType,
      vendor: product.vendor,
      tags: product.tags,
      description: product.description,
      descriptionHtml: sanitizeHtml(product.descriptionHtml),
      images: product.images.nodes.map((img) => ({ url: img.url, alt: img.altText })),
      variants: variants.map((v) => ({
        id: v.id.split('/').pop(),
        sku: v.sku,
        price: Number(v.price.amount),
        available: v.availableForSale,
        options: Object.fromEntries(v.selectedOptions.map((o) => [o.name, o.value])),
        image: v.image?.url ?? null,
      })),
    }
  }

  // Stable key order so unchanged catalogs produce an unchanged file.
  const sorted = Object.fromEntries(Object.entries(products).sort(([a], [b]) => Number(a) - Number(b)))
  const next = JSON.stringify({ products: sorted }, null, 1) + '\n'
  const prev = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : ''
  if (next !== prev) {
    fs.writeFileSync(outFile, next)
    console.log(`[shop-catalog] Updated snapshot: ${Object.keys(sorted).length} products.`)
  } else {
    console.log(`[shop-catalog] Snapshot already current (${Object.keys(sorted).length} products).`)
  }
}

main().catch((err) => {
  console.warn(`[shop-catalog] Sync failed (${err.message}) — keeping existing snapshot.`)
  process.exit(0)
})
