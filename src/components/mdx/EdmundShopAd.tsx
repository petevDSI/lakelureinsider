'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SHOP_PRODUCTS, type ShopProductKey } from '@/data/shop'

/**
 * Rotating "From the Shop" ad. Click-through goes to /shop (with the matching
 * category anchor) and carries UTM tags so analytics can show which slogan
 * earns clicks. Images and prices come from src/data/shop.ts so they never
 * drift from the shop page.
 */

interface AdSlide {
  id: string
  productKey: ShopProductKey
  kicker: string
  headline: string
  sub: string
  cta: string
  anchor: string
}

const SLIDES: AdSlide[] = [
  {
    id: 'dam-100',
    productKey: 'goat-float-tee',
    kicker: '100 Dam Years · 1926–2026',
    headline: "Happy 100th, Dam. You don't look a day over 99.",
    sub: 'The centennial collection: Edmund floating in front of the dam, because a century deserves an inner tube.',
    cta: 'Shop 100 Dam Years',
    anchor: '100-dam-years',
  },
  {
    id: 'mayor-tee',
    productKey: 'edmund-for-mayor-tee',
    kicker: 'Edmund for Mayor',
    headline: 'A goat we can all get behind.',
    sub: 'The official campaign tee. Zero promises, zero pasture-barrel spending.',
    cta: 'Shop the campaign tee',
    anchor: 'tees',
  },
  {
    id: 'lake-life',
    productKey: 'lake-life-goat-life-tee',
    kicker: 'Lake Life. Goat Life.',
    headline: 'I cross rivers. I ignore fences. I do what I want.',
    sub: "The heavyweight tee with Edmund's full mission statement on the back.",
    cta: 'Get the heavyweight tee',
    anchor: 'tees',
  },
  {
    id: 'hoodie',
    productKey: 'chimney-rock-escape-hoodie',
    kicker: 'Chimney Rock Escape Artist',
    headline: 'If they chase me, I run faster.',
    sub: 'The hoodie for everyone who has ever followed #FreeEdmund.',
    cta: 'Grab the hoodie',
    anchor: 'hoodie-tank',
  },
  {
    id: 'hats',
    productKey: 'dont-fence-me-in-hat',
    kicker: 'Dad hats, goat-approved',
    headline: "Don't Fence Me In.",
    sub: 'Embroidered Edmund hats. Fits dads, non-dads, and fugitive goats.',
    cta: 'Shop hats',
    anchor: 'hats',
  },
  {
    id: 'stickers',
    productKey: 'holographic-edmund-for-mayor-sticker',
    kicker: 'Stickers, magnets & pins',
    headline: 'Stick with Edmund.',
    sub: 'Holographic goat. Fridge goat. Bumper goat. Pocket-money prices.',
    cta: 'Shop the small stuff',
    anchor: 'stickers',
  },
]

function adHref(slide: AdSlide, medium: string) {
  const qs = new URLSearchParams({
    utm_source: 'lakelureinsider',
    utm_medium: medium,
    utm_campaign: 'fall_2026_merch',
    utm_content: slide.id,
  }).toString()
  return `/shop?${qs}#${slide.anchor}`
}

interface EdmundShopAdProps {
  /** 'banner' = wide horizontal unit; 'rail' = tall narrow unit for a page gutter. */
  variant?: 'banner' | 'rail'
  /** Picks the starting slide so different stories open on different products. */
  seed?: number
}

export function EdmundShopAd({ variant = 'banner', seed = 0 }: EdmundShopAdProps) {
  const rail = variant === 'rail'
  const [index, setIndex] = useState(seed % SLIDES.length)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduceMotion) return
    const timer = setInterval(() => setIndex((n) => (n + 1) % SLIDES.length), 6000)
    return () => clearInterval(timer)
  }, [paused])

  const slide = SLIDES[index]
  const product = SHOP_PRODUCTS[slide.productKey]

  return (
    <aside
      aria-label="Advertisement from the Lake Lure Insider shop"
      className={`not-prose relative overflow-hidden rounded-2xl border-2 border-(--forest) bg-(--paper) shadow-sm ${
        rail ? 'my-6 xl:sticky xl:top-24 xl:my-0' : 'my-8'
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="absolute left-0 top-0 z-10 rounded-br-xl bg-(--forest) px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
        {rail ? 'From the Shop · Ad' : 'From the Shop · Sponsored by us'}
      </span>

      <a
        href={adHref(slide, rail ? 'news_gutter' : 'news_banner')}
        data-ad-slide={slide.id}
        className={
          rail
            ? 'flex flex-col items-center gap-3 px-3 pb-3 pt-9 text-center no-underline'
            : 'flex flex-col items-center gap-5 px-5 pb-4 pt-10 text-center no-underline sm:flex-row sm:text-left'
        }
      >
        <Image
          src={product.image.src}
          alt={product.image.alt}
          width={rail ? 240 : 160}
          height={rail ? 240 : 160}
          sizes={rail ? '(min-width: 1280px) 180px, 240px' : '160px'}
          className={`flex-none rounded-xl bg-(--sand) object-cover ${
            rail ? 'aspect-square w-full max-w-60' : 'h-40 w-40'
          }`}
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-(--clay)">{slide.kicker}</p>
          <p
            className={`mt-1 font-display font-bold leading-tight text-(--forest) ${
              rail ? 'text-lg' : 'text-2xl'
            }`}
          >
            {slide.headline}
          </p>
          <p className={`mt-1 text-(--ink)/80 ${rail ? 'text-xs' : 'text-sm'}`}>{slide.sub}</p>
          <span
            className={`mt-3 flex flex-wrap items-center justify-center gap-3 ${
              rail ? '' : 'sm:justify-start'
            }`}
          >
            <span className="text-sm font-bold text-(--ink)">{product.priceFrom}</span>
            <span className="rounded-full bg-(--clay) px-4 py-2 text-sm font-bold text-white">
              {slide.cta} →
            </span>
          </span>
        </div>
      </a>

      <div role="tablist" aria-label="Choose an ad" className="flex justify-center gap-2 pb-2">
        {SLIDES.map((s, n) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={n === index}
            aria-label={`Show ad ${n + 1}`}
            onClick={() => setIndex(n)}
            className={`h-2.5 w-2.5 rounded-full ${n === index ? 'bg-(--forest)' : 'bg-(--sand)'}`}
          />
        ))}
      </div>

      <p className="px-4 pb-3 text-center text-[11px] text-(--ink)/60">
        Official Edmund merch. Edmund is a goat and not a registered candidate.
      </p>
    </aside>
  )
}
