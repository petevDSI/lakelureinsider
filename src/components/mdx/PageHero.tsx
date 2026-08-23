import Image from 'next/image'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface PageHeroProps {
  title: string
  subhead?: string
  imageSrc: string
  imageAlt: string
  breadcrumbs?: BreadcrumbItem[]
  photoCredit?: string
}

export function PageHero({
  title,
  subhead,
  imageSrc,
  imageAlt,
  breadcrumbs,
  photoCredit,
}: PageHeroProps) {
  return (
    /*
     * full-bleed: escapes the article's px-page + max-w container to span 100vw.
     * bg-(--forest): opaque fallback — text remains readable if the image is
     * missing, slow to load, or fails entirely. Acceptance criterion: delete all
     * images; hero must still be legible.
     */
    <div className="full-bleed relative h-[60vh] min-h-[340px] overflow-hidden bg-(--forest)">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Bottom scrim — keeps title readable over bright images */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      {/* Top scrim — keeps breadcrumbs readable */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="absolute left-0 right-0 top-0 px-page pt-5"
        >
          <ol className="flex flex-wrap items-center gap-1 text-xs text-white/90">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-white underline underline-offset-2">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title block */}
      <div className="absolute bottom-0 left-0 right-0 px-page pb-8">
        <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subhead && (
          <p className="mt-2 text-base text-white/85 sm:text-lg">{subhead}</p>
        )}
      </div>

      {photoCredit && (
        <p className="absolute bottom-3 right-4 text-[10px] text-white/50">
          {photoCredit}
        </p>
      )}
    </div>
  )
}
