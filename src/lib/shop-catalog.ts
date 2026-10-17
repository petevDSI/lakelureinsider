import catalogJson from '@/data/shop-catalog.json'
import { SHOP_PRODUCTS, type ShopProduct, type ShopProductKey } from '@/data/shop'

// Live Shopify catalog snapshot (prices, colors, sizes, stock, the store's own
// product descriptions). Written by scripts/sync-shop-catalog.mjs at the start
// of every build, so it is refreshed on each deploy and on the daily rebuild.

export interface CatalogVariant {
  id: string
  sku: string | null
  price: number
  available: boolean
  options: Record<string, string>
  image: string | null
}

export interface CatalogProduct {
  id: string
  handle: string
  title: string
  productType: string
  vendor: string
  tags: string[]
  description: string
  descriptionHtml: string
  images: { url: string; alt: string | null }[]
  variants: CatalogVariant[]
}

const CATALOG = (catalogJson as { products: Record<string, CatalogProduct> }).products

export function getCatalogProduct(key: ShopProductKey): CatalogProduct | undefined {
  return CATALOG[SHOP_PRODUCTS[key].id]
}

export function allProductKeys(): ShopProductKey[] {
  return Object.keys(SHOP_PRODUCTS) as ShopProductKey[]
}

export function isProductKey(value: string): value is ShopProductKey {
  return Object.prototype.hasOwnProperty.call(SHOP_PRODUCTS, value)
}

/** Categories that are wearable apparel (need color/size/gender/age_group in the feed). */
export const APPAREL_PRODUCT_CATEGORIES: ShopProduct['category'][] = [
  '100-dam-years',
  'tees',
  'hats',
  'hoodie-tank',
]

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL']

function sizeRank(size: string): number {
  const i = SIZE_ORDER.indexOf(size)
  return i === -1 ? SIZE_ORDER.length : i
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`
}

/** Unique color names in the order Shopify lists them. */
export function colorsOf(product: CatalogProduct): string[] {
  return [...new Set(product.variants.map((v) => v.options.Color).filter(Boolean))]
}

/** One representative variant image per color, for the color gallery. */
export function colorImages(product: CatalogProduct): { color: string; image: string }[] {
  const seen = new Map<string, string>()
  for (const v of product.variants) {
    const color = v.options.Color
    if (color && v.image && !seen.has(color)) seen.set(color, v.image)
  }
  return [...seen].map(([color, image]) => ({ color, image }))
}

/**
 * Price by size, e.g. [{ sizes: "S–XL", price: "$22.50" }, { sizes: "2XL", ... }].
 * Consecutive sizes with the same price are merged. If a size's price also
 * varies by color the range is shown ("$22.50–$25.00") so the page never
 * understates what the checkout will charge.
 */
export function priceBySize(product: CatalogProduct): { sizes: string; price: string }[] {
  const bySize = new Map<string, { min: number; max: number }>()
  for (const v of product.variants) {
    const size = v.options.Size
    if (!size) continue
    const cur = bySize.get(size)
    bySize.set(size, {
      min: Math.min(cur?.min ?? Infinity, v.price),
      max: Math.max(cur?.max ?? -Infinity, v.price),
    })
  }
  const ordered = [...bySize.entries()].sort(([a], [b]) => sizeRank(a) - sizeRank(b))
  const label = (r: { min: number; max: number }) =>
    r.min === r.max ? formatUsd(r.min) : `${formatUsd(r.min)}–${formatUsd(r.max)}`

  const rows: { sizes: string[]; price: string }[] = []
  for (const [size, range] of ordered) {
    const price = label(range)
    const last = rows[rows.length - 1]
    if (last && last.price === price) last.sizes.push(size)
    else rows.push({ sizes: [size], price })
  }
  return rows.map((r) => ({
    sizes: r.sizes.length > 1 ? `${r.sizes[0]}–${r.sizes[r.sizes.length - 1]}` : r.sizes[0],
    price: r.price,
  }))
}

export function priceRange(product: CatalogProduct): { low: number; high: number } {
  const prices = product.variants.map((v) => v.price)
  return { low: Math.min(...prices), high: Math.max(...prices) }
}

/** Plain-text description for the feed: story + specs, cut before the size-guide table. */
export function feedDescription(product: CatalogProduct, max = 4900): string {
  const cut = product.description.split(/Size guide/i)[0]
  const text = cut
    .replace(/\s*•\s*/g, '; ')
    .replace(/:\s*;/g, ':')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

export function genderFor(title: string): 'male' | 'female' | 'unisex' {
  if (/\bwomen/i.test(title)) return 'female'
  if (/\bmen's\b|\bmens\b/i.test(title)) return 'male'
  return 'unisex'
}

/** Google product category, only where we are confident of the taxonomy path. */
export function googleCategoryFor(product: ShopProduct): string | undefined {
  if (product.category === 'hats') return 'Apparel & Accessories > Clothing Accessories > Hats'
  if (product.category === 'hoodie-tank' && /tank/i.test(product.title)) {
    return 'Apparel & Accessories > Clothing > Shirts & Tops'
  }
  if (product.category === 'hoodie-tank') return 'Apparel & Accessories > Clothing'
  if (product.category === 'tees' || product.category === '100-dam-years') {
    return /sweatshirt|hoodie/i.test(product.title)
      ? 'Apparel & Accessories > Clothing'
      : 'Apparel & Accessories > Clothing > Shirts & Tops'
  }
  return undefined
}

export const CATEGORY_LABELS: Record<ShopProduct['category'], string> = {
  '100-dam-years': '100 Dam Years',
  tees: 'Tees & Long Sleeves',
  hats: 'Hats',
  'hoodie-tank': 'Hoodie & Tank',
  stickers: 'Stickers',
  magnets: 'Magnets',
  pins: 'Pins',
}
