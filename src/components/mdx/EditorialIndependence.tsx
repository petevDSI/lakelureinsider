export function EditorialIndependence() {
  return (
    <div className="not-prose my-6 flex items-center gap-3 rounded-lg border border-(--ink)/10 bg-white px-4 py-3">
      <span className="shrink-0 text-(--ink)/25 select-none" aria-hidden="true">◆</span>
      <p className="text-sm text-(--ink)/60">
        <span className="font-semibold text-(--ink)/75">Editorial independence:</span>{' '}
        We take no money from any venue on this page — no fees, referral commissions, or
        sponsorships. Listings and comparisons reflect public information only.
      </p>
    </div>
  )
}
