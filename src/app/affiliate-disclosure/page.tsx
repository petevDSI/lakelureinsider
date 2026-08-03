import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description:
    'Lake Lure Insider participates in affiliate programs. Learn how we earn commissions and how that affects our editorial content.',
  robots: { index: false },
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-[--forest]">
        Affiliate Disclosure
      </h1>
      <p className="mt-2 text-sm text-[--ink]/60">
        In compliance with FTC 16 CFR Part 255
      </p>

      <div className="prose mt-8">
        <p>
          Lake Lure Insider participates in affiliate advertising programs. This
          means that when you click certain links on this site and make a
          purchase or booking, we may earn a commission at no additional cost to
          you.
        </p>

        <h2>How This Works</h2>
        <p>
          We partner with travel booking platforms, ticket providers, and
          activity companies to earn referral fees when readers book through our
          links. These relationships help fund the cost of running this site.
        </p>

        <h2>Our Editorial Standards</h2>
        <p>
          Affiliate relationships do not influence our editorial content. We
          only recommend places, experiences, and services we genuinely believe
          are worth your time and money. We would rather send you to a
          non-affiliate option if it is the better choice.
        </p>

        <h2>Identifying Affiliate Links</h2>
        <p>
          Pages that contain affiliate links display a disclosure notice at the
          top of the page. Individual affiliate links and buttons are marked
          with{' '}
          <code>rel=&quot;sponsored nofollow noopener&quot;</code> attributes.
        </p>

        <h2>Questions</h2>
        <p>
          If you have questions about our affiliate relationships, please{' '}
          <a href="/contact">contact us</a>.
        </p>
      </div>
    </div>
  )
}
