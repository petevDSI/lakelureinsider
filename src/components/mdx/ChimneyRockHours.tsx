import { getCurrentChimneyRockSeason, CR_SEASONS } from '@/data/facts'
import type { ChimneyRockSeason } from '@/data/facts'

const BUILD_DATE = new Date()

function SeasonCard({
  season,
  isCurrent,
}: {
  season: ChimneyRockSeason
  isCurrent: boolean
}) {
  const isUnconfirmed = season.status === 'unconfirmed'
  const isClosed = season.status === 'closed'

  return (
    <div
      className={`rounded-lg border p-4 ${
        isCurrent
          ? 'border-[--lake] bg-white ring-1 ring-[--lake]'
          : 'border-[--sand] bg-white'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[--lake]">
            {season.dateRange}
          </p>
          <p className="mt-0.5 font-semibold text-[--forest]">{season.name}</p>
        </div>
        {isCurrent && (
          <span className="shrink-0 rounded-full bg-[--lake] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Current
          </span>
        )}
      </div>

      {isClosed && (
        <p className="mt-2 font-semibold text-[--clay]">Closed</p>
      )}

      {isUnconfirmed && (
        <p className="mt-2 text-sm italic text-[--ink]/60">
          Hours not published — call ahead before visiting.
        </p>
      )}

      {!isClosed && !isUnconfirmed && season.hours && (
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <div>
            <dt className="text-[--ink]/50">Gate opens</dt>
            <dd className="font-semibold text-[--ink]">
              {season.hours.entryOpen}
            </dd>
          </div>
          <div>
            <dt className="text-[--ink]/50">Last entry</dt>
            <dd className="font-semibold text-[--ink]">
              {season.hours.entryClose}
            </dd>
          </div>
          <div>
            <dt className="text-[--ink]/50">Park closes</dt>
            <dd className="font-semibold text-[--ink]">
              {season.hours.parkClose}
            </dd>
          </div>
        </dl>
      )}

      {season.hours?.trailClosings && season.hours.trailClosings.length > 0 && (
        <div className="mt-3 border-t border-[--sand] pt-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[--ink]/50">
            Trail closings
          </p>
          {season.hours.trailClosings.map((tc) => (
            <div key={tc.name} className="flex justify-between text-sm">
              <span className="text-[--ink]/80">{tc.name}</span>
              <span className="font-medium text-[--ink]">{tc.closes}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ChimneyRockHours() {
  const currentSeason = getCurrentChimneyRockSeason(BUILD_DATE)

  const mainSeasons: ChimneyRockSeason[] = [CR_SEASONS.main, CR_SEASONS.fallWinter]

  return (
    <div className="not-prose my-8">
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        {mainSeasons.map((season) => (
          <SeasonCard
            key={season.key}
            season={season}
            isCurrent={currentSeason.key === season.key}
          />
        ))}
      </div>

      {/* Early year unconfirmed */}
      <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
        <span className="font-semibold text-amber-800">
          January 1 – March 7:
        </span>{' '}
        <span className="text-amber-700">
          Hours for this period are not published at chimneyrockpark.com. Check
          the park website or call ahead before planning a visit.
        </span>
      </div>

      {/* Special reduced days */}
      <div className="mb-3 rounded-lg border border-[--sand] bg-[--sand] px-4 py-3 text-sm">
        <p className="font-semibold text-[--ink]">
          Thanksgiving Day &amp; Christmas Eve:
        </p>
        <p className="text-[--ink]/80">
          {CR_SEASONS.thanksgiving.hours?.entryOpen} –{' '}
          {CR_SEASONS.thanksgiving.hours?.parkClose}
        </p>
        <p className="mt-1 text-xs text-[--ink]/50">
          Source lists a single operating window — separate entry deadline not confirmed.
          Arrive by 2:30 PM to be safe.
        </p>
        <p className="mt-1 font-semibold text-[--clay]">
          Christmas Day: Closed
        </p>
      </div>

      {/* Road conditions live link */}
      <div className="rounded-lg border border-[--lake]/30 bg-[--lake]/5 px-4 py-3 text-sm text-[--ink]/70">
        <span className="font-semibold text-[--lake]">Road conditions:</span>{' '}
        US-64 (from Hendersonville) and NC-9 (from Lake Lure) are both access
        routes. Current road status:{' '}
        <a
          href="https://drivenc.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[--lake] underline underline-offset-2"
        >
          drivenc.gov
        </a>{' '}
        — check before driving in winter or after heavy rain.
      </div>

      <p className="mt-3 text-right text-xs text-[--ink]/40">
        Verified {CR_SEASONS.main.lastVerified} ·{' '}
        <a
          href={CR_SEASONS.main.source}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          chimneyrockpark.com
        </a>
      </p>
    </div>
  )
}
