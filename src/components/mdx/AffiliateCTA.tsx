import { getAffiliate } from '@/data/affiliates'

interface AffiliateCTAProps {
  affiliateId: string
  headline: string
  subtext?: string
}

export function AffiliateCTA({ affiliateId, headline, subtext }: AffiliateCTAProps) {
  const entry = getAffiliate(affiliateId)
  if (!entry) {
    console.warn(`[AffiliateCTA] Unknown affiliate id: "${affiliateId}"`)
    return null
  }
  return (
    <div className="not-prose my-10 rounded-lg bg-[--sand] px-6 py-7 text-center">
      <p className="mb-1 text-xl font-bold text-[--forest]">{headline}</p>
      {subtext && (
        <p className="mb-4 text-sm text-[--ink]/70">{subtext}</p>
      )}
      <a
        href={entry.url}
        rel="sponsored nofollow noopener"
        target="_blank"
        className="inline-block rounded-md bg-[--clay] px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        {entry.label}
      </a>
      <p className="mt-3 text-xs text-[--ink]/50">
        This is an affiliate link. We may earn a commission at no extra cost to you.{' '}
        <a href="/affiliate-disclosure" className="underline">
          Disclosure
        </a>
      </p>
    </div>
  )
}
