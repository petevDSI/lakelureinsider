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
    slug: 'lake-lure-unrelated-mon-0921',
    title: 'The Original Infrastructure Lobby',
    byline: 'by Pete',
    date: 'Monday \u00b7 September 21, 2026',
    episode: 'Lake Lure, Unrelated',
    tagline: 'The dam\u2019s original contractors, still waiting on a callback.',
    panels: [
      {
        src: '/images/comics/farside-mon-0921.jpg',
        alt: 'A single-panel, black-and-white illustration in a deadpan, Far Side style. Four beavers in undersized hard hats stand in a row along the top of the Lake Lure dam, arms crossed, holding hand-lettered protest signs: \u201cWE BUILT THIS FIRST,\u201d \u201cWHERE\u2019S OUR CUT?\u201d and \u201c$158 MILLION AND NOT ONE MENTION.\u201d Below them on the walkway, two Town Engineering staff in polos and caps study a blueprint labeled \u201cLAKE LURE DAM,\u201d water pouring through the spillway behind them. One says, \u201cStructurally sound, all things considered.\u201d A sign at the edge of the dam reads \u201cLAKE LURE NC.\u201d Caption beneath the panel: \u201cThe dam\u2019s original contractors, still waiting on a callback.\u201d',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep14',
    title: 'Two Kinds of Answered',
    byline: 'by Pete',
    date: 'Sunday \u00b7 September 20, 2026',
    episode: 'Episode 14 of \u201cBoathouse Fever\u201d',
    tagline: 'One deal closed. Two requests still waiting.',
    panels: [
      {
        src: '/images/comics/ep14-sun-0920.jpg',
        alt: 'Color strip, three tiers. Masthead tagline: \u201cOne Deal Closed. Two Requests Still Waiting.\u201d Tier 1 (wide panel): Lake Lure Town Hall in calm daylight by the lake, flag flying. Caption box: \u201cThe lawsuit that ate the summer finally got an answer. Not everything did.\u201d Tier 2, three panels: a framed \u201cSETTLEMENT \u2014 SIGNED\u201d notice beside a \u201cA Calmer Today. A Stronger Tomorrow.\u201d plaque; Nell at her desk holding two folders now stamped \u201cAUG 26 \u2014 24 DAYS \u2014 NO RESPONSE\u201d and \u201cSEPT 8 \u2014 11 DAYS \u2014 NO RESPONSE,\u201d a \u201cSAME RECORDS. SAME QUESTIONS.\u201d sign behind her and a \u201cLAKE LURE STAYS CURIOUS\u201d mug on the desk; a stack of \u201cCANDIDATE QUESTIONNAIRE, LAKE LURE, NC\u201d envelopes marked \u201cANSWERED,\u201d \u201cPENDING,\u201d \u201cPENDING,\u201d \u201cPENDING,\u201d \u201cPENDING\u201d beside a \u201cGOOD TOWNS ASK BETTER QUESTIONS\u201d mug. Tier 3, two panels: Edmund in his red bow tie addresses the gathered cast (Nell, Frank, Delia, the Dock Chorus) on the Town Hall steps at sunset \u2014 EDMUND: \u201cNeighbors, we settled the lawsuit. Let\u2019s see if we can settle everything else.\u201d One of the crowd, flat: \u201cSame time every week.\u201d Final panel: the heron stands on a dock post at sunset over the lake, Chimney Rock in the distance. Caption, bottom right: \u201cNEXT WEEK: Does the map match the lease?\u201d',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep13',
    title: 'Twelve Questions',
    byline: 'by Pete',
    date: 'Saturday · September 19, 2026',
    episode: 'Episode 13 of “Boathouse Fever”',
    tagline: 'The three Edmund answered anyway.',
    panels: [
      {
        src: '/images/comics/ep13-sat-0919.jpg',
        alt: 'Groening-style list strip, black and white. Title lettering across the top: “TWELVE QUESTIONS FOR EVERY CANDIDATE (THE THREE EDMUND ANSWERED ANYWAY), by Edmund.” Panel 1: Edmund beside a fork in the road signed “DAM” and “SEWER”: “One: dam or sewer, and how do you pay for it? Correct answer: both, eventually, painfully.” Panel 2: Edmund outside the Rocky Broad Kitchen: “Six: can the people who work here still afford to live here? Neighbors, that one’s not a joke.” Panel 3: Edmund beside a “TOWN HALL MEETING” checklist sandwich-board in front of Town Hall: “Nine: minutes on a fixed schedule, no exceptions? A goat has never missed a meeting he wasn’t invited to.” Panel 4: Edmund alone on the courthouse lawn: “Nobody mailed me a questionnaire. I answered three anyway. That’s the whole platform.” Caption: “The three Edmund answered anyway.”',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep12',
    title: 'Twenty-Three Days',
    byline: 'by Pete',
    date: 'Friday · September 18, 2026',
    episode: 'Episode 12 of “Boathouse Fever”',
    tagline: 'Some things get settled in a month. Some things just get older.',
    panels: [
      {
        src: '/images/comics/ep12-fri-0918.jpg',
        alt: 'Four-panel daily strip. Panel 1: Nell at her desk holding two folders, one stamped “AUG 26” with a tally climbing toward 23 days, the other “SEPT 8” climbing toward 10 days. Panel 2: an email draft on her laptop, subject “Public Records Request – Follow Up,” a visible line reading “...neither request has been acknowledged...” Panel 3: Nell clicks Send; a soft “whoosh” as it goes out. Panel 4: the basement grate sits quiet, unmoved — it’s used to this by now. Caption: “Some things get settled in a month. Some things just get older.”',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep11',
    title: 'Not Dismissed Yet',
    byline: 'by Pete',
    date: 'Thursday · September 17, 2026',
    episode: 'Episode 11 of “Boathouse Fever”',
    tagline: 'Signed. Not dismissed. Not yet.',
    panels: [
      {
        src: '/images/comics/ep11-thu-0917.jpg',
        alt: 'Four-panel daily strip. Panel 1: a hand-lettered “SETTLED!” banner hangs slightly crooked over Town Hall’s front door. Panel 2: the same door’s mail slot, just as quiet as ever. Panel 3: Nell checks the court docket on her phone — the next hearing date still shows “10/8/2026.” Panel 4: Nell, dry aside to the reader: “Signed. Not dismissed. Not yet.” Caption: “Progress moves at exactly one speed here. Town speed.”',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep10',
    title: 'Signed',
    byline: 'by Pete',
    date: 'Wednesday · September 16, 2026',
    episode: 'Episode 10 of “Boathouse Fever”',
    tagline: 'Eight months of relief. Then the number goes back up.',
    panels: [
      {
        src: '/images/comics/ep10-wed-0916.jpg',
        alt: 'Four-panel daily strip. Panel 1: the Town Manager sets a folder marked “SETTLEMENT — SIGN HERE” on the Rocky Broad Kitchen counter in front of Frank. Panel 2: Frank signs while Delia looks on. Panel 3: under the floor, the Void’s grate creaks open on reflex, ready for a new folder — then eases shut again, confused, unsure what to do with something that isn’t “pending.” Panel 4: Delia, wiping the counter: “So. Progress.” Frank: “For eight months.” Caption: “Eight months of relief. Then the number goes back up.”',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep9',
    title: 'Same Docket, New Date',
    byline: 'by Pete',
    date: 'Tuesday · September 15, 2026',
    episode: 'Episode 9 of “Boathouse Fever”',
    tagline: 'Still not the ending anybody scripted.',
    panels: [
      {
        src: '/images/comics/ep9-tue-0915.jpg',
        alt: 'Four-panel daily strip. Panel 1: Nell at her desk, refreshing the online court docket on her laptop. Panel 2: the case-status box flips from “9/15/2026” to “10/8/2026.” Panel 3: Nell, flat: “That’s four.” Panel 4: the basement grate creaks open half an inch, sniffing the air like it smells something different — then eases shut again, unconvinced. Caption: “Day two of week two. Still not the ending anybody scripted.”',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep8',
    title: 'The Waiting Game',
    byline: 'by Pete',
    date: 'Monday · September 14, 2026',
    episode: 'Episode 8 of “Boathouse Fever”',
    tagline: 'Even the monster in the basement is losing patience.',
    panels: [
      {
        src: '/images/comics/ep8-mon-0914.jpg',
        alt: 'Four-panel daily strip. Panel 1: across from Town Hall, Frank sweeps the sidewalk while Nell sits on a bench with a clear sightline to the building’s mail slot, and a knot of Dock Chorus regulars loiters by the flagpole — the whole town badly hiding a stakeout. Panel 2: an envelope drops through Town Hall’s mail slot with a “flmp.”, and everyone in the background snaps to attention. Panel 3: Nell, arms crossed, watches an envelope opened to reveal a “PIZZA $5 OFF” coupon, not a check. Panel 4: the basement grate, which had cracked hopefully open, eases back shut with a disappointed puff of dust and a whispered “shhh...” Caption: “Day one of week two. Even the monster in the basement is losing patience.”',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep7',
    title: 'Two Offers, One Deadline',
    byline: 'by Pete',
    date: 'Sunday · September 13, 2026',
    episode: 'Episode 7 of “Boathouse Fever”',
    tagline: 'So. Progress. On their terms.',
    panels: [
      {
        src: '/images/comics/ep7-sun-0913.jpg',
        alt: 'Color strip, three tiers. Tier 1: a hand passes an envelope marked “COUNTER-OFFER” across a table overlooking the lake. Caption: “One offer answered with another. Seven points this time — not just a number.” Tier 2, three panels: the Void savors a stack of paper marked “SETTLEMENT DRAFT — UNSIGNED” in its basement; at the Rocky Broad Kitchen counter, Frank holds the Town’s offer and says “Rent’s better. Boathouse claim’s gone. Everything after May... still theirs to write,” and Delia answers, “So. Progress. On their terms”; a hand circles Sept. 14 and Sept. 15 (“COURT”) on a September calendar. Tier 3, two panels: Edmund, in his red rosette, tells a small crowd on the courthouse lawn, “Neighbors, when both sides finally start arguing over commas instead of dollars, that’s about the closest thing to hope this town’s had all month”; the heron stands watch on a dock railing over the lake. Caption, bottom right: “NEXT WEEK: Does the check clear?”',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep6',
    title: 'Write-In Season',
    byline: 'by Pete',
    date: 'Saturday · September 12, 2026',
    episode: 'Episode 6 of “Boathouse Fever”',
    tagline: 'Day one of a three-way race nobody scheduled.',
    panels: [
      {
        src: '/images/comics/ep6-sat-0912.jpg',
        alt: 'Four-panel daily strip. Panel 1: the Town Hall community bulletin board holds a faded “CANDIDATE FILING CLOSED — JULY 17” notice. Panel 2: hands pin up “WRITE IN KATHY” and “WRITE IN KOZMA” signs over it. Panel 3: a crooked third sign goes up — “WRITE IN EDMUND (allegedly ineligible)”, with a small paw print in the corner. Panel 4: Edmund the goat, beside the bulletin board, turns to the reader: “Neighbors, I never said I was eligible. I said I was available.” Caption: “Day one of a three-way race nobody scheduled.”',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-sept11-tribute',
    title: 'Twenty-Five Years',
    byline: 'by Pete',
    date: 'Friday \u00b7 September 11, 2026',
    episode: 'In memory of September 11, 2001',
    tagline: 'Never forget.',
    panels: [
      {
        src: '/images/comics/tribute-sept11.jpg',
        alt: 'A quiet, single-panel tribute illustration, grayscale. Lake Lure Town Hall stands at dusk, its flag lowered to half-staff, the lake and mountains behind it. In front, the strip\u2019s cast \u2014 Nell, the Mayor, the Town Manager, the Council Chorus, Frank and Delia Osgood in their Rocky Broad Kitchen \/ Delia\u2019s Kitchen aprons, and other townsfolk \u2014 stand together with heads bowed in a moment of silence. Edmund the goat, wearing his red bow tie, stands quietly among them rather than addressing the crowd. Caption beneath the illustration reads: \u201cSeptember 11, 2001 \u2014 September 11, 2026. Twenty-five years. Never forget.\u201d',
      },
    ],
  },
  {
    slug: 'state-of-the-herd-ep5',
    title: 'The Buried Lede',
    byline: 'by Pete',
    date: 'Thursday \u00b7 September 10, 2026',
    episode: 'Episode 5 of \u201cBoathouse Fever\u201d',
    tagline: 'Day four. Still can\u2019t see the forest for the sand.',
    panels: [
      {
        src: '/images/comics/ep5-thursday.jpg',
        alt: 'Four-panel daily strip. Panel 1: the Mayor and the Council Chorus stand at the Town Beach, buried up to their shoulders in a mound of sand, sashes and blazers visible above the sand line. Panel 2: Nell, notebook in hand at the water\u2019s edge, calls out: \u201cAny update on the settlement?\u201d Panel 3: muffled voices rise from the sand in unison: \u201cWe take this matter very seriously.\u201d Panel 4: Edmund the goat walks into frame, studies the buried officials, and turns to the reader: \u201cNeighbors, I\u2019ve seen ostriches commit harder to a bit.\u201d Caption: \u201cDay four. Still can\u2019t see the forest for the sand.\u201d',
      },
    ],
  },
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
