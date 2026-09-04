'use client'

import { useEffect, useState } from 'react'

interface EnlargeableImageProps {
  src: string
  alt: string
  className?: string
}

// Click-to-enlarge thumbnail. No lightbox library on the site yet, so this
// is a minimal self-contained one: click opens a full-screen overlay with
// the same image at a larger size, closable via backdrop click, the X
// button, or Escape.
export function EnlargeableImage({ src, alt, className }: EnlargeableImageProps) {
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
        className="block w-full cursor-zoom-in"
        aria-label={`View larger image — ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- external Shopify CDN images, same pattern as content/shop/index.mdx */}
        <img src={src} alt={alt} className={className} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
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
          {/* eslint-disable-next-line @next/next/no-img-element -- external Shopify CDN images */}
          <img
            src={src}
            alt={alt}
            className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
