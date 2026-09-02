import {
  SALONS_SPAS,
  salonsSpasLastVerified,
  type SalonCategory,
} from '@/data/facts'

const CATEGORY_LABEL: Record<SalonCategory, string> = {
  hair: 'Hair Salons & Barbershops',
  spa: 'Spas & Massage',
  nails: 'Nail Salons',
}

const CATEGORY_ORDER: SalonCategory[] = ['hair', 'spa', 'nails']

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d]/g, '')}`
}

export function SalonSpaDirectory() {
  const verified = salonsSpasLastVerified()

  return (
    <div className="not-prose my-8">
      {CATEGORY_ORDER.map((category) => {
        const listings = SALONS_SPAS.filter((s) => s.category === category)
        if (listings.length === 0) return null

        return (
          <div key={category} className="mb-8 last:mb-0">
            <h3 className="mb-3 font-display text-lg font-bold text-(--forest)">
              {CATEGORY_LABEL[category]}
            </h3>
            <div className="flex flex-col gap-3">
              {listings.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-(--sand) bg-white p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <a
                      href={s.detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="font-semibold text-(--lake) underline underline-offset-2"
                    >
                      {s.name}
                    </a>
                    {s.phone && (
                      <a
                        href={phoneHref(s.phone)}
                        className="text-sm font-semibold text-(--clay)"
                      >
                        {s.phone}
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-(--ink)/80">{s.address}</p>
                  <p className="mt-1 text-sm text-(--ink)/70">{s.hours}</p>
                  <p className="mt-1 text-xs text-(--ink)/60">{s.travelNote}</p>
                  {s.notes && (
                    <p className="mt-2 text-xs text-(--ink)/70">{s.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <p className="mt-3 text-xs text-(--ink)/60">
        Hours and status change, especially at smaller businesses — call ahead to confirm
        before driving out.
        {verified ? ` Data last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
