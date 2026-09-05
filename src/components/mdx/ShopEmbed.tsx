'use client'

import { useEffect, useRef, useState } from 'react'
import { SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN, SHOP_PRODUCTS, type ShopProductKey } from '@/data/shop'
import { getSharedShopifyUI } from '@/lib/shopifyBuyUI'

interface ShopEmbedProps {
  productKey: ShopProductKey
  /**
   * Compact mode hides the Buy Button widget's own title/price (the card
   * already shows those) but keeps its own product image — that image is
   * what actually updates to match the color a shopper picks. Hiding it too
   * (an earlier version of this component did) left the card's static hero
   * photo showing the wrong color once someone changed the dropdown, with
   * nothing on the page reflecting their actual selection — Pete flagged
   * this 2026-09-04. The widget's image renders small, right above the
   * dropdowns/button, so it reads as "here's your selection" rather than
   * duplicating the card's larger photo above it. Defaults to true; pass
   * false for a rare standalone/full embed.
   */
  compact?: boolean
}

const BRAND_COLOR = '#2A6F7F' // --lake
const BRAND_COLOR_DARK = '#1C2321' // --ink

export function ShopEmbed({ productKey, compact = true }: ShopEmbedProps) {
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
              // Compact mode (the default) suppresses the widget's own
              // title/price, which the card already shows — but keeps its
              // image, which is what updates to match the selected color.
              // See the `compact` prop doc above.
              contents: compact ? { title: false, price: false } : undefined,
              styles: {
                img: {
                  'max-width': '140px',
                  margin: '0 auto 12px auto',
                  'border-radius': '8px',
                },
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
  }, [product, compact])

  if (!product) return null

  const previewHref = `https://${SHOPIFY_DOMAIN}/products/${product.handle}`

  if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN || failed) {
    return (
      <div className="not-prose my-2 rounded-xl border border-(--sand) bg-(--sand)/30 p-6 text-center">
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

  return <div ref={nodeRef} className="not-prose my-1" aria-live="polite" />
}
