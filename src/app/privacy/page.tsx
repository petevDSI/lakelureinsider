import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Lake Lure Insider.',
  robots: { index: false },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-[--forest]">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-[--ink]/60">
        Last updated: {new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          timeZone: 'America/New_York',
        })}
      </p>

      <div className="prose mt-8">
        <p>
          This Privacy Policy describes how Lake Lure Insider (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares
          information when you visit lakelureinsider.com (the
          &quot;Site&quot;).
        </p>

        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us (such as through a
          contact form) and information collected automatically through your use
          of the Site, including standard server log data, cookies, and
          analytics data.
        </p>

        <h2>Analytics</h2>
        <p>
          We use analytics tools to understand how visitors use the Site. This
          may include data about pages visited, time spent on pages, and
          referring sites. We do not sell this data.
        </p>

        <h2>Affiliate Links</h2>
        <p>
          Third-party affiliate platforms may set cookies when you click
          affiliate links on our Site. These cookies are governed by those
          platforms' own privacy policies.
        </p>

        <h2>Cookies</h2>
        <p>
          We use cookies for analytics and site functionality. You can disable
          cookies in your browser settings, though some site features may not
          work correctly.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          Our Site contains links to third-party websites. We are not
          responsible for the privacy practices of those sites.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this policy, please{' '}
          <a href="/contact">contact us</a>.
        </p>
      </div>
    </div>
  )
}
