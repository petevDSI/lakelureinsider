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
            <h3 className="mb-4 mt-2 flex items-center gap-3 font-display text-2xl font-bold text-(--forest) before:h-7 before:w-1.5 before:rounded-full before:bg-(--lake)">
              {DENOMINATION_LABEL[denomination]}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {churches.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-(--sand) border-t-4 border-t-(--lake) bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <a
                      href={c.detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="font-display text-lg font-bold leading-tight text-(--forest) no-underline hover:text-(--lake) hover:underline hover:underline-offset-2"
                    >
                      {c.name}
                    </a>
                    {c.phone && (
                      <a
                        href={phoneHref(c.phone)}
                        className="inline-block rounded-lg bg-(--clay) px-3 py-1.5 text-sm font-semibold !text-white no-underline hover:opacity-90"
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
