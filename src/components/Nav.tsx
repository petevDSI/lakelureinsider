import Link from 'next/link'
import { Logo } from './Logo'

const NAV_LINKS = [
  { label: 'Lake Lure', href: '/lake-lure' },
  { label: 'Chimney Rock', href: '/chimney-rock' },
  { label: 'Things to Do', href: '/things-to-do' },
  { label: 'Where to Stay', href: '/where-to-stay' },
  { label: 'Trip Planning', href: '/trip-planning' },
  { label: 'Weddings', href: '/weddings' },
  { label: 'Insider Tips', href: '/insider-tips' },
  { label: 'News', href: '/news' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[--sand] bg-[--paper]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold text-[--forest] sm:text-xl"
        >
          <Logo size={34} />
          <span>Lake Lure Insider</span>
        </Link>

        {/* Mobile: scrollable nav */}
        <nav
          aria-label="Main navigation"
          className="-mx-1 flex items-center gap-0.5 overflow-x-auto scrollbar-none sm:gap-1"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-2 py-1 text-sm font-medium text-[--ink]/80 transition-colors hover:bg-[--sand] hover:text-[--forest] sm:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
