import type { Metadata } from 'next'
import Link from 'next/link'
import { Permanent_Marker, Kalam, Source_Serif_4, Libre_Franklin } from 'next/font/google'
import { EnlargeableImage } from '@/components/EnlargeableImage'
import { ComicsSignupForm } from '@/components/ComicsSignupForm'
import { SITE_URL } from '@/lib/site-config'

const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
})

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '600', '700'],
})

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  weight: ['500', '700'],
})

const PAGE_DESCRIPTION =
  '"State of the Herd," a new weekly comic strip about Lake Lure town government, the Lured Market lease fight, and Edmund the goat’s mayoral campaign — Sundays in color, weekdays in black and white.'

export const metadata: Metadata = {
  title: 'State of the Herd — Our New Lake Lure Comic Strip',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/news/comics` },
  openGraph: {
    title: 'State of the Herd — A Lake Lure Insider Comic',
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/news/comics`,
    type: 'website',
    images: [
      {
        url: '/images/comics/tier3-edmund.jpg',
        alt: 'Edmund the goat addressing a crowd on the courthouse lawn, from the "State of the Herd" comic strip',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'State of the Herd — A Lake Lure Insider Comic',
    description: PAGE_DESCRIPTION,
  },
}

interface ComicPanel {
  src: string
  alt: string
}

interface ComicStrip {
  slug: string
  title: string
  byline: string
  date: string
  episode: string
  tagline: string
  panels: ComicPanel[]
  nextWeek?: string
}

const STRIPS: ComicStrip[] = [
  {
    slug: 'state-of-the-herd-ep4',
    title: 'Make Things Right',
    byline: 'by Pete',
    date: 'Wednesday \u00b7 September 9, 2026',
    episode: 'Episode 4 of \u201cBoathouse Fever\u201d',
    tagline: 'So close to an answer, you could almost hear it.',
    panels: [
      {
        src: '/images/comics/ep4-wednesday.jpg',
        alt: 'Four-panel daily strip. Panel 1: three commissioners (the Council Chorus) huddle tightly at the dais. Panel 2: a resident, seen from behind in the audience, asks: \u201cWill you take the deal?\u201d Panel 3: the Council Chorus, in unison: \u201cWe take this matter very seriously.\u201d Panel 4: the Old Guard commissioner leans out of the huddle, starting to say \u201c\u2014three of us already told his wife we\u2014\u201d before another commissioner\u2019s hand pulls him back in. Caption: \u201cAlmost, old-timer. Almost.\u201d',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep3',
    title: 'The Grate',
    byline: 'by Pete',
    date: 'Tuesday \u00b7 September 8, 2026',
    episode: 'Episode 3 of \u201cBoathouse Fever\u201d',
    tagline: 'Now pending. Same as every day.',
    panels: [
      {
        src: '/images/comics/ep3-tuesday.jpg',
        alt: 'Four-panel daily strip. Panel 1: Nell slides an envelope across the Town Hall counter to the Town Manager: \u201cPublic records request. Item 12 of 15.\u201d Panel 2: the Town Manager, stamping it without looking up: \u201cThat\u2019s under legal review.\u201d Panel 3: the envelope slides off the edge of the counter into a dark basement grate. Panel 4: Nell stands with arms crossed, staring at the grate as a muffled voice rises from below: \u201c...pending...\u201d',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep2',
    title: 'Zero for One',
    byline: 'by Pete',
    date: 'Monday \u00b7 September 7, 2026',
    episode: 'Episode 2 of \u201cBoathouse Fever\u201d',
    tagline: 'Now with a round of applause for absolutely nothing.',
    panels: [
      {
        src: '/images/comics/ep2-monday.jpg',
        alt: 'Four-panel daily strip. Panel 1: the Mayor, mid ribbon-cutting smile, at a podium: "Wonderful turnout today for Fall Beautification Week!" Panel 2: Nell, hand raised in the crowd: "About the eviction case\u2014" Panel 3: the Mayor, without missing a beat: "\u2014and let\u2019s give a round of applause to our Parks volunteers!" Panel 4: the crowd applauds behind Nell, who stares flatly ahead, notebook in hand. Caption: "Day one. Zero for one."',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep1',
    title: 'Boathouse Fever, Part One',
    byline: 'by Pete',
    date: 'Sunday · September 6, 2026',
    episode: 'Episode 1 of “Boathouse Fever”',
    tagline: 'Now with 60% more municipal silence.',
    panels: [
      {
        src: '/images/comics/tier1-dock.jpg',
        alt: 'Dawn over Lake Lure. A great blue heron stands on a dock piling as the sun rises. Caption: "Every town has a season. Ours is called Boathouse Fever, and it’s back."',
      },
      {
        src: '/images/comics/tier2-kitchen.jpg',
        alt: 'The Rocky Broad Kitchen at dawn. Delia flips the OPEN sign while Frank holds a hand-lettered "STILL HERE" sign.',
      },
      {
        src: '/images/comics/tier2-townhall.jpg',
        alt: 'Town Hall at night. Dark upper windows, one basement window glowing, a shadowy shape watching from behind the glass.',
      },
      {
        src: '/images/comics/tier2-nell.jpg',
        alt: 'Nell at her desk under a lamp, beside a leaning stack of paper labeled "RECORDS REQUEST — NO REPLY."',
      },
      {
        src: '/images/comics/tier3-edmund.jpg',
        alt: 'Edmund the goat, wearing his red rosette, addresses a small crowd from atop a wooden crate on the courthouse lawn. Speech bubble: "Neighbors. Fellow herd. Vote Edmund — again, still, forever."',
      },
      {
        src: '/images/comics/tier3-heron.jpg',
        alt: 'Throwaway panel: the heron, unbothered, spears a fish from the lake.',
      },
    ],
    nextWeek: 'Someone at Town Hall almost says something on the record.',
  },
]

function ComicPanelImage({ panel }: { panel: ComicPanel }) {
  return (
    <div className="overflow-hidden border-[3px] border-(--ink) bg-(--sand)">
      <EnlargeableImage src={panel.src} alt={panel.alt} className="block h-auto w-full object-cover" />
    </div>
  )
}

function ComicStripCard({ strip, episodeCount }: { strip: ComicStrip; episodeCount: number }) {
  return (
    <div className={`${sourceSerif.className} mx-auto w-full max-w-[1040px]`}>
      <div
        className={`${libreFranklin.className} flex flex-wrap items-baseline justify-between gap-3 border-b border-(--ink)/15 pb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-(--ink)/60`}
      >
        <span>
          Lake Lure Insider <span className="text-(--clay)">— Comics</span>
        </span>
        <span>
          Week One of an ongoing series &middot; {episodeCount} episode{episodeCount === 1 ? '' : 's'} so far
        </span>
      </div>

      <div className="mt-4 border border-(--ink) bg-(--paper) p-3.5 text-(--ink) shadow-[0_1px_2px_rgba(0,0,0,.06),0_18px_40px_-20px_rgba(0,0,0,.35)] sm:p-7">
        {/* Masthead */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-(--ink) pb-3">
          <div>
            <div className={`${libreFranklin.className} mb-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-(--forest)`}>
              A Lake Lure Insider Comic
            </div>
            <div className={`${permanentMarker.className} text-[28px] leading-none text-(--ink) sm:text-[40px]`}>
              State of the Herd
            </div>
            <div className={`${kalam.className} mt-1 text-sm text-(--forest)`}>{strip.tagline}</div>
          </div>
          <div className={`${libreFranklin.className} text-right`}>
            <div className="text-xs font-bold uppercase tracking-[0.1em] text-(--ink)">{strip.date}</div>
            <div className="mt-0.5 text-xs text-(--ink)/55">{strip.episode}</div>
          </div>
        </div>

        {/* Strip title */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
          <h2 className={`${permanentMarker.className} m-0 text-xl sm:text-[26px]`}>{strip.title}</h2>
          <p className={`${kalam.className} m-0 text-sm text-(--ink)/55`}>{strip.byline}</p>
        </div>

        {/* Panels — uniform grid, every panel the same size */}
        <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {strip.panels.map((panel) => (
            <ComicPanelImage key={panel.src} panel={panel} />
          ))}
        </div>

        {/* Credit */}
        <div
          className={`${libreFranklin.className} mt-3 flex flex-wrap items-center justify-between gap-3 border-t-2 border-(--ink) pt-3.5 text-[11px] tracking-wide text-(--forest)`}
        >
          <span>
            <b className="text-(--ink)">Lake Lure Insider</b> &mdash; words: Pete &middot; art: Pete, assisted by AI
          </span>
          <span>lakelureinsider.com</span>
        </div>
      </div>

      {strip.nextWeek && (
        <div className="mt-5 text-center text-sm text-(--ink)/60">
          Next week: <em className="text-(--ink)">{strip.nextWeek}</em>
        </div>
      )}
    </div>
  )
}

export default function ComicsPage() {
  return (
    <>
      <section className="px-page py-14 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-(--clay)">News &middot; Comics</p>
          <h1 className="font-display text-4xl font-bold text-(--forest) sm:text-5xl">
            State of the Herd
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-(--ink)/80">
            Our new weekly comic strip about Lake Lure town government, the fight over Lured Market,
            and the goat everyone keeps voting for.
          </p>
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-(--clay) bg-(--clay)/5 p-5 text-left text-sm text-(--ink)/80">
            <p className="m-0">
              The officials in the strip aren&rsquo;t drawn as any specific real person &mdash;
              the Mayor, the Town Manager, and the Council are composite characters standing in
              for whoever holds that job and does that job&rsquo;s usual talking. The situations
              are pulled from our own reporting below; the faces on the page are not meant to be
              anyone in particular. The art is drawn with AI assistance from Pete&rsquo;s own
              scripts and descriptions.
            </p>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-sm text-(--ink)/60">
            New here? Start with{' '}
            <Link href="/news/lured-market-magistrate-continuance" className="font-semibold text-(--lake) underline">
              the Lured Market coverage
            </Link>{' '}
            the strip is drawn from, or meet the strip&rsquo;s real-life inspiration on{' '}
            <Link href="/edmund-for-mayor" className="font-semibold text-(--lake) underline">
              Edmund&rsquo;s campaign page
            </Link>
            .
          </p>
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-(--ink)/15 bg-(--sand)/30 p-6">
            <p className="mb-3 text-sm font-semibold text-(--forest)">
              Get an email when a new episode posts
            </p>
            <ComicsSignupForm />
          </div>
        </div>
      </section>

      <section className="px-page pb-20">
        <div className="space-y-16">
          {STRIPS.map((strip) => (
            <ComicStripCard key={strip.slug} strip={strip} episodeCount={STRIPS.length} />
          ))}
        </div>
      </section>

      <div className="border-t border-(--ink)/10 bg-(--sand)/30 px-page py-12 text-center">
        <p className="mx-auto max-w-xl text-sm text-(--ink)/70">
          New episodes post as the week&rsquo;s news does. Follow{' '}
          <Link href="/news" className="font-semibold text-(--lake) underline">
            Lake Lure Insider News
          </Link>{' '}
          for the reporting the strip is based on.
        </p>
      </div>
    </>
  )
}
