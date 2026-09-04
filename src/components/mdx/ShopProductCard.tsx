import { SHOP_PRODUCTS, type ShopProduct, type ShopProductKey } from '@/data/shop'
import { ShopEmbed } from './ShopEmbed'
import { ShopProductImage } from './ShopProductImage'

interface ShopProductCardProps {
  productKey: ShopProductKey
}

export function ShopProductCard({ productKey }: ShopProductCardProps) {
  const product: ShopProduct | undefined = SHOP_PRODUCTS[productKey]
  if (!product) return null

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-(--sand) bg-white transition-shadow hover:shadow-lg">
      <ShopProductImage image={product.image} backImage={product.backImage} />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-(--lake)">
            {product.variantNote}
          </span>
          <span className="whitespace-nowrap text-sm font-bold text-(--forest)">
            {product.priceFrom}
          </span>
        </div>
        <h3 className="font-display font-bold text-(--ink)">{product.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-(--ink)/70">{product.blurb}</p>
        <div className="mt-auto pt-2">
          <ShopEmbed productKey={productKey} />
        </div>
      </div>
    </div>
  )
}
