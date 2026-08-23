import type { Metadata } from 'next'
import Image from 'next/image'
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
    href: '/whats-open-now',
    title: "What's Open Now",
    description:
      'Current status for Chimney Rock, Lake Lure, the Flowering Bridge, and roads. Verified August 2026.',
    imageSrc: '/images/lake-lure-things-to-do.jpg',
    imageAlt: 'Illustrated mountain lake landscape with layered ridgelines and blue sky',
    category: 'Current Status',
  },
  {
    href: '/chimney-rock/tickets-and-hours',
    title: 'Chimney Rock State Park',
    description:
      'Tickets, hours, trail guides, and insider tips for one of the most dramatic natural features in the Blue Ridge Mountains.',
    imageSrc: '/images/chimney-rock.jpg',
    imageAlt: 'Chimney Rock viewed from the stairs below, North Carolina',
    category: 'Chimney Rock',
  },
  {
    href: '/lake-lure',
    title: 'Lake Lure',
    description:
      'Boat rentals, beach access, watersports, and the best spots on this stunning mountain lake.',
    imageSrc: '/images/lake-lure.jpg',
    imageAlt: 'American flag flying at a scenic overlook above Lake Lure, NC',
    category: 'Lake Lure',
  },
  {
    href: '/where-to-stay',
    title: 'Where to Stay',
    description:
      'Lakefront cabins, historic inns, and mountain lodges — the best places to stay near Lake Lure.',
    imageSrc: '/images/where-to-stay.jpg',
    imageAlt: 'The historic Lake Lure Inn & Spa with mountains behind',
    category: 'Lodging',
  },
  {
    href: '/weddings',
    title: 'Weddings',
    description:
      'Six Chimney Rock venues from a 404-ft waterfall to a fully accessible pavilion. Lake Lure Inn with its Dirty Dancing ballroom.',
    imageSrc: '/images/weddings-hub.jpg',
    imageAlt: 'Illustrated mountain ridgeline at sunset',
    category: 'Weddings',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero — bg-[--forest] is the opaque fallback if image is missing or slow */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-[--forest] px-page pb-16 pt-24">
        <Image
          src="/images/home.jpg"
          alt="View of Lake Lure from Chimney Rock, NC"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <p className="absolute bottom-3 right-4 text-[10px] text-white/50">
          Photo: Kapil Chalil Madathil (CC BY-SA 3.0)
        </p>
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
              href="/chimney-rock/tickets-and-hours"
              className="rounded-md border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Chimney Rock Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Community advocacy banner */}
      <div className="border-b border-[--sand] bg-[--clay]/10 px-page py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[--forest]">
            The Town of Lake Lure moved to evict Lured Market &amp; Grill. Here&apos;s what the court file actually shows.
          </p>
          <div className="flex shrink-0 gap-3">
            <Link href="/news/lured-market-town-lease-fight" className="text-sm font-semibold text-[--lake] underline-offset-2 hover:underline">
              Read the investigation →
            </Link>
            <Link href="/petition" className="rounded-md bg-[--clay] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              Sign the petition
            </Link>
          </div>
        </div>
      </div>

      {/* What's Open Now status bar */}
      <div className="border-b border-[--sand] bg-white px-page py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[--forest]">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Chimney Rock open · Lake Lure open · Beach open through Sept 7
          </p>
          <Link
            href="/whats-open-now"
            className="shrink-0 text-sm font-semibold text-[--lake] underline-offset-2 hover:underline"
          >
            Full status →
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-page py-16">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[--lake]">
          Start Here
        </p>
        <h2 className="mb-8 font-display text-3xl font-bold text-[--forest]">
          Explore the Area
        </h2>
        <CardGrid cards={FEATURED_CARDS} feature />
      </section>

      {/* Quick nav clusters */}
      <section className="bg-[--sand] py-14">
        <div className="mx-auto max-w-6xl px-page">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[--lake]">
            Find What You Need
          </p>
          <h2 className="mb-8 font-display text-2xl font-bold text-[--forest]">
            Browse by Topic
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {[
              { label: 'Lake Lure', href: '/lake-lure' },
              { label: 'Chimney Rock', href: '/chimney-rock' },
              { label: 'Things to Do', href: '/things-to-do' },
              { label: 'Where to Stay', href: '/where-to-stay' },
              { label: 'Trip Planning', href: '/trip-planning' },
              { label: 'Weddings', href: '/weddings' },
              { label: 'Insider Tips', href: '/insider-tips' },
              { label: 'Town News', href: '/news' },
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
