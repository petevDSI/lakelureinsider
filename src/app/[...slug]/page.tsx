import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPages, getNewsSiblings, getPageBySlug } from '@/lib/content'
import { breadcrumbJsonLd } from '@/lib/jsonld'
import { SITE_URL } from '@/lib/site-config'
import { mdxComponents } from '@/components/mdx'
import { FAQ } from '@/components/mdx/FAQ'
import { PageHero } from '@/components/mdx/PageHero'
import { QuickAnswer } from '@/components/mdx/QuickAnswer'
import { ReviewedBanner } from '@/components/mdx/ReviewedBanner'
import { NewsArticleNav } from '@/components/news/NewsArticleNav'
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
    ReviewedBanner: () => <ReviewedBanner date={frontmatter.reviewedOn} />,
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

  // News-cluster articles (not the /news hub itself) get a side nav —
  // previous/next story, back to the hub, and the standing petition CTA.
  // Computed from published date, so new stories slot in automatically.
  const isNewsArticle = frontmatter.cluster === 'news' && page.slug !== 'news'
  const newsSiblings = isNewsArticle ? getNewsSiblings(page.slug) : null

  const articleBody = (
    <div className="prose max-w-3xl xl:col-start-2">
      {/*
       * options.mdxOptions.blockJS: next-mdx-remote defaults to stripping any
       * non-literal JSX attribute value (its "block JS expressions" XSS guard,
       * meant for untrusted/user-submitted MDX). Our content is all first-party,
       * repo-authored — but the default was silently dropping prop values like
       * <NearbyLinks pages={[...]} />, so every "Nearby"/related-links block on
       * the site rendered as nothing. blockJS: false restores those props while
       * blockDangerousJS (default true) still blocks eval/Function/require/etc.
       */}
      <MDXRemote
        source={rawContent}
        components={components}
        options={{ blockJS: false }}
      />
      <p className="mt-12 text-xs text-(--ink)/50">
        Last updated: {frontmatter.updated}
      </p>
    </div>
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {showAffiliateBar && (
        <div className="bg-(--sand) px-page py-2 text-center text-xs text-(--ink)/70">
          This page contains affiliate links.{' '}
          <a href="/affiliate-disclosure" className="underline">
            See our disclosure.
          </a>
        </div>
      )}

      {/*
       * px-page: single inline padding for all content (clamp-based, set in globals.css).
       * max-w-3xl + mx-auto: centers prose/components at comfortable reading width.
       *
       * News articles use a 3-track grid instead: minmax(0,1fr) | min(48rem,100%) | minmax(0,1fr).
       * The two minmax(0,1fr) gutter tracks are FORCED equal by the grid algorithm
       * (same base size, no differential content stretching them — the left one
       * is left empty), so the middle (article) track stays exactly centered on
       * the viewport, same as the plain max-w-3xl/mx-auto case. That matters
       * because PageHero uses .full-bleed (margin-inline: calc(50% - 50vw)) to
       * escape this container and span 100vw — that math only comes out right
       * when the article column's own containing block is centered on the
       * viewport. An earlier version used grid-cols-[1fr_300px], which is NOT
       * symmetric — the article column sat left-of-center, so full-bleed's
       * calc undershot on one side and overshot on the other, cropping the
       * hero on the left and leaving a gap on the right. Side nav sits in the
       * third (right) track via xl:col-start-3; below the xl breakpoint this
       * is a single implicit column and everything just stacks.
       */}
      <article className="px-page">
        {isNewsArticle && newsSiblings ? (
          <div className="mx-auto grid max-w-[90rem] gap-10 xl:grid-cols-[minmax(0,1fr)_min(48rem,100%)_minmax(0,1fr)]">
            {articleBody}
            <div className="xl:col-start-3">
              <NewsArticleNav
                prev={newsSiblings.prev}
                next={newsSiblings.next}
                position={newsSiblings.position}
                total={newsSiblings.total}
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">{articleBody}</div>
        )}
      </article>
    </>
  )
}
