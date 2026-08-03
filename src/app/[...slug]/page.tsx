import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPages, getPageBySlug } from '@/lib/content'
import { breadcrumbJsonLd } from '@/lib/jsonld'
import { SITE_URL } from '@/lib/site-config'
import { mdxComponents } from '@/components/mdx'
import { FAQ } from '@/components/mdx/FAQ'
import { PageHero } from '@/components/mdx/PageHero'
import { QuickAnswer } from '@/components/mdx/QuickAnswer'
import type { MDXComponents } from 'mdx/types'
import type { ContentPage } from '@/types/content'

export async function generateStaticParams() {
  // Only prerender article pages; place pages will have their own route when built
  return getAllPages()
    .filter((p) => p.slug !== '' && p.frontmatter.type === 'article')
    .map((p) => ({ slug: p.slug.split('/') }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const slugStr = slug.join('/')
  const page = getPageBySlug(slugStr)
  if (!page) return {}

  const { frontmatter } = page
  const canonical = `${SITE_URL}/${slugStr}`

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical },
    // Stub pages have real URLs but thin content — keep them out of the index
    // until they're fully written.
    robots: frontmatter.stub ? { index: false, follow: true } : undefined,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: canonical,
      type: 'article',
      images: frontmatter.heroImage
        ? [{ url: frontmatter.heroImage, alt: frontmatter.heroAlt }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      images: frontmatter.heroImage ? [frontmatter.heroImage] : [],
    },
  }
}

function buildBreadcrumbs(slugStr: string, title: string) {
  const segments = slugStr.split('/')
  const crumbs = [{ label: 'Home', href: '/' }]
  let accumulated = ''
  segments.forEach((seg, i) => {
    accumulated += (accumulated ? '/' : '') + seg
    crumbs.push({
      label:
        i === segments.length - 1
          ? title
          : seg
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' '),
      href: `/${accumulated}`,
    })
  })
  return crumbs
}

function hasAffiliateContent(raw: string): boolean {
  return raw.includes('<AffiliateCTA') || raw.includes('<AffiliateLink')
}

function buildArticleComponents(page: ContentPage): MDXComponents {
  const { frontmatter } = page
  return {
    ...mdxComponents,
    FAQ: () => <FAQ faqs={frontmatter.faqs} />,
    PageHero: (props: object) => (
      <PageHero
        title={frontmatter.title}
        imageSrc={frontmatter.heroImage}
        imageAlt={frontmatter.heroAlt}
        breadcrumbs={buildBreadcrumbs(page.slug, frontmatter.title)}
        {...(props as Partial<Parameters<typeof PageHero>[0]>)}
      />
    ),
    QuickAnswer: (props: object) => (
      <QuickAnswer
        items={frontmatter.quickAnswer}
        {...(props as Partial<Parameters<typeof QuickAnswer>[0]>)}
      />
    ),
  }
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const slugStr = slug.join('/')
  const page = getPageBySlug(slugStr)
  if (!page) notFound()

  // Branch on content type — place directory rendering not yet implemented
  if (page.frontmatter.type === 'place') {
    // TODO: render filterable place directory (restaurants, rentals, outfitters)
    notFound()
  }

  const { frontmatter, rawContent } = page
  const jsonLd = breadcrumbJsonLd(page)
  const components = buildArticleComponents(page)
  const showAffiliateBar = hasAffiliateContent(rawContent)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {showAffiliateBar && (
        <div className="bg-[--sand] px-page py-2 text-center text-xs text-[--ink]/70">
          This page contains affiliate links.{' '}
          <a href="/affiliate-disclosure" className="underline">
            See our disclosure.
          </a>
        </div>
      )}

      {/*
       * px-page: single inline padding for all content (clamp-based, set in globals.css).
       * max-w-3xl + mx-auto: centers prose/components at comfortable reading width.
       * PageHero uses .full-bleed to escape this container and span 100vw.
       */}
      <article className="px-page">
        <div className="mx-auto max-w-3xl">
          <MDXRemote source={rawContent} components={components} />
          <p className="mt-12 text-xs text-[--ink]/50">
            Last updated: {frontmatter.updated}
          </p>
        </div>
      </article>
    </>
  )
}
