'use client'

import { useEffect, useRef, useState } from 'react'
import { SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN, SHOP_PRODUCTS } from '@/data/shop'
import { getSharedShopifyUI } from '@/lib/shopifyBuyUI'

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

    // Every ShopEmbed on the page shares ONE Shopify Buy UI instance (and
    // therefore one cart) via getSharedShopifyUI() — see src/lib/shopifyBuyUI.ts
    // for why that matters (otherwise each product gets its own isolated cart).
    // Also: buttonDestination must be 'cart', not 'checkout'. 'checkout' skips
    // the cart entirely and sends the customer straight to Shopify checkout
    // with just the one item they clicked — that's what caused Pete's "can
    // only buy one thing at a time, no quantity selector" report (2026-09-04).
    // 'cart' opens the shared cart drawer instead, where items from every
    // product on the page accumulate and each line item gets its own
    // quantity stepper.
    getSharedShopifyUI()
      .then((ui) => {
        if (cancelled || !nodeRef.current) return
        ui.createComponent('product', {
          id: product.id,
          node: nodeRef.current,
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            product: {
              buttonDestination: 'cart',
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
