import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { organizationJsonLd } from '@/lib/jsonld'
import { SITE_URL } from '@/lib/site-config'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lake Lure Insider — Local Guide to Lake Lure & Chimney Rock, NC',
    template: '%s | Lake Lure Insider',
  },
  description:
    'The insider guide to Lake Lure and Chimney Rock, NC. Hours, tickets, things to do, where to stay, and local tips from someone who knows the area.',
  openGraph: {
    siteName: 'Lake Lure Insider',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full`}
    >
      <head>
        {/* On non-canonical hosts (e.g. vercel.app previews) the proxy sets
            X-Robots-Tag: noindex. Make the HTML meta tag agree so any crawler
            that reads HTML rather than headers also sees noindex. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var h=location.hostname;if(h!=='lakelureinsider.com'&&h!=='www.lakelureinsider.com'){var m=document.querySelector('meta[name="robots"]');if(m)m.content='noindex, follow';else{var n=document.createElement('meta');n.name='robots';n.content='noindex, follow';document.head.appendChild(n);}}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
