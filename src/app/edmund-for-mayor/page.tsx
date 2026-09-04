import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShopEmbed } from '@/components/mdx/ShopEmbed'
import { SITE_URL } from '@/lib/site-config'

const PAGE_DESCRIPTION =
  "The official (not really) platform of Edmund the goat: saving Lured Market, ending fences forever, and finally getting that goat crossing sign on Highway 64/74A. Make Lake Lure Goat Again."

export const metadata: Metadata = {
  title: 'Edmund for Mayor — Meet Lake Lure’s G.O.A.T. Candidate',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/edmund-for-mayor` },
  openGraph: {
    title: 'Edmund for Mayor — The G.O.A.T. Candidate',
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/edmund-for-mayor`,
    type: 'website',
    images: [
      {
        url: '/images/edmund-goat-mayor.jpg',
        alt: 'Edmund the Kiko goat, candidate for Mayor of Lake Lure, NC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edmund for Mayor — The G.O.A.T. Candidate',
    description: PAGE_DESCRIPTION,
  },
}

const BUNTING =
  'repeating-linear-gradient(45deg, #B31942 0, #B31942 10px, #F5EEDC 10px, #F5EEDC 20px, #0B2545 20px, #0B2545 30px)'

const ISSUE_TABS = [
  { label: 'The Candidate', href: '#candidate' },
  { label: 'The Platform', href: '#platform' },
  { label: 'The Promises', href: '#promises' },
  { label: 'Endorsements', href: '#endorsements' },
  { label: 'Campaign Store', href: '#merch' },
]

const PLATFORM_PLANKS = [
  {
    tag: 'Issue No. 1',
    title: 'Protect Local Business: Save the Market',
    body: (
      <>
        <p>
          Lured Market &amp; Grill fed roughly 750 people a day out of this
          building after Hurricane Helene, back when it was the only hot
          meal in Lake Lure. Edmund thinks that ought to count for
          something in a rent dispute — so here is his platform, in five
          goat-approved planks:
        </p>
        <ol className="mt-4 space-y-3 pl-5 text-left [&>li]:list-decimal">
          <li>
            <strong>Herd loyalty.</strong> A goat never abandons the herd
            during a storm, and neither did the people running that
            kitchen.
          </li>
          <li>
            <strong>Free range, not locked gates.</strong> Edmund does not
            believe in padlocking doors on hungry mouths, goat or
            otherwise.
          </li>
          <li>
            <strong>You don&apos;t bite the hand that feeds the herd.</strong>{' '}
            A kitchen that never closed when the whole town needed it has
            earned more than a courtroom fight.
          </li>
          <li>
            <strong>Read the fine print, then read it again.</strong>{' '}
            Edmund&apos;s take on the lease dispute: back rent shouldn&apos;t
            end with a &quot;Closed&quot; sign on the one kitchen that stayed
            open.
          </li>
          <li>
            <strong>Every goat deserves a second plate.</strong> Local
            business, local jobs, local food — that&apos;s the whole platform,
            start to finish.
          </li>
        </ol>
        <p className="mt-4 text-sm">
          <Link
            href="/news/lured-market-town-lease-fight"
            className="font-semibold underline underline-offset-2"
          >
            Read the full investigation →
          </Link>
        </p>
      </>
    ),
  },
  {
    tag: 'Issue No. 2',
    title: 'No More Fences',
    body: (
      <p>
        Edmund believes every creature has the right to cross a river,
        climb a hillside, or wander into a stranger&apos;s yard without a
        permit. His position on fences is simple: he does not recognize
        them. Neighbors report 100% compliance with this policy, whether
        they like it or not.
      </p>
    ),
  },
  {
    tag: 'Issue No. 3',
    title: 'Roads That Work for Everyone',
    body: (
      <p>
        More than one commenter has said it: this road needs an actual
        goat crossing sign. Edmund agrees, and he&apos;s putting it on the
        record. Infrastructure spending should serve its most frequent
        pedestrian — and on Highway 64/74A near the one-lane bridge, that
        pedestrian has four legs and no sense of urgency.
      </p>
    ),
  },
  {
    tag: 'Issue No. 4',
    title: 'A Cleaner Riverbank, Naturally',
    body: (
      <p>
        While other candidates talk about invasive species, Edmund eats
        them. Free kudzu removal, one mouthful at a time — no contractor,
        no bid process, no line item in next year&apos;s budget.
      </p>
    ),
  },
  {
    tag: 'Issue No. 5',
    title: 'Public Safety First',
    body: (
      <p>
        Edmund&apos;s safety plan: slow down near the bridge, give wildlife
        the right of way, and put up that sign already. Neighbors along
        his route also report noticeably fewer bear sightings since he
        moved in — Edmund neither confirms nor denies being the reason.
      </p>
    ),
  },
  {
    tag: 'Issue No. 6',
    title: 'Term Limits for Everyone but Me',
    body: (
      <p>
        Edmund supports term limits, transparency, and accountability in
        local government — for every office he is not currently
        campaigning for. A true statesman knows the difference.
      </p>
    ),
  },
  {
    tag: 'Issue No. 7',
    title: 'Baa-geting, Responsibly',
    body: (
      <p>
        No new taxes. No new spending. No budget at all, actually — Edmund
        has never opened a checking account in his life. Say what you want
        about the platform, but nobody can call it wasteful.
      </p>
    ),
  },
]

const PROMISES = [
  'An open-door policy. (There is no door.)',
  'A kudzu-free riverbank by fall — no funding required.',
  'Full transparency. Edmund has never once gone into closed session.',
  'A goat crossing sign where Highway 64/74A needs one most.',
  'No lobbyists, no fundraisers, and no pants. Not now, not ever.',
  'A second helping for every hardworking kitchen in this town.',
]

const ENDORSEMENTS = [
  {
    name: 'The Rocky Broad River Kudzu Patch',
    verdict: 'Unanimous',
  },
  {
    name: 'Every Driver Who’s Had to Brake for Him on 64/74A',
    verdict: 'Begrudging, but sincere',
  },
  {
    name: 'The Bear Population on His Side of the River',
    verdict: 'Neutral, possibly displaced',
  },
  {
    name: 'Local Dogs, Basically All of Them',
    verdict: 'Landslide',
  },
  {
    name: 'The Lake Lure Local Facebook Group',
    verdict: 'Where this whole thing started',
  },
]

const CANDIDATE_FACTS: Array<[string, string]> = [
  ['Party', 'Independent (G.O.A.T. Party)'],
  ['Home Turf', 'The riverbank near Chimney Rock, between Lake Lure and the county line'],
  ['Occupation', 'Volunteer kudzu removal, unlicensed bear deterrent'],
  ['Running Mate', 'None. Prefers to travel light.'],
  ['Known Aliases', '“Big Boy”'],
  ['Slogan', '“A Goat We Can All Get Behind”'],
  ['Campaign Finance', 'Cannot legally open a bank account'],
]

function StripedBunting({ height = 'h-2' }: { height?: string }) {
  return (
    <div
      className={`${height} w-full`}
      style={{ background: BUNTING }}
      aria-hidden="true"
    />
  )
}

export default function EdmundForMayorPage() {
  return (
    <>
      {/* Campaign masthead ticker */}
      <div className="bg-[#0B2545] px-page py-2 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5EEDC]/80">
          ★ Official Campaign of Edmund the Goat ★ Paid for by the Committee
          to Re-Pasture Lake Lure ★
        </p>
      </div>
      <StripedBunting />

      {/* Hero */}
      <section
        id="top"
        className="relative flex min-h-[78vh] items-end overflow-hidden bg-[#0B2545] px-page pb-14 pt-20"
      >
        <Image
          src="/images/edmund-goat-mayor.jpg"
          alt="Edmund the Kiko goat, candidate for Mayor of Lake Lure, NC, standing on a mountain highway near the Rocky Broad River"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-[#0B2545]/70 to-[#0B2545]/20" />
        <div className="relative mx-auto w-full max-w-4xl text-center text-white">
          <span className="inline-block rounded-full border border-[#C9A227] bg-[#B31942] px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white">
            ★ The G.O.A.T. Candidate ★
          </span>
          <h1 className="mt-5 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Edmund
            <br />
            for Mayor
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg font-bold uppercase tracking-wide text-[#C9A227] sm:text-xl">
            Make Lake Lure Goat Again
          </p>
          <p className="mx-auto mt-3 max-w-md text-white/75">
            A Goat We Can All Get Behind.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#platform"
              className="rounded-md bg-[#B31942] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              See the Platform
            </a>
            <Link
              href="/shop"
              className="rounded-md border border-white/50 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Shop Campaign Gear
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/50">
            <Link href="/news/edmund-goat-mayor" className="underline underline-offset-2 hover:text-white">
              Read how a stray goat became Lake Lure&apos;s most talked-about write-in →
            </Link>
          </p>
        </div>
      </section>
      <StripedBunting />

      {/* Issue tabs */}
      <nav
        aria-label="Campaign sections"
        className="sticky top-[57px] z-40 border-b border-[#0B2545]/10 bg-[#F5EEDC] px-page py-2 sm:top-[65px]"
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-1">
          {ISSUE_TABS.map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              className="rounded-md px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-[#0B2545] transition-colors hover:bg-[#0B2545]/10"
            >
              {tab.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Meet the candidate */}
      <section id="candidate" className="bg-white px-page py-16">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B31942]">
              Meet the Candidate
            </p>
            <h2 className="font-display text-3xl font-bold text-[#0B2545] sm:text-4xl">
              Born to Run (Free, That Is)
            </h2>
            <div className="prose mt-5 max-w-none">
              <p>
                Edmund&apos;s story starts the way most great political
                comebacks do: with an escape. Sometime this summer, after
                his herd-mates were rounded up across the Henderson County
                line, Edmund crossed the Rocky Broad River and turned up,
                uninvited and completely unbothered, inside a Chimney Rock
                goat fence that was never built to hold him.
              </p>
              <p>
                He&apos;s been governing his own schedule ever since —
                crossing the river when the mood strikes, working the
                kudzu on the hillside, and making unscheduled appearances
                along Highway 64/74A that have, by more than one account,
                single-handedly improved local compliance with the posted
                speed limit.
              </p>
              <p>
                He didn&apos;t ask for any of this. A neighbor started
                posting about him. Then another one did. Then somebody
                made a campaign poster as a joke, and the joke took on a
                life of its own.
              </p>
              <p>
                Edmund never asked to run for office. In fairness, he also
                never said no.
              </p>
            </div>
          </div>
          <div className="rounded-xl border-2 border-[#0B2545] bg-[#F5EEDC] p-6">
            <p className="mb-3 font-display text-lg font-bold text-[#0B2545]">
              Candidate Fact Sheet
            </p>
            <dl className="space-y-3">
              {CANDIDATE_FACTS.map(([label, value]) => (
                <div key={label} className="border-b border-[#0B2545]/10 pb-2 last:border-0 last:pb-0">
                  <dt className="text-xs font-bold uppercase tracking-wide text-[#B31942]">
                    {label}
                  </dt>
                  <dd className="text-sm text-[#0B2545]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="bg-[#0B2545] px-page py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            The Platform
          </p>
          <h2 className="text-center font-display text-3xl font-bold text-white sm:text-4xl">
            Where Edmund Stands
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PLATFORM_PLANKS.map((plank) => (
              <div
                key={plank.title}
                className={`rounded-xl border border-white/10 bg-white p-6 ${
                  plank.tag === 'Issue No. 1' ? 'sm:col-span-2' : ''
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-[#B31942]">
                  {plank.tag}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-[#0B2545]">
                  {plank.title}
                </h3>
                <div className="prose prose-sm mt-3 max-w-none text-[#1C2321]">
                  {plank.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section id="promises" className="bg-[#F5EEDC] px-page py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B31942]">
            The Promises
          </p>
          <h2 className="font-display text-3xl font-bold text-[#0B2545] sm:text-4xl">
            Official Campaign Promises
          </h2>
          <ul className="mx-auto mt-8 max-w-xl space-y-3 text-left">
            {PROMISES.map((promise) => (
              <li
                key={promise}
                className="flex items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-sm"
              >
                <span className="mt-0.5 text-[#B31942]" aria-hidden="true">★</span>
                <span className="text-[#0B2545]">{promise}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Endorsements */}
      <section id="endorsements" className="bg-white px-page py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B31942]">
            Endorsements
          </p>
          <h2 className="font-display text-3xl font-bold text-[#0B2545] sm:text-4xl">
            Who&apos;s Behind Edmund
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {ENDORSEMENTS.map((e) => (
              <div
                key={e.name}
                className="rounded-xl border border-[#0B2545]/15 p-5 text-left"
              >
                <p className="font-display text-base font-bold text-[#0B2545]">
                  {e.name}
                </p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-[#B31942]">
                  {e.verdict}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <StripedBunting />

      {/* Merch / campaign store */}
      <section id="merch" className="bg-[#F5EEDC] px-page py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-[#B31942]">
            Campaign Store
          </p>
          <h2 className="text-center font-display text-3xl font-bold text-[#0B2545] sm:text-4xl">
            Gear Up for the Campaign
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#1C2321]/80">
            Every shirt and hat helps support Edmund&apos;s actual, real-life
            care and feeding. No PAC money here — just goats and t-shirts.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-[#0B2545]/15 bg-white p-6 text-center">
              <img
                src="https://cdn.shopify.com/s/files/1/0999/2228/0768/files/unisex-classic-tee-sapphire-front-6a99606bcb89c.jpg?v=1788436599"
                alt="Front of the Edmund for Mayor Tee in sapphire blue, showing the vintage campaign badge design"
                className="mx-auto aspect-square w-full max-w-[240px] rounded-lg border border-(--sand) object-cover"
              />
              <p className="mt-4 font-display text-lg font-bold text-[#0B2545]">
                Edmund for Mayor Tee
              </p>
              <p className="mt-1 text-sm text-[#1C2321]/70">
                The original campaign badge design. Back reads &quot;A goat we
                can all get behind.&quot;
              </p>
              <div className="mt-4 flex justify-center">
                <ShopEmbed productKey="edmund-for-mayor-tee" />
              </div>
            </div>

            <div className="rounded-xl border border-[#0B2545]/15 bg-white p-6 text-center">
              <img
                src="https://cdn.shopify.com/s/files/1/0999/2228/0768/files/classic-dad-hat-navy-front-6a996c44e8cd7.jpg?v=1788439652"
                alt="Don't Fence Me In Dad Hat in navy, showing the embroidered oval badge of Edmund by a broken fence"
                className="mx-auto aspect-square w-full max-w-[240px] rounded-lg border border-(--sand) object-cover"
              />
              <p className="mt-4 font-display text-lg font-bold text-[#0B2545]">
                Don&apos;t Fence Me In Dad Hat
              </p>
              <p className="mt-1 text-sm text-[#1C2321]/70">
                Edmund&apos;s civil-liberties platform, embroidered on a
                classic dad hat.
              </p>
              <div className="mt-4 flex justify-center">
                <ShopEmbed productKey="dont-fence-me-in-hat" />
              </div>
            </div>
          </div>

          <p className="mt-8 text-center">
            <Link
              href="/shop"
              className="rounded-md bg-[#B31942] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              See the Full Campaign Store →
            </Link>
          </p>
        </div>
      </section>

      <StripedBunting height="h-2" />

      {/* Campaign small print */}
      <div className="bg-[#0B2545] px-page py-6 text-center">
        <p className="mx-auto max-w-2xl text-xs italic text-white/50">
          Paid for by the Committee to Re-Pasture Lake Lure. Not authorized
          by any goat — Edmund cannot legally authorize anything; he is a
          goat. This page is a work of local humor from Lake Lure Insider,
          inspired by a whole town that decided a stray Kiko goat deserved
          a campaign poster. For Lake Lure&apos;s real town government and
          real elections, visit{' '}
          <a
            href="https://www.townoflakelure.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/80"
          >
            townoflakelure.com
          </a>
          .
        </p>
      </div>
    </>
  )
}
