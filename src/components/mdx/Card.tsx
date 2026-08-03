import Image from 'next/image'
import Link from 'next/link'

export interface CardProps {
  href: string
  title: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  category?: string
  featured?: boolean
}

export function Card({
  href,
  title,
  description,
  imageSrc,
  imageAlt,
  category,
  featured = false,
}: CardProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col overflow-hidden rounded-xl border border-[--sand] bg-white transition-shadow hover:shadow-lg ${
        featured ? 'sm:col-span-2' : ''
      }`}
    >
      {imageSrc && (
        <div className={`relative w-full overflow-hidden ${featured ? 'h-64' : 'h-44'}`}>
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes={featured ? '(min-width: 640px) 66vw, 100vw' : '(min-width: 640px) 33vw, 100vw'}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        {category && (
          <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-[--lake]">
            {category}
          </span>
        )}
        <h3 className="font-display font-bold text-[--ink] group-hover:text-[--lake]">
          {title}
        </h3>
        {description && (
          <p
            className={`mt-2 text-sm leading-relaxed text-[--ink]/70 ${
              featured ? '' : 'line-clamp-3'
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}
