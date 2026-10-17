import { SHOP_PRODUCTS } from '@/data/shop'
import { SITE_NAME, SITE_URL } from '@/lib/site-config'
import {
  APPAREL_PRODUCT_CATEGORIES,
  allProductKeys,
  feedDescription,
  genderFor,
  getCatalogProduct,
  googleCategoryFor,
  CATEGORY_LABELS,
} from '@/lib/shop-catalog'

// Google Merchant Center product feed (tab-delimited), one row per Shopify
// variant (color + size). Add it in Merchant Center under Products > Feeds as a
// scheduled fetch of https://lakelureinsider.com/merchant-feed.tsv. It is built
// from src/data/shop-catalog.json, which is re-synced from Shopify on every
// build, so prices and stock follow the store. Spec:
// https://support.google.com/merchants/answer/7052112
//
// Shipping and return policy are intentionally NOT in the feed — set them once
// in Merchant Center (Shipping and returns) so they are not duplicated here.

const COLUMNS = [
  'id',
  'title',
  'description',
  'link',
  'image_link',
  'availability',
  'price',
  'brand',
  'condition',
  'identifier_exists',
  'item_group_id',
  'product_type',
  'google_product_category',
  'color',
  'size',
  'gender',
  'age_group',
] as const

type Column = (typeof COLUMNS)[number]

function clean(value: string | undefined): string {
  return (value ?? '').replace(/[\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim()
}

export async function GET() {
  const rows: string[] = [COLUMNS.join('\t')]

  for (const key of allProductKeys()) {
    const product = SHOP_PRODUCTS[key]
    const catalog = getCatalogProduct(key)
    if (!catalog) continue

    const apparel = APPAREL_PRODUCT_CATEGORIES.includes(product.category)
    const description = feedDescription(catalog)
    const googleCategory = googleCategoryFor(product)
    const gender = genderFor(product.title)

    for (const variant of catalog.variants) {
      const color = variant.options.Color
      const size = variant.options.Size
      const variantTitle = [product.title, color, size].filter(Boolean).join(' - ')

      const row: Record<Column, string | undefined> = {
        id: variant.id,
        title: variantTitle.slice(0, 150),
        description,
        link: `${SITE_URL}/products/${key}?variant=${variant.id}`,
        image_link: variant.image ?? product.image.src,
        availability: variant.available ? 'in_stock' : 'out_of_stock',
        price: `${variant.price.toFixed(2)} USD`,
        brand: SITE_NAME,
        condition: 'new',
        identifier_exists: 'no',
        item_group_id: catalog.id,
        product_type: `Merchandise > ${CATEGORY_LABELS[product.category]}`,
        google_product_category: googleCategory,
        color,
        size,
        gender: apparel ? gender : undefined,
        age_group: apparel ? 'adult' : undefined,
      }
      rows.push(COLUMNS.map((c) => clean(row[c])).join('\t'))
    }
  }

  return new Response(rows.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/tab-separated-values; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
