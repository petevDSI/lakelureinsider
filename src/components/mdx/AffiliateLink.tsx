import { getAffiliate } from '@/data/affiliates'

interface AffiliateLinkProps {
  id: string
  children?: React.ReactNode
}

export function AffiliateLink({ id, children }: AffiliateLinkProps) {
  const entry = getAffiliate(id)
  if (!entry) {
    console.warn(`[AffiliateLink] Unknown affiliate id: "${id}"`)
    return <span>{children ?? id}</span>
  }
  return (
    <a
      href={entry.url}
      rel="sponsored nofollow noopener"
      target="_blank"
    >
      {children ?? entry.label}
    </a>
  )
}
