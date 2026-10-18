// Shop shipping & returns terms. Single source for the /shop/shipping-returns page,
// the Product structured data (shippingDetails / hasMerchantReturnPolicy), and the
// Facts entries. All items are print-on-demand, fulfilled and shipped within the
// USA by Printful, and the store adopts Printful's published customer terms.
// Re-verify against the two source URLs whenever Printful changes its terms.

export const SHOP_POLICY = {
  /** Printful's stated average fulfillment (production) time, in business days. */
  handling: { min: 2, max: 5 },
  /** US transit after fulfillment, in business days, by shipping method. */
  transitStandard: { min: 3, max: 4 },
  transitExpress: { min: 1, max: 3 },
  /** Window to report damaged/defective items or lost packages, in days. */
  returnWindowDays: 30,
  lastVerified: '2026-10-17',
  sources: {
    shipping: 'https://www.printful.com/shipping',
    returns:
      'https://help.printful.com/hc/en-us/articles/15046135557660-What-s-the-return-policy-for-my-customers',
  },
} as const

export const SHIPPING_RETURNS_PATH = '/shop/shipping-returns'

export function businessDays(r: { min: number; max: number }): string {
  return `${r.min}–${r.max} business days`
}
