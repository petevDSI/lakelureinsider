import {
  RESTAURANTS,
  RESTAURANT_AREAS,
  computeCumulativeRating,
  restaurantsLastVerified,
  type Restaurant,
} from '@/data/facts'

function Stars({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-semibold text-(--forest)">
      {score.toFixed(1)}
      <span aria-hidden="true" className="text-(--clay)">
        ★
      </span>
    </span>
  )
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const cumulative = computeCumulativeRating(restaurant)

  return (
    <div className="rounded-lg border border-(--sand) bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <a
            href={restaurant.detailsUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-semibold text-(--lake) underline underline-offset-2"
          >
            {restaurant.name}
          </a>
          <div className="mt-0.5 text-sm text-(--ink)/70">
            {restaurant.cuisine} · {restaurant.priceRange}
          </div>
        </div>
        <div className="text-right">
          <Stars score={cumulative.score} />
          <div className="text-xs text-(--ink)/60">
            {cumulative.totalReviews.toLocaleString()} reviews across{' '}
            {cumulative.platformCount} platform{cumulative.platformCount === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      <p className="mt-2 text-sm text-(--ink)/80">{restaurant.address}</p>
      {restaurant.phone && (
        <a href={`tel:${restaurant.phone.replace(/[^\d]/g, '')}`} className="text-sm font-semibold text-(--clay)">
          {restaurant.phone}
        </a>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-(--ink)/70">
        {restaurant.google && (
          <span>Google: {restaurant.google.rating.toFixed(1)}★ ({restaurant.google.count.toLocaleString()})</span>
        )}
        {restaurant.tripadvisor && (
          <span>
            Tripadvisor: {restaurant.tripadvisor.rating.toFixed(1)}★ (
            {restaurant.tripadvisor.count.toLocaleString()})
          </span>
        )}
        {restaurant.facebook && (
          <span>
            Facebook: {restaurant.facebook.recommendPercent}% recommend (
            {restaurant.facebook.count.toLocaleString()})
          </span>
        )}
      </div>
    </div>
  )
}

export function RestaurantDirectory() {
  const verified = restaurantsLastVerified()

  return (
    <div className="not-prose my-8">
      {RESTAURANT_AREAS.map((area) => {
        const restaurants = RESTAURANTS.filter((r) => r.area === area).sort(
          (a, b) => computeCumulativeRating(b).score - computeCumulativeRating(a).score,
        )
        if (restaurants.length === 0) return null

        return (
          <div key={area} className="mb-8 last:mb-0">
            <h3 className="mb-3 font-display text-lg font-bold text-(--forest)">{area}</h3>
            <div className="flex flex-col gap-3">
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </div>
        )
      })}

      <p className="mt-3 text-xs text-(--ink)/60">
        <strong>How the cumulative rating works:</strong> a review-count-weighted average
        across Google, Tripadvisor, and Facebook (Facebook&apos;s &quot;% recommend&quot; is
        converted to an approximate 5-star equivalent). Yelp is not included — yelp.com
        blocks automated data collection. Ratings and review counts change constantly;
        treat this as a snapshot, not a live feed.
        {verified ? ` Last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
