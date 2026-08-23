export function WeddingContactCTA({
  venue = 'Chimney Rock State Park',
  phone,
  email,
  website,
}: {
  venue?: string
  phone?: string
  email?: string
  website?: string
}) {
  return (
    <div className="not-prose my-8 rounded-xl border border-(--clay)/30 bg-(--clay)/5 px-6 py-5">
      <p className="font-display text-lg font-bold text-(--forest)">
        Planning a wedding at {venue}?
      </p>
      <p className="mt-1.5 text-sm text-(--ink)/80">
        The park wedding coordinator handles permits, site selection, and logistics. Reach out early —
        popular dates and venues book quickly.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-(--clay) px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Call {phone}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-(--clay) px-4 py-2 text-sm font-semibold text-(--clay) transition-colors hover:bg-(--clay)/10"
          >
            Email
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-(--sand) px-4 py-2 text-sm font-semibold text-(--ink) transition-colors hover:bg-(--sand)"
          >
            Website
          </a>
        )}
      </div>
    </div>
  )
}
