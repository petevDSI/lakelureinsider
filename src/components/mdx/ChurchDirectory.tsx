import {
  CHURCHES,
  churchesLastVerified,
  type ChurchDenomination,
} from '@/data/facts'

const DENOMINATION_LABEL: Record<ChurchDenomination, string> = {
  baptist: 'Baptist',
  nondenominational: 'Non-Denominational',
  episcopal: 'Episcopal',
  catholic: 'Catholic',
  presbyterian: 'Presbyterian',
}

const DENOMINATION_ORDER: ChurchDenomination[] = [
  'baptist',
  'nondenominational',
  'episcopal',
  'catholic',
  'presbyterian',
]

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d]/g, '')}`
}

export function ChurchDirectory() {
  const verified = churchesLastVerified()

  return (
    <div className="not-prose my-8">
      {DENOMINATION_ORDER.map((denomination) => {
        const churches = CHURCHES.filter((c) => c.denomination === denomination)
        if (churches.length === 0) return null

        return (
          <div key={denomination} className="mb-8 last:mb-0">
            <h3 className="mb-3 font-display text-lg font-bold text-(--forest)">
              {DENOMINATION_LABEL[denomination]}
            </h3>
            <div className="flex flex-col gap-3">
              {churches.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border border-(--sand) bg-white p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <a
                      href={c.detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="font-semibold text-(--lake) underline underline-offset-2"
                    >
                      {c.name}
                    </a>
                    {c.phone && (
                      <a
                        href={phoneHref(c.phone)}
                        className="text-sm font-semibold text-(--clay)"
                      >
                        {c.phone}
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-(--ink)/80">{c.address}</p>
                  <p className="mt-1 text-sm text-(--ink)/70">{c.serviceTimes}</p>
                  <p className="mt-1 text-xs text-(--ink)/60">{c.travelNote}</p>
                  {c.notes && (
                    <p className="mt-2 text-xs text-(--ink)/70">{c.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <p className="mt-3 text-xs text-(--ink)/60">
        Service times change, especially around holidays — call ahead to confirm before
        driving out.
        {verified ? ` Church data last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
