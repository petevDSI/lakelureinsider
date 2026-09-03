'use client'

import { useEffect, useRef, useState } from 'react'
import {
  SHOPIFY_DOMAIN,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  SHOP_PRODUCTS,
} from '@/data/shop'

const SDK_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buybutton.js'

declare global {
  interface Window {
    ShopifyBuy?: {
      buildClient: (config: { domain: string; storefrontAccessToken: string }) => unknown
      UI: {
        onReady: (client: unknown) => Promise<{
          createComponent: (type: string, options: Record<string, unknown>) => void
        }>
      }
    }
  }
}

interface ShopEmbedProps {
  productKey: keyof typeof SHOP_PRODUCTS
}

const BRAND_COLOR = '#2A6F7F' // --lake
const BRAND_COLOR_DARK = '#1C2321' // --ink

export function ShopEmbed({ productKey }: ShopEmbedProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const product = SHOP_PRODUCTS[productKey]
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN || !product) return

    let cancelled = false

    function initClient() {
      if (cancelled || !window.ShopifyBuy || !nodeRef.current) return
      const client = window.ShopifyBuy.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      })
      window.ShopifyBuy.UI.onReady(client)
        .then((ui) => {
          if (cancelled || !nodeRef.current) return
          ui.createComponent('product', {
            id: product.id,
            node: nodeRef.current,
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              product: {
                buttonDestination: 'checkout',
                text: { button: 'Add to cart' },
                styles: {
                  button: {
                    'background-color': BRAND_COLOR,
                    ':hover': { 'background-color': BRAND_COLOR_DARK },
                    ':focus': { 'background-color': BRAND_COLOR_DARK },
                    'border-radius': '6px',
                    'font-family': 'inherit',
                  },
                },
              },
              cart: {
                text: { total: 'Subtotal', button: 'Checkout' },
                styles: {
                  button: {
                    'background-color': BRAND_COLOR,
                    ':hover': { 'background-color': BRAND_COLOR_DARK },
                    ':focus': { 'background-color': BRAND_COLOR_DARK },
                    'border-radius': '6px',
                  },
                },
              },
              toggle: {
                styles: { toggle: { 'background-color': BRAND_COLOR } },
              },
            },
          })
        })
        .catch(() => setFailed(true))
    }

    if (window.ShopifyBuy?.UI) {
      initClient()
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`)
      if (existing) {
        existing.addEventListener('load', initClient)
      } else {
        const script = document.createElement('script')
        script.async = true
        script.src = SDK_URL
        script.onload = initClient
        script.onerror = () => setFailed(true)
        document.head.appendChild(script)
      }
    }

    return () => {
      cancelled = true
    }
  }, [product])

  if (!product) return null

  const previewHref = `https://${SHOPIFY_DOMAIN}/products/${product.handle}`

  if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN || failed) {
    return (
      <div className="not-prose my-8 rounded-xl border border-(--sand) bg-(--sand)/30 p-6 text-center">
        <p className="font-display font-semibold text-(--forest)">
          {product.title} — shop opening soon
        </p>
        <p className="mt-2 text-sm text-(--ink)/70">
          We&apos;re finishing setup on checkout. Check back shortly, or{' '}
          <a
            href={previewHref}
            className="font-semibold text-(--lake) underline"
            target="_blank"
            rel="noopener"
          >
            preview the shirt here
          </a>
          .
        </p>
      </div>
    )
  }

  return <div ref={nodeRef} className="not-prose my-8" aria-live="polite" />
}
