'use client'

import Script from 'next/script'

/**
 * Fires a Meta Pixel "ViewContent" event for the /shop page. Loaded via
 * next/script with strategy="afterInteractive" (runs after the page is
 * interactive, doesn't block hydration).
 *
 * IMPORTANT: this only fires the event — it does not load the base Meta
 * Pixel snippet that defines `fbq`. As of 2026-09-03 nothing in this repo
 * loads the base pixel anywhere (searched for fbq/facebook.net/Meta Pixel —
 * no matches), so until that base snippet is added somewhere upstream
 * (e.g. src/app/layout.tsx), this script will throw a harmless
 * "fbq is not defined" console error instead of actually tracking
 * anything. Flagged in claude project doc "merch-store-pod-vendor-decision".
 */
export function MetaPixelViewContent() {
  return (
    <Script id="meta-pixel-view-content-shop" strategy="afterInteractive">
      {`
        fbq('track', 'ViewContent', {
          value: 29.50,
          currency: 'USD',
          content_ids: ['unisex-classic-tee-1'],
          content_type: 'product',
        });
      `}
    </Script>
  )
}
