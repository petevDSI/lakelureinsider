import { GROCERY_STORES, groceryStoresLastVerified } from '@/data/facts'

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d]/g, '')}`
}

export function GroceryStores() {
  const verified = groceryStoresLastVerified()

  return (
    <div className="not-prose my-8">
      <div className="flex flex-col gap-3">
        {GROCERY_STORES.map((g) => (
          <div key={g.id} className="rounded-lg border border-(--sand) bg-white p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <a
                href={g.detailsUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-semibold text-(--lake) underline underline-offset-2"
              >
                {g.name}
              </a>
              <a href={phoneHref(g.phone)} className="text-sm font-semibold text-(--clay)">
                {g.phone}
              </a>
            </div>
            <div className="mt-0.5 text-xs text-(--ink)/60">{g.type}</div>
            <p className="mt-1 text-sm text-(--ink)/80">{g.address}</p>
            <p className="mt-1 text-sm text-(--ink)/70">{g.hours}</p>
            <p className="mt-1 text-xs text-(--ink)/60">{g.services}</p>
            <p className="mt-2 text-xs text-(--ink)/70">{g.travelNote}</p>
            {g.notes && <p className="mt-2 text-xs text-(--ink)/70">{g.notes}</p>}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-(--ink)/60">
        Hours and services change — call ahead if you're planning around them.
        {verified ? ` Last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
