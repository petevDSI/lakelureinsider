import Image from 'next/image'
import type { ReactNode } from 'react'

interface FeaturedStayPhoto {
  src: string
  alt: string
}

interface FeaturedStayProps {
  name: string
  tagline: string
  photos: FeaturedStayPhoto[]
  specs: string[]
  airbnbUrl: string
  airbnbRating?: string
  vrboUrl: string
  vrboRating?: string
  children: ReactNode
}

export function FeaturedStay({
  name,
  tagline,
  photos,
  specs,
  airbnbUrl,
  airbnbRating,
  vrboUrl,
  vrboRating,
  children,
}: FeaturedStayProps) {
  return (
    <div className="not-prose my-10 overflow-hidden rounded-xl border border-(--sand) bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-0.5 bg-(--sand) sm:grid-cols-4">
        {photos.map((photo, i) => (
          <div key={photo.src} className={`relative h-40 sm:h-48 ${i === 0 ? 'col-span-2 row-span-2 h-full sm:col-span-2' : ''}`}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        <span className="mb-2 inline-block rounded-full bg-(--sand) px-3 py-1 text-xs font-semibold uppercase tracking-widest text-(--forest)">
          Featured Stay
        </span>
        <h3 className="font-display text-2xl font-bold text-(--ink)">{name}</h3>
        <p className="mt-1 text-sm text-(--ink)/70">{tagline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {specs.map((spec) => (
            <span
              key={spec}
              className="rounded-full border border-(--sand) px-3 py-1 text-xs font-medium text-(--ink)/80"
            >
              {spec}
            </span>
          ))}
        </div>

        <div className="prose prose-sm mt-5 max-w-none text-(--ink)/85">{children}</div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-(--clay) px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View on Airbnb{airbnbRating ? ` — ${airbnbRating}` : ''}
          </a>
          <a
            href={vrboUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-(--lake) px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View on Vrbo{vrboRating ? ` — ${vrboRating}` : ''}
          </a>
        </div>
      </div>
    </div>
  )
}
