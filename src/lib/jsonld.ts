import type { ContentPage } from '@/types/content'
import { SITE_URL, SITE_NAME } from '@/lib/site-config'
import { SHOP_CATEGORIES, SHOP_PRODUCTS, type ShopProduct } from '@/data/shop'

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

function shopProductJsonLd(key: string, product: ShopProduct) {
  const url = `${SITE_URL}/shop#${key}`
  const low = parseLowPrice(product.priceFrom)

  const offerCommon = {
    priceCurrency: 'USD',
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
