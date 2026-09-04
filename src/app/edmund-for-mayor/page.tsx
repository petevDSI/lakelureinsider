import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShopEmbed } from '@/components/mdx/ShopEmbed'
import { EdmundSignupForm } from '@/components/EdmundSignupForm'
import { EnlargeableImage } from '@/components/EnlargeableImage'
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
  { label: 'Photos & Video', href: '#gallery' },
  { label: 'The Platform', href: '#platform' },
  { label: 'The Promises', href: '#promises' },
  { label: 'Endorsements', href: '#endorsements' },
  { label: 'Join the Herd', href: '#join' },
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

interface CampaignPhoto {
  src: string
  alt: string
  caption: string
}

const CAMPAIGN_PHOTOS: CampaignPhoto[] = [
  {
    src: '/images/edmund-goat-mayor.jpg',
    alt: 'Edmund the Kiko goat standing on the double-yellow line of a mountain highway near the Rocky Broad River in Chimney Rock, NC',
    caption: 'On the campaign trail — Highway 64/74A near the one-lane bridge.',
  },
  {
    src: '/images/edmund-stone-steps.jpg',
    alt: 'Close-up of Edmund the Kiko goat with large curved horns, standing on stone steps surrounded by ivy',
    caption: 'Working the crowd (and the kudzu) near the stone steps.',
  },
]

interface CampaignVideo {
  embedSrc: string
  href: string
  title: string
  // Facebook itself refuses to embed some videos ("may contain content
  // owned by someone else" — a rights-holder match on Facebook's end, not
  // anything wrong with our page). Confirmed 2026-09-04 for the Marilyn O.
  // Thompson video below by loading the embed URL directly. When false,
  // render a static "watch on Facebook" card instead of a broken iframe.
  embeddable?: boolean
}

const CAMPAIGN_VIDEOS: CampaignVideo[] = [
  {
    embedSrc:
      'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Fmarilyn.o.thompson%2Fvideos%2F1986806445308493%2F%3Fidorvanity%3D1075508173972854&show_text=false&width=267&t=0',
    href: 'https://www.facebook.com/marilyn.o.thompson/videos/1986806445308493/?idorvanity=1075508173972854',
    title: 'Edmund the goat — video shared by Marilyn O. Thompson on Facebook',
    embeddable: false,
  },
  {
    embedSrc:
      'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F28518122534477961%2F&show_text=false&width=267&t=0',
    href: 'https://www.facebook.com/reel/28518122534477961/',
    title: 'Edmund the goat — Facebook Reel',
  },
  {
    embedSrc:
      'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F990557920671102%2F&show_text=false&width=267&t=0',
    href: 'https://www.facebook.com/reel/990557920671102/',
    title: 'Edmund the goat — Facebook Reel',
  },
]

interface MerchImage {
  src: string
  alt: string
  label?: 'Front' | 'Back'
}

interface MerchItem {
  key: 'edmund-for-mayor-tee' | 'edmund-for-mayor-badge-tee' | 'heritage-mountain-hat' | 'edmund-sunglasses-hat' | 'dont-fence-me-in-hat' | 'chimney-rock-escape-hoodie' | 'lake-float-tank' | 'lake-life-goat-life-tee' | 'edmund-sunglasses-sticker' | 'heritage-mountain-sticker' | 'dont-fence-me-in-sticker'
  title: string
  blurb: string
  images: MerchImage[]
}

const MERCH_ITEMS: MerchItem[] = [
  {
    key: 'edmund-for-mayor-tee',
    title: 'Edmund for Mayor Tee',
    blurb: 'The original campaign badge design. Back reads "A goat we can all get behind."',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/unisex-classic-tee-sapphire-front-6a99606bcb89c.jpg?v=1788436599',
        alt: 'Front of the Edmund for Mayor Tee in sapphire blue, showing the vintage campaign badge design',
        label: 'Front',
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/unisex-classic-tee-sapphire-back-6a99606bcbaaf.jpg?v=1788436599',
        alt: 'Back of the Edmund for Mayor Tee in sapphire blue, printed with the phrase "A goat we can all get behind"',
        label: 'Back',
      },
    ],
  },
  {
    key: 'edmund-for-mayor-badge-tee',
    title: 'Edmund for Mayor Vintage Badge Tee',
    blurb: 'A quieter, single-print take: a hand-illustrated portrait of Edmund set against layered mountains and pines.',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/unisex-classic-tee-sapphire-front-6a996552d0389.jpg?v=1788437866',
        alt: 'Front of the Edmund for Mayor Vintage Badge Tee in sapphire blue, showing the hand-illustrated vintage badge design',
      },
    ],
  },
  {
    key: 'heritage-mountain-hat',
    title: 'Edmund Mountain Badge Dad Hat',
    blurb: 'A national-park-style badge: Edmund standing watch over the Blue Ridge, ringed by pine trees and peaks.',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/distressed-dad-hat-black-front-6a996a18a5958.jpg?v=1788439090',
        alt: 'Edmund Mountain Badge Dad Hat in black, showing the embroidered mountain badge patch',
      },
    ],
  },
  {
    key: 'edmund-sunglasses-hat',
    title: 'Edmund in Shades Dad Hat',
    blurb: 'Edmund\u2019s celebrity portrait, sunglasses and all, embroidered on a circular badge.',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/classic-dad-hat-navy-front-6a996b6db0555.jpg?v=1788439447',
        alt: 'Edmund in Shades Dad Hat in navy, showing the embroidered sunglasses portrait badge',
      },
    ],
  },
  {
    key: 'dont-fence-me-in-hat',
    title: "Don't Fence Me In Dad Hat",
    blurb: 'Edmund\u2019s civil-liberties platform, embroidered on a classic dad hat.',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/classic-dad-hat-navy-front-6a996c44e8cd7.jpg?v=1788439652',
        alt: "Don't Fence Me In Dad Hat in navy, showing the embroidered oval badge of Edmund by a broken fence",
      },
    ],
  },
  {
    key: 'chimney-rock-escape-hoodie',
    title: 'Edmund Chimney Rock Escape Artist Hoodie',
    blurb: 'Back reads "If they chase me, I run faster." A heavyweight pullover for cool evenings on the water.',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/unisex-premium-pullover-hoodie-white-front-6a997f2571624.jpg?v=1788444471',
        alt: 'Front of the Edmund Chimney Rock Escape Artist Hoodie in white, showing Edmund silhouetted atop the rock at sunset',
        label: 'Front',
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/unisex-premium-pullover-hoodie-white-back-6a997f2574b59.jpg?v=1788444471',
        alt: 'Back of the Edmund Chimney Rock Escape Artist Hoodie in white, printed with "If they chase me, I run faster."',
        label: 'Back',
      },
    ],
  },
  {
    key: 'lake-float-tank',
    title: 'Edmund Lake Float Tank Top',
    blurb: 'Back reads "Goats just wanna have sun." Built for the dock, available in Red, Athletic Heather, and White.',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/unisex-staple-tank-top-red-front-6a99a1713ac9d.jpg?v=1788453259',
        alt: 'Front of the Edmund Lake Float Tank Top in red, showing Edmund floating in an inner tube on the lake',
        label: 'Front',
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/unisex-staple-tank-top-red-back-6a99a1713b843.jpg?v=1788453259',
        alt: 'Back of the Edmund Lake Float Tank Top in red, printed with "Goats just wanna have sun."',
        label: 'Back',
      },
    ],
  },
  {
    key: 'lake-life-goat-life-tee',
    title: 'Edmund Lake Life. Goat Life. Heavyweight Tee',
    blurb: 'Back reads "I cross rivers. I ignore fences. I do what I want." A heavyweight, garment-dyed tee in 11 colors.',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/unisex-garment-dyed-heavyweight-t-shirt-berry-front-6a9ac69a7195e.jpg?v=1788528327',
        alt: 'Front of the Edmund Lake Life. Goat Life. Heavyweight Tee in berry, showing Edmund floating in the lake wearing sunglasses',
        label: 'Front',
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/unisex-garment-dyed-heavyweight-t-shirt-berry-back-6a9ac69a72b14.jpg?v=1788528327',
        alt: "Back of the Edmund Lake Life. Goat Life. Heavyweight Tee in berry, printed with 'I cross rivers. I ignore fences. I do what I want.'",
        label: 'Back',
      },
    ],
  },
  {
    key: 'edmund-sunglasses-sticker',
    title: 'Edmund in Shades Sticker',
    blurb: 'The Edmund in Shades Dad Hat badge, printed as a durable vinyl sticker in three sizes.',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/kiss-cut-stickers-white-3x3-default-6a9ac79a56912.jpg?v=1788528543',
        alt: 'Edmund in Shades sticker, showing the sunglasses portrait badge',
      },
    ],
  },
  {
    key: 'heritage-mountain-sticker',
    title: 'Edmund Mountain Badge Sticker',
    blurb: 'The Edmund Mountain Badge Dad Hat design, sized down to a sticker in three sizes.',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/kiss-cut-stickers-white-3x3-default-6a9ac80b74400.jpg?v=1788528656',
        alt: "Edmund Mountain Badge sticker, showing Edmund's silhouette on a mountain badge",
      },
    ],
  },
  {
    key: 'dont-fence-me-in-sticker',
    title: "Don't Fence Me In Sticker",
    blurb: "Edmund's civil-liberties platform, now in sticker form.",
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0999/2228/0768/files/kiss-cut-stickers-white-3x3-default-6a9ac87062152.jpg?v=1788528756',
        alt: "Don't Fence Me In sticker, showing Edmund walking past a broken fence",
      },
    ],
  },
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

      {/* Photos & video */}
      <section id="gallery" className="bg-[#F5EEDC] px-page py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-[#B31942]">
            Photos &amp; Video
          </p>
          <h2 className="text-center font-display text-3xl font-bold text-[#0B2545] sm:text-4xl">
            Edmund in Action
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#1C2321]/80">
            No campaign staff, no photo ops — just Edmund being Edmund, caught
            on camera by the neighbors who know him best.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {CAMPAIGN_PHOTOS.map((photo) => (
              <figure
                key={photo.src}
                className="m-0 overflow-hidden rounded-xl border border-[#0B2545]/15 bg-white"
              >
                <EnlargeableImage
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-[#1C2321]/70">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-start justify-center gap-6">
            {CAMPAIGN_VIDEOS.map((video) => (
              <div
                key={video.href}
                className="flex flex-col items-center rounded-xl border border-[#0B2545]/15 bg-white p-3"
              >
                {video.embeddable === false ? (
                  // Facebook itself blocks embedding this one (rights-holder
                  // match on Facebook's end) — a static card instead of a
                  // broken iframe showing Facebook's own "Unavailable" message.
                  <a
                    href={video.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[476px] w-[267px] max-w-full flex-col items-center justify-center gap-3 rounded-lg bg-[#F5EEDC] px-4 text-center transition-colors hover:bg-[#0B2545]/5"
                  >
                    <span className="text-4xl" aria-hidden="true">🐐</span>
                    <span className="font-display text-sm font-bold text-[#0B2545]">
                      Facebook won&apos;t let us embed this one
                    </span>
                    <span className="text-xs text-[#1C2321]/60">
                      Tap to watch it on Facebook instead.
                    </span>
                  </a>
                ) : (
                  <iframe
                    src={video.embedSrc}
                    width="267"
                    height="476"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title={video.title}
                    loading="lazy"
                    className="max-w-full"
                  />
                )}
                <a
                  href={video.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs font-semibold text-[#B31942] underline underline-offset-2"
                >
                  Watch on Facebook ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <StripedBunting />

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

      {/* Join the herd — campaign email sign-up */}
      <section id="join" className="bg-[#0B2545] px-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Join the Herd
          </p>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Get Campaign Updates
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            New Edmund sightings, campaign gear drops, and the occasional
            genuinely important update on Lured Market — straight to your
            inbox. No robocalls, no yard signs.
          </p>
          <div className="mt-8">
            <EdmundSignupForm />
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

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MERCH_ITEMS.map((item) => (
              <div
                key={item.key}
                className="flex flex-col rounded-xl border border-[#0B2545]/15 bg-white p-6 text-center"
              >
                {item.images.length > 0 ? (
                  <div className="flex flex-row flex-wrap items-start justify-center gap-3">
                    {item.images.map((img) => (
                      <figure key={img.src} className="m-0 min-w-0 flex-1 basis-24">
                        <EnlargeableImage
                          src={img.src}
                          alt={img.alt}
                          className="aspect-square w-full rounded-lg border border-(--sand) object-cover"
                        />
                        {img.label && (
                          <figcaption className="mt-1 text-center text-xs text-(--ink)/50">
                            {img.label}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                ) : (
                  <div className="mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center rounded-lg border border-dashed border-[#0B2545]/20 bg-[#F5EEDC] text-4xl">
                    🐐
                  </div>
                )}
                <p className="mt-4 font-display text-lg font-bold text-[#0B2545]">
                  {item.title}
                </p>
                <p className="mt-1 flex-1 text-sm text-[#1C2321]/70">{item.blurb}</p>
                {item.images.length > 0 && (
                  <p className="mt-1 text-xs text-[#1C2321]/40">Tap a photo to enlarge it.</p>
                )}
                <div className="mt-4 flex justify-center">
                  <ShopEmbed productKey={item.key} />
                </div>
              </div>
            ))}
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
