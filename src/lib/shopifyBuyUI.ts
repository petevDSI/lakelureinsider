'use client'

// Shared Shopify Buy Button SDK client/UI singleton.
//
// Each <ShopEmbed> used to build its OWN client and call
// `ShopifyBuy.UI.onReady(client)` independently, which gives every product
// embed its own isolated cart — that's why adding the tee to cart, then
// clicking "Add to cart" on a hat, behaved like two separate carts instead
// of accumulating into one (Pete's "only lets me add one thing at a time"
// report, 2026-09-03). Shopify's own multi-product recipe calls
// `createComponent('product', ...)` multiple times against a SINGLE `ui`
// instance so every product shares one cart. This module makes sure the
// whole page only ever builds one client and calls `UI.onReady` once, no
// matter how many <ShopEmbed> components are mounted.

import { SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN } from '@/data/shop'

const SDK_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'

export interface ShopifyBuyUI {
  createComponent: (type: string, options: Record<string, unknown>) => void
}

declare global {
  interface Window {
    ShopifyBuy?: {
      buildClient: (config: { domain: string; storefrontAccessToken: string }) => unknown
      UI: {
        onReady: (client: unknown) => Promise<ShopifyBuyUI>
      }
    }
  }
}

let sdkPromise: Promise<void> | null = null
let uiPromise: Promise<ShopifyBuyUI> | null = null

function loadSdk(): Promise<void> {
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    if (window.ShopifyBuy?.UI) {
      resolve()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Shopify Buy SDK')))
      return
    }
    const script = document.createElement('script')
    script.async = true
    script.src = SDK_URL
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Shopify Buy SDK'))
    document.head.appendChild(script)
  })

  return sdkPromise
}

/**
 * Returns the single shared Shopify Buy UI instance for the page, building
 * it on first call and reusing it for every subsequent call. Every
 * <ShopEmbed> should get its `ui` from here (never build its own client)
 * so all product components share one cart.
 */
export function getSharedShopifyUI(): Promise<ShopifyBuyUI> {
  if (uiPromise) return uiPromise

  if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return Promise.reject(new Error('Missing Shopify storefront access token'))
  }

  uiPromise = loadSdk().then(() => {
    if (!window.ShopifyBuy) throw new Error('Shopify Buy SDK failed to load')
    const client = window.ShopifyBuy.buildClient({
      domain: SHOPIFY_DOMAIN,
      storefrontAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    })
    return window.ShopifyBuy.UI.onReady(client)
  })

  // If building the shared UI fails, clear the cache so a later mount can retry
  // (e.g. a transient network error loading the SDK) instead of every
  // ShopEmbed being stuck on one failed promise forever.
  uiPromise.catch(() => {
    uiPromise = null
  })

  return uiPromise
}
