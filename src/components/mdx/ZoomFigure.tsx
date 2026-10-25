'use client'

import { useEffect, useState } from 'react'

interface ZoomFigureProps {
  src: string
  alt: string
  caption: string
}

/**
 * Figure with click-to-enlarge. Opens a full-screen viewer: the image first fits the
 * screen; click/tap it (or use the +/- buttons) to zoom to full resolution and scroll
 * around. Close with the X, a click on the dark backdrop, or Escape.
 */
export function ZoomFigure({ src, alt, caption }: ZoomFigureProps) {
  const [open, setOpen] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  function close() {
    setOpen(false)
    setZoomed(false)
  }

  return (
    <figure className="not-prose my-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in"
        aria-label={`View larger: ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static concept maps, full-resolution file is the zoom source */}
        <img src={src} alt={alt} className="w-full rounded-xl border border-(--sand)" />
        <span className="absolute bottom-2 right-2 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">
          Tap to enlarge
        </span>
      </button>
      <figcaption className="mt-2 text-[11px] text-(--ink)/60">{caption}</figcaption>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div
            className={`h-full w-full ${zoomed ? 'overflow-auto' : 'flex items-center justify-center overflow-hidden'}`}
            onClick={close}
            style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              onClick={(e) => {
                e.stopPropagation()
                setZoomed((z) => !z)
              }}
              className={
                zoomed
                  ? 'max-w-none cursor-zoom-out'
                  : 'max-h-[92vh] max-w-[96vw] cursor-zoom-in object-contain'
              }
              style={zoomed ? { width: 'max(250vw, 2400px)' } : undefined}
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <p className="pointer-events-auto max-w-[70vw] rounded bg-black/60 px-3 py-1.5 text-xs text-white">
              {zoomed ? 'Tap the image to zoom out. Drag to look around.' : 'Tap the image to zoom in.'} {caption}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close enlarged image"
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl leading-none text-white hover:bg-white/30"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </figure>
  )
}
