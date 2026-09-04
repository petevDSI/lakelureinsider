import { SHOP_PRODUCTS, type ShopProduct, type ShopProductKey } from '@/data/shop'
import { ShopEmbed } from './ShopEmbed'

interface ShopProductCardProps {
  productKey: ShopProductKey
}

export function ShopProductCard({ productKey }: ShopProductCardProps) {
  const product: ShopProduct | undefined = SHOP_PRODUCTS[productKey]
  if (!product) return null

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-(--sand) bg-white transition-shadow hover:shadow-lg">
      <div className="relative h-56 w-full overflow-hidden bg-(--sand)/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image.src}
          alt={product.image.alt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover ${
            product.backImage ? 'transition-opacity duration-300 group-hover:opacity-0' : ''
          }`}
        />
        {product.backImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.backImage.src}
            alt={product.backImage.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        {product.backImage && (
          <span className="absolute bottom-2 right-2 rounded-full bg-(--ink)/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Hover for back
          </span>
        )}
      </div>
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
