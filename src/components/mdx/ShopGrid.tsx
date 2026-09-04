import { SHOP_CATEGORIES } from '@/data/shop'
import { ShopProductCard } from './ShopProductCard'

export function ShopGrid() {
  return (
    <div className="not-prose my-8">
      <nav
        aria-label="Shop categories"
        className="mb-10 flex flex-wrap justify-center gap-2 border-b border-(--sand) pb-6"
      >
        {SHOP_CATEGORIES.map((category) => (
          <a
            key={category.slug}
            href={`#${category.slug}`}
            className="rounded-full border border-(--sand) px-4 py-1.5 text-sm font-semibold text-(--forest) transition-colors hover:border-(--lake) hover:bg-(--lake)/10 hover:text-(--lake)"
          >
            {category.label}
          </a>
        ))}
      </nav>

      {SHOP_CATEGORIES.map((category) => (
        <section key={category.slug} id={category.slug} className="mb-14 scroll-mt-24 last:mb-0">
          <h2 className="font-display text-2xl font-bold text-(--forest)">{category.label}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.productKeys.map((key) => (
              <ShopProductCard key={key} productKey={key} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
