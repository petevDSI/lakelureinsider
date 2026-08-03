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
    <div className="relative h-[60vh] min-h-[340px] w-full overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Gradient scrim — bottom-heavy so text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Breadcrumbs — above the title at the top */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="absolute left-0 right-0 top-0 px-6 pt-5"
        >
          <ol className="flex flex-wrap items-center gap-1 text-xs text-white/80">
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

      {/* Title block at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
        <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subhead && (
          <p className="mt-2 text-base text-white/80 sm:text-lg">{subhead}</p>
        )}
      </div>

      {/* Photo credit */}
      {photoCredit && (
        <p className="absolute bottom-3 right-4 text-[10px] text-white/50">
          {photoCredit}
        </p>
      )}
    </div>
  )
}
