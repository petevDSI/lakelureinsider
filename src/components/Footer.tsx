import Link from 'next/link'
import { Logo } from './Logo'

const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
  { label: 'Privacy Policy', href: '/privacy' },
]

export function Footer() {
  return (
    <footer className="mt-auto bg-[--forest] text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <p className="font-display text-lg font-bold text-white">
                Lake Lure Insider
              </p>
              <p className="mt-1 text-sm text-white/60">
                Your local guide to Lake Lure &amp; Chimney Rock, NC
              </p>
            </div>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-4">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Lake Lure Insider. All rights reserved.
          Some links on this site are affiliate links —{' '}
          <Link href="/affiliate-disclosure" className="underline hover:text-white/60">
            see our disclosure
          </Link>
          .
        </p>
      </div>
    </footer>
  )
}
