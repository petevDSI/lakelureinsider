'use client'

import { useEffect, useState } from 'react'
import type { ShopProductImage as ShopProductImageData } from '@/data/shop'

interface ShopProductImageProps {
  image: ShopProductImageData
  backImage?: ShopProductImageData
}

// The product card's image tile: hover crossfades from front to back (pure
// CSS, driven by the card's own `.group` ancestor — see ShopProductCard),
// and clicking opens a full-screen lightbox with the front (and back, if
// there is one) shown large. Same minimal self-built lightbox pattern as
// src/components/EnlargeableImage.tsx, extended to handle a front/back pair.
export function ShopProductImage({ image, backImage }: ShopProductImageProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger image — ${image.alt}`}
        className="relative block h-56 w-full cursor-zoom-in overflow-hidden bg-(--sand)/20"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- external Shopify CDN images */}
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover ${
            backImage ? 'transition-opacity duration-300 group-hover:opacity-0' : ''
          }`}
        />
        {backImage && (
          // eslint-disable-next-line @next/next/no-img-element -- external Shopify CDN images
          <img
            src={backImage.src}
            alt={backImage.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        {backImage && (
          <span className="absolute bottom-2 left-2 rounded-full bg-(--ink)/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Hover for back
          </span>
        )}
        <span className="absolute bottom-2 right-2 rounded-full bg-(--ink)/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 transition-opacity group-hover:opacity-100">
          Click to enlarge
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close larger image"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition-colors hover:bg-white/20"
          >
            ×
          </button>
          <div
            className="flex max-h-[85vh] max-w-[92vw] flex-row flex-wrap items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <figure className="m-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- external Shopify CDN images */}
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-[80vh] max-w-[88vw] rounded-lg object-contain shadow-2xl sm:max-w-[44vw]"
              />
              {backImage && (
                <figcaption className="mt-2 text-center text-sm text-white/70">Front</figcaption>
              )}
            </figure>
            {backImage && (
              <figure className="m-0">
                {/* eslint-disable-next-line @next/next/no-img-element -- external Shopify CDN images */}
                <img
                  src={backImage.src}
                  alt={backImage.alt}
                  className="max-h-[80vh] max-w-[88vw] rounded-lg object-contain shadow-2xl sm:max-w-[44vw]"
                />
                <figcaption className="mt-2 text-center text-sm text-white/70">Back</figcaption>
              </figure>
            )}
          </div>
        </div>
      )}
    </>
  )
}
