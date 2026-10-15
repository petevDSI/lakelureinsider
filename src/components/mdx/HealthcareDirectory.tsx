import {
  HEALTHCARE_PROVIDERS,
  healthcareProvidersLastVerified,
  type HealthcareCategory,
} from '@/data/facts'

const CATEGORY_LABEL: Record<HealthcareCategory, string> = {
  hospital: 'Hospital / Emergency Room',
  'urgent-care': 'Urgent Care',
  'primary-care': 'Primary Care',
  dentist: 'Dentists',
  pharmacy: 'Pharmacies',
}

const CATEGORY_ORDER: HealthcareCategory[] = [
  'hospital',
  'urgent-care',
  'primary-care',
  'dentist',
  'pharmacy',
]

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d]/g, '')}`
}

export function HealthcareDirectory() {
  const verified = healthcareProvidersLastVerified()

  return (
    <div className="not-prose my-8">
      {CATEGORY_ORDER.map((category) => {
        const providers = HEALTHCARE_PROVIDERS.filter((p) => p.category === category)
        if (providers.length === 0) return null

        return (
          <div key={category} className="mb-8 last:mb-0">
            <h3 className="mb-4 mt-2 flex items-center gap-3 font-display text-2xl font-bold text-(--forest) before:h-7 before:w-1.5 before:rounded-full before:bg-(--lake)">
              {CATEGORY_LABEL[category]}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-(--sand) border-t-4 border-t-(--lake) bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <a
                      href={p.detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="font-display text-lg font-bold leading-tight text-(--forest) no-underline hover:text-(--lake) hover:underline hover:underline-offset-2"
                    >
                      {p.name}
                    </a>
                    {p.phone && (
                      <a
                        href={phoneHref(p.phone)}
                        className="inline-block rounded-lg bg-(--clay) px-3 py-1.5 text-sm font-semibold !text-white no-underline hover:opacity-90"
                      >
                        {p.phone}
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-(--ink)/80">{p.address}</p>
                  <p className="mt-1 text-sm text-(--ink)/70">{p.hours}</p>
                  <p className="mt-1 text-xs text-(--ink)/60">{p.travelNote}</p>
                  {p.notes && (
                    <p className="mt-2 text-xs text-(--ink)/70">{p.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <p className="mt-3 text-xs text-(--ink)/60">
        Phone numbers and hours change and get scraped inconsistently across directory
        sites — call ahead to confirm before relying on any of these.
        {verified ? ` Provider data last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
