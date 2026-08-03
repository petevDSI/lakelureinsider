import type { Metadata } from 'next'
import Link from 'next/link'
import { CardGrid } from '@/components/mdx/CardGrid'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Lake Lure Insider — Local Guide to Lake Lure & Chimney Rock, NC',
  description:
    'Insider tips, hours, tickets, and things to do at Lake Lure and Chimney Rock, NC. Plan your perfect mountain getaway.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Lake Lure Insider — Local Guide to Lake Lure & Chimney Rock, NC',
    description:
      'Insider tips, hours, tickets, and things to do at Lake Lure and Chimney Rock, NC.',
    url: SITE_URL,
    type: 'website',
  },
}

const FEATURED_CARDS = [
  {
    href: '/chimney-rock',
    title: 'Chimney Rock State Park',
    description:
      'Tickets, hours, trail guides, and insider tips for one of the most dramatic natural features in the Blue Ridge Mountains.',
    imageSrc: '/images/placeholder-chimney-rock.jpg',
    imageAlt: 'Chimney Rock rising above the Hickory Nut Gorge',
    category: 'Chimney Rock',
  },
  {
    href: '/lake-lure',
    title: 'Lake Lure',
    description:
      'Boat rentals, beach access, watersports, and the best spots on this stunning mountain lake.',
    imageSrc: '/images/placeholder-lake-lure.jpg',
    imageAlt: 'Lake Lure surrounded by Blue Ridge mountains',
    category: 'Lake Lure',
  },
  {
    href: '/where-to-stay',
    title: 'Where to Stay',
    description:
      'Lakefront cabins, historic inns, and mountain lodges — the best places to stay near Lake Lure.',
    imageSrc: '/images/placeholder-lodging.jpg',
    imageAlt: 'Cabin on the lakefront at Lake Lure',
    category: 'Lodging',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end bg-[--forest] px-4 pb-16 pt-24 sm:px-6">
        <div className="relative mx-auto max-w-3xl text-white">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/70">
            Your local insider guide
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Lake Lure &amp;
            <br />
            Chimney Rock, NC
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Real tips from someone who knows the area — not a tourism brochure.
            Hours, tickets, hidden gems, and the best way to spend your time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/trip-planning"
              className="rounded-md bg-[--clay] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Plan Your Trip
            </Link>
            <Link
              href="/chimney-rock"
              className="rounded-md border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Chimney Rock Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[--lake]">
          Start Here
        </p>
        <h2 className="mb-8 font-display text-3xl font-bold text-[--forest]">
          Explore the Area
        </h2>
        <CardGrid cards={FEATURED_CARDS} feature />
      </section>

      {/* Quick nav clusters */}
      <section className="bg-[--sand] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[--lake]">
            Find What You Need
          </p>
          <h2 className="mb-8 font-display text-2xl font-bold text-[--forest]">
            Browse by Topic
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'Lake Lure', href: '/lake-lure' },
              { label: 'Chimney Rock', href: '/chimney-rock' },
              { label: 'Things to Do', href: '/things-to-do' },
              { label: 'Where to Stay', href: '/where-to-stay' },
              { label: 'Trip Planning', href: '/trip-planning' },
              { label: 'Insider Tips', href: '/insider-tips' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center rounded-xl bg-white px-3 py-5 text-center text-sm font-semibold text-[--forest] shadow-sm transition-shadow hover:shadow-md"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
