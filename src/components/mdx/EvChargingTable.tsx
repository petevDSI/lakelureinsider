import { EV_CHARGERS, evChargersLastVerified, type ChargerSpeed } from '@/data/facts'

const SPEED_LABEL: Record<ChargerSpeed, string> = {
  level2: 'Level 2',
  dcFast: 'DC fast',
  supercharger: 'Supercharger',
}

const SPEED_STYLE: Record<ChargerSpeed, string> = {
  level2: 'bg-(--sand) text-(--ink)/80',
  dcFast: 'bg-(--lake)/15 text-(--lake)',
  supercharger: 'bg-(--forest)/15 text-(--forest)',
}

function SpeedBadge({ speed }: { speed: ChargerSpeed }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${SPEED_STYLE[speed]}`}
    >
      {SPEED_LABEL[speed]}
    </span>
  )
}

export function EvChargingTable() {
  const verified = evChargersLastVerified()
  const sorted = [...EV_CHARGERS].sort((a, b) => a.distanceMiles - b.distanceMiles)

  return (
    <div className="not-prose my-8">
      {/* Desktop table */}
      <div className="overflow-x-auto">
        <table className="hidden w-full border-collapse text-sm sm:table">
          <thead>
            <tr className="bg-(--forest) text-white">
              <th className="px-4 py-3 text-left font-semibold">Station</th>
              <th className="px-4 py-3 text-left font-semibold">From Lake Lure</th>
              <th className="px-4 py-3 text-left font-semibold">Ports</th>
              <th className="px-4 py-3 text-left font-semibold">Cost</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, ci) => (
              <tr key={c.id} className={ci % 2 === 0 ? 'bg-white' : 'bg-(--sand)'}>
                <td className="px-4 py-3 text-(--ink)">
                  <a
                    href={c.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-medium text-(--lake) underline underline-offset-2"
                  >
                    {c.name}
                  </a>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5">
                    <SpeedBadge speed={c.speed} />
                    <span className="text-xs text-(--ink)/60">
                      {c.network} · {c.connectors}
                    </span>
                  </span>
                  {c.note ? (
                    <span className="mt-1 block text-xs text-(--ink)/70">{c.note}</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-(--ink)">
                  {c.distanceMiles} mi / ~{c.driveMinutes} min
                  <span className="block text-xs text-(--ink)/60">via {c.route}</span>
                </td>
                <td className="px-4 py-3 text-(--ink)">{c.ports}</td>
                <td className="px-4 py-3 text-(--ink)">{c.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card stack */}
      <div className="flex flex-col gap-4 sm:hidden">
        {sorted.map((c) => (
          <div key={c.id} className="rounded-lg border border-(--sand) bg-white p-4">
            <a
              href={c.detailsUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-semibold text-(--lake) underline"
            >
              {c.name}
            </a>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <SpeedBadge speed={c.speed} />
              <span className="text-xs text-(--ink)/60">
                {c.network} · {c.connectors}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div>
                <div className="text-xs font-semibold text-(--ink)/60">Distance</div>
                <div className="text-sm text-(--ink)">
                  {c.distanceMiles} mi / ~{c.driveMinutes} min
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-(--ink)/60">Ports</div>
                <div className="text-sm text-(--ink)">{c.ports}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-(--ink)/60">Cost</div>
                <div className="text-sm text-(--ink)">{c.cost}</div>
              </div>
            </div>
            {c.note ? <p className="mt-2 text-xs text-(--ink)/70">{c.note}</p> : null}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-(--ink)/60">
        Distances are by road from downtown Lake Lure, not straight-line. Port counts and
        availability change — check the station's app or ChargeHub link before you count on
        it.
        {verified ? ` Station data last verified ${verified}.` : ''}
      </p>
    </div>
  )
}
