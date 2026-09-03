// Shopify storefront config — the Printful-fulfilled "Lake Lure Insider Shop".
// See claude project doc "merch-store-pod-vendor-decision" for the full setup story.

export const SHOPIFY_DOMAIN = 'dvui01-qr.myshopify.com'

// Storefront API access token for the Buy Button sales channel. This is a
// public/embeddable token (scoped to storefront reads + checkout creation
// only, not the Admin API) — safe to ship in client JS. Generate it from
// Shopify Admin -> Settings -> Apps and sales channels -> Buy Button ->
// create/edit a Buy Button for a product -> "Get embed code". Left blank
// until Pete provides it; the ShopEmbed component shows a friendly
// "opening soon" fallback with a direct storefront link until then.
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = ''

export interface ShopProduct {
  /** Shopify numeric product ID, e.g. "10252823167296" */
  id: string
  handle: string
  title: string
}

export const SHOP_PRODUCTS: Record<string, ShopProduct> = {
  'edmund-for-mayor-tee': {
    id: '10252823167296',
    handle: 'unisex-classic-tee',
    title: 'Edmund for Mayor Tee',
  },
}
