import type { ContentPage } from '@/types/content'
import { SITE_URL, SITE_NAME } from '@/lib/site-config'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
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
