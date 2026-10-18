import type { ContentPage } from '@/types/content'
import { SITE_URL, SITE_NAME } from '@/lib/site-config'
import { SHOP_CATEGORIES, SHOP_PRODUCTS, type ShopProduct, type ShopProductKey } from '@/data/shop'
import { getCatalogProduct } from '@/lib/shop-catalog'
import { SHOP_POLICY, SHIPPING_RETURNS_PATH } from '@/data/shop-policy'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description:
      'Local insider travel guide for Lake Lure and Chimney Rock, NC.',
  }
}

export function breadcrumbJsonLd(page: ContentPage) {
  const segments = page.slug ? page.slug.split('/') : []
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
  ]
  let accumulated = ''
  segments.forEach((seg, i) => {
    accumulated += (accumulated ? '/' : '') + seg
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: seg
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      item: `${SITE_URL}/${accumulated}`,
    })
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
}

/** Pulls the lowest price out of a display string like "From $22.50" or "$18.50". */
function parseLowPrice(priceFrom: string): number | null {
  const match = priceFrom.match(/\$(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : null
}

/**
 * US-only shipping with Printful's stated handling and standard transit times.
 * shippingRate is intentionally omitted: the rate is calculated at checkout.
 */
function shippingDetailsJsonLd() {
  const range = (r: { min: number; max: number }) => ({
    '@type': 'QuantitativeValue',
    minValue: r.min,
    maxValue: r.max,
    unitCode: 'DAY',
  })
  return {
    '@type': 'OfferShippingDetails',
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: range(SHOP_POLICY.handling),
      transitTime: range(SHOP_POLICY.transitStandard),
    },
  }
}

/**
 * Printful's customer terms: damaged/defective items and lost packages are covered
 * within 30 days; size/color/change-of-mind returns are not accepted. The schema
 * cannot express "defects only", so the full terms are linked via merchantReturnLink.
 */
function returnPolicyJsonLd() {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'US',
    returnPolicyCountry: 'US',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: SHOP_POLICY.returnWindowDays,
    merchantReturnLink: `${SITE_URL}${SHIPPING_RETURNS_PATH}`,
  }
}

/** Number of purchasable variants (size/color combos) from the Shopify catalog snapshot. */
function variantCount(key: string): number {
  const catalog = getCatalogProduct(key as ShopProductKey)
  return catalog && catalog.variants.length > 0 ? catalog.variants.length : 1
}

function shopProductJsonLd(key: string, product: ShopProduct) {
  // Each product's canonical page lives at /products/<key>; /shop and the apparel
  // page reference the same entity (same @id) so the markup never conflicts.
  const url = `${SITE_URL}/products/${key}`
  const low = parseLowPrice(product.priceFrom)

  const offerCommon = {
    priceCurrency: 'USD',
    shippingDetails: shippingDetailsJsonLd(),
    hasMerchantReturnPolicy: returnPolicyJsonLd(),
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    url,
    seller: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
  // One price -> a plain Offer; a range across sizes/colors -> AggregateOffer.
  const offers =
    low === null
      ? undefined
      : product.priceHigh > low
        ? {
            '@type': 'AggregateOffer',
            lowPrice: low.toFixed(2),
            highPrice: product.priceHigh.toFixed(2),
            offerCount: variantCount(key),
            ...offerCommon,
          }
        : { '@type': 'Offer', price: low.toFixed(2), ...offerCommon }

  const images = [product.image, ...(product.backImage ? [product.backImage] : [])]

  return {
    '@type': 'Product',
    '@id': url,
    url,
    name: product.title,
    description: `${product.title} — ${product.blurb}`,
    image: images.map((img) => ({
      '@type': 'ImageObject',
      url: img.src,
      caption: img.alt,
    })),
    brand: { '@type': 'Brand', name: SITE_NAME },
    ...(offers ? { offers } : {}),
  }
}

/** Product + BreadcrumbList JSON-LD for a /products/<key> page. */
export function productPageJsonLd(key: keyof typeof SHOP_PRODUCTS) {
  const product = SHOP_PRODUCTS[key]
  const category = SHOP_CATEGORIES.find((c) => c.productKeys.includes(key))
  return [
    { '@context': 'https://schema.org', ...shopProductJsonLd(key, product) },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE_URL}/shop` },
        ...(category
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: category.label,
                item: `${SITE_URL}/shop#${category.slug}`,
              },
            ]
          : []),
        {
          '@type': 'ListItem',
          position: category ? 4 : 3,
          name: product.title,
          item: `${SITE_URL}/products/${key}`,
        },
      ],
    },
  ]
}

/** Shop categories that count as wearable apparel (tees, sweatshirts, hoodies, hats). */
export const APPAREL_CATEGORY_SLUGS = ['100-dam-years', 'tees', 'hats', 'hoodie-tank']

/**
 * schema.org CollectionPage + ItemList for /shop/lake-lure-apparel. Reuses the
 * same Product entities (same @id) as /shop so the two pages describe each
 * item identically; only the wearable categories are listed here.
 */
export function apparelCollectionJsonLd() {
  const keys = SHOP_CATEGORIES.filter((category) =>
    APPAREL_CATEGORY_SLUGS.includes(category.slug),
  ).flatMap((category) => category.productKeys)
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Lake Lure Apparel & Shirts',
    url: `${SITE_URL}/shop/lake-lure-apparel`,
    description:
      'Lake Lure shirts, long sleeves, sweatshirts, hoodies, and hats from Lake Lure Insider: the 100 Dam Years centennial collection and the Edmund the goat designs, printed to order.',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: keys.length,
      itemListElement: keys.map((key, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: shopProductJsonLd(key, SHOP_PRODUCTS[key]),
      })),
    },
  }
}

/**
 * schema.org CollectionPage + ItemList of every product on /shop, generated
 * from SHOP_PRODUCTS so the markup can't drift from the page's product cards.
 */
export function shopCollectionJsonLd() {
  const keys = SHOP_CATEGORIES.flatMap((category) => category.productKeys)
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${SITE_NAME} Shop`,
    url: `${SITE_URL}/shop`,
    description:
      'Lake Lure Insider merch: 100 Dam Years centennial tees and sweatshirts for the Lake Lure Dam\'s 100th birthday, plus Edmund for Mayor tees, hats, hoodies, stickers, magnets, and pins.',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: keys.length,
      itemListElement: keys.map((key, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: shopProductJsonLd(key, SHOP_PRODUCTS[key]),
      })),
    },
  }
}
