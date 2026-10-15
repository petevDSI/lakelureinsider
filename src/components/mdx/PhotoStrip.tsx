import Image from 'next/image'

interface StripPhoto {
  src: string
  alt: string
  credit?: string
}

interface PhotoStripProps {
  photos: StripPhoto[]
}

const U = (id: string) =>
  id.startsWith('http')
    ? id
    : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`

export function PhotoStrip({ photos }: PhotoStripProps) {
  if (!photos?.length) return null
  return (
    <figure className="not-prose my-8">
      <div
        className={`grid gap-2 sm:gap-3 ${
          photos.length >= 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'
        }`}
      >
        {photos.map((p, i) => (
          <div
            key={p.src}
            className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-(--sand) ${
              photos.length === 3 && i === 0 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <Image
              src={U(p.src)}
              alt={p.alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-xs text-(--ink)/55">
        Stock photos:{' '}
        {photos
          .filter((p) => p.credit)
          .map((p) => p.credit)
          .join(' · ')}{' '}
        / Unsplash
      </figcaption>
    </figure>
  )
}
