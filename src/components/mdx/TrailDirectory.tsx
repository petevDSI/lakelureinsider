import {
  RUTHERFORD_TRAILS,
  RUTHERFORD_TRAIL_AREAS,
  RUTHERFORD_TRAILS_SOURCE_URL,
  RUTHERFORD_TRAILS_SOURCE_NAME,
  RUTHERFORD_TRAILS_LAST_VERIFIED,
  type TrailDifficulty,
} from '@/data/facts'

const DIFFICULTY_STYLE: Record<TrailDifficulty, string> = {
  Easy: 'bg-(--forest)/15 text-(--forest)',
  Moderate: 'bg-(--sand) text-(--ink)/80',
  Strenuous: 'bg-(--clay)/15 text-(--clay)',
}

function DifficultyBadge({ difficulty }: { difficulty: TrailDifficulty }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${DIFFICULTY_STYLE[difficulty]}`}
    >
      {difficulty}
    </span>
  )
}

export function TrailDirectory() {
  return (
    <div className="not-prose my-8">
      <p className="mb-6 text-sm text-(--ink)/80">
        Full county trail directory from the{' '}
        <a
          href={RUTHERFORD_TRAILS_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="font-semibold text-(--lake) underline underline-offset-2"
        >
          {RUTHERFORD_TRAILS_SOURCE_NAME}
        </a>
        , the nonprofit that builds, maintains, and promotes trails across Rutherford
        County — hiking, walking, running, biking, climbing, camping, equestrian, and
        paddling.
      </p>

      {RUTHERFORD_TRAIL_AREAS.map((area) => {
        const trails = RUTHERFORD_TRAILS.filter((t) => t.area === area)
        if (trails.length === 0) return null

        return (
          <div key={area} className="mb-8 last:mb-0">
            <h3 className="mb-3 font-display text-lg font-bold text-(--forest)">{area}</h3>

            {/* Desktop table */}
            <div className="overflow-x-auto">
              <table className="hidden w-full border-collapse text-sm sm:table">
                <thead>
                  <tr className="bg-(--forest) text-white">
                    <th className="px-4 py-3 text-left font-semibold">Trail</th>
                    <th className="px-4 py-3 text-left font-semibold">Length</th>
                    <th className="px-4 py-3 text-left font-semibold">Difficulty</th>
                    <th className="px-4 py-3 text-left font-semibold">Elevation Gain</th>
                    <th className="px-4 py-3 text-left font-semibold">Est. Time</th>
                  </tr>
                </thead>
                <tbody>
                  {trails.map((t, ti) => (
                    <tr key={t.id} className={ti % 2 === 0 ? 'bg-white' : 'bg-(--sand)'}>
                      <td className="px-4 py-3 font-medium text-(--ink)">{t.name}</td>
                      <td className="px-4 py-3 text-(--ink)">{t.length}</td>
                      <td className="px-4 py-3">
                        <DifficultyBadge difficulty={t.difficulty} />
                      </td>
                      <td className="px-4 py-3 text-(--ink)">{t.elevationGain}</td>
                      <td className="px-4 py-3 text-(--ink)">{t.estTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card stack */}
            <div className="flex flex-col gap-3 sm:hidden">
              {trails.map((t) => (
                <div key={t.id} className="rounded-lg border border-(--sand) bg-white p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-(--ink)">{t.name}</span>
                    <DifficultyBadge difficulty={t.difficulty} />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs font-semibold text-(--ink)/60">Length</div>
                      <div className="text-sm text-(--ink)">{t.length}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-(--ink)/60">Elevation</div>
                      <div className="text-sm text-(--ink)">{t.elevationGain}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-(--ink)/60">Est. Time</div>
                      <div className="text-sm text-(--ink)">{t.estTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <p className="mt-3 text-xs text-(--ink)/60">
        Distances, elevation, and time estimates come from the Rutherford Outdoor
        Coalition&apos;s own trail data, not our own measurements — conditions and
        access can change, so check{' '}
        <a
          href={RUTHERFORD_TRAILS_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="underline underline-offset-2"
        >
          their trails page
        </a>{' '}
        before you go. Directory last verified {RUTHERFORD_TRAILS_LAST_VERIFIED}.
      </p>
    </div>
  )
}
