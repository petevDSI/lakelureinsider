import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SHOP_CATEGORIES, SHOP_PRODUCTS, type ShopProduct } from '@/data/shop'
import { SITE_URL } from '@/lib/site-config'
import { productPageJsonLd } from '@/lib/jsonld'
import {
  CATEGORY_LABELS,
  allProductKeys,
  colorImages,
  colorsOf,
  getCatalogProduct,
  isProductKey,
  priceBySize,
} from '@/lib/shop-catalog'
import { ShopEmbed } from '@/components/mdx/ShopEmbed'

export async function generateStaticParams() {
  return allProductKeys().map((slug) => ({ slug }))
}

/** First sentence of the blurb, trimmed so the meta description stays under ~160 characters. */
function metaDescription(title: string, blurb: string): string {
  const first = blurb.split(/(?<=[.!?])\s/)[0] ?? blurb
  const text = `${title} from the Lake Lure Insider shop. ${first}`
  return text.length <= 158 ? text : `${text.slice(0, 157).trimEnd()}…`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!isProductKey(slug)) return {}
  const product = SHOP_PRODUCTS[slug]
  const canonical = `${SITE_URL}/products/${slug}`
  const description = metaDescription(product.title, product.blurb)

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: product.image.src, alt: product.image.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: [product.image.src],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!isProductKey(slug)) notFound()

  const product: ShopProduct = SHOP_PRODUCTS[slug]
  const catalog = getCatalogProduct(slug)
  const category = SHOP_CATEGORIES.find((c) => c.productKeys.includes(slug))
  const related = (category?.productKeys ?? []).filter((k) => k !== slug).slice(0, 3)
  const colors = catalog ? colorsOf(catalog) : []
  const swatches = catalog ? colorImages(catalog) : []
  const sizePrices = catalog ? priceBySize(catalog) : []
  const isCentennial = product.category === '100-dam-years'
  const jsonLd = productPageJsonLd(slug)

  return (
    <>
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, '\\u003c') }}
        />
      ))}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-(--ink)/60">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-(--lake) hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="hover:text-(--lake) hover:underline">
                Shop
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/shop#${category.slug}`}
                    className="hover:text-(--lake) hover:underline"
                  >
                    {category.label}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- external Shopify CDN images */}
            <img
              src={product.image.src}
              alt={product.image.alt}
              className="w-full rounded-xl border border-(--sand) bg-(--sand)/20 object-cover"
            />
            {product.backImage && (
              // eslint-disable-next-line @next/next/no-img-element -- external Shopify CDN images
              <img
                src={product.backImage.src}
                alt={product.backImage.alt}
                loading="lazy"
                className="w-full rounded-xl border border-(--sand) bg-(--sand)/20 object-cover"
              />
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-(--lake)">
              {CATEGORY_LABELS[product.category]}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-(--forest) sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-xl font-bold text-(--forest)">{product.priceFrom}</span>
              <span className="text-sm text-(--ink)/60">{product.variantNote}</span>
            </p>
            <p className="mt-4 leading-relaxed text-(--ink)/80">{product.blurb}</p>

            {product.story && (
              <p className="mt-3">
                <Link
                  href={product.story.href}
                  className="font-semibold text-(--lake) underline"
                >
                  {product.story.label} →
                </Link>
              </p>
            )}

            <div className="mt-6 rounded-xl border border-(--sand) bg-white p-4">
              <ShopEmbed productKey={slug} />
            </div>

            {isCentennial && (
              <p className="mt-4 text-sm text-(--ink)/60">
                Centennial items are unofficial and not affiliated with the Town of Lake Lure.
              </p>
            )}
            <p className="mt-4 text-sm text-(--ink)/60">
              Printed to order by Printful and shipped within the USA. Shipping is calculated at
              checkout.{' '}
              <Link href="/shop/shipping-returns" className="font-semibold text-(--lake) underline">
                Shipping &amp; returns
              </Link>
            </p>
          </div>
        </div>

        {catalog && (
          <section
            aria-label="About this item"
            className="prose mt-12 max-w-3xl [&_hr]:my-6 [&_hr]:border-(--sand) [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-(--sand) [&_td]:px-2 [&_td]:py-1.5 [&_tr:nth-child(even)]:bg-(--sand)/30"
          >
            <h2 className="!mt-0">About this design</h2>
            <div dangerouslySetInnerHTML={{ __html: catalog.descriptionHtml }} />
          </section>
        )}

        {(sizePrices.length > 0 || colors.length > 0) && (
          <section aria-label="Sizes, colors and pricing" className="mt-12 max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-(--forest)">
              Sizes, colors and pricing
            </h2>
            {sizePrices.length > 0 && (
              <table className="mt-4 w-full max-w-md border-collapse text-sm">
                <thead>
                  <tr className="text-left text-(--ink)/60">
                    <th className="border-b border-(--sand) py-2 pr-4 font-semibold">Size</th>
                    <th className="border-b border-(--sand) py-2 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {sizePrices.map((row) => (
                    <tr key={row.sizes}>
                      <td className="border-b border-(--sand) py-2 pr-4">{row.sizes}</td>
                      <td className="border-b border-(--sand) py-2 font-semibold text-(--forest)">
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {swatches.length > 0 && (
              <>
                <h3 className="mt-8 font-display text-lg font-bold text-(--forest)">
                  Available colors ({colors.length})
                </h3>
                <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {swatches.map(({ color, image }) => (
                    <li key={color} className="text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element -- external Shopify CDN images */}
                      <img
                        src={`${image}${image.includes('?') ? '&' : '?'}width=240`}
                        alt={`${product.title} in ${color}`}
                        loading="lazy"
                        width={240}
                        className="aspect-square w-full rounded-lg border border-(--sand) bg-(--sand)/20 object-cover"
                      />
                      <span className="mt-1 block text-xs text-(--ink)/70">{color}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}

        {related.length > 0 && (
          <section aria-label="More from this collection" className="mt-14 border-t border-(--sand) pt-8">
            <h2 className="font-display text-2xl font-bold text-(--forest)">
              More {category?.label.toLowerCase()}
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((key) => (
                <li key={key}>
                  <Link
                    href={`/products/${key}`}
                    className="block rounded-xl border border-(--sand) bg-white p-3 transition-shadow hover:shadow-lg"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- external Shopify CDN images */}
                    <img
                      src={SHOP_PRODUCTS[key].image.src}
                      alt={SHOP_PRODUCTS[key].image.alt}
                      loading="lazy"
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                    <span className="mt-2 block font-display font-bold text-(--ink)">
                      {SHOP_PRODUCTS[key].title}
                    </span>
                    <span className="text-sm text-(--ink)/70">{SHOP_PRODUCTS[key].priceFrom}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <Link href="/shop" className="font-semibold text-(--lake) underline">
                See the full shop
              </Link>
              {' · '}
              <Link href="/shop/lake-lure-apparel" className="font-semibold text-(--lake) underline">
                Lake Lure apparel &amp; shirts
              </Link>
            </p>
          </section>
        )}
      </div>
    </>
  )
}
