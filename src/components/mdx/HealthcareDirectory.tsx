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
            <h3 className="mb-3 font-display text-lg font-bold text-(--forest)">
              {CATEGORY_LABEL[category]}
            </h3>
            <div className="flex flex-col gap-3">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg border border-(--sand) bg-white p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <a
                      href={p.detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="font-semibold text-(--lake) underline underline-offset-2"
                    >
                      {p.name}
                    </a>
                    {p.phone && (
                      <a
                        href={phoneHref(p.phone)}
                        className="text-sm font-semibold text-(--clay)"
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
