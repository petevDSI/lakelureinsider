interface ComparisonTableProps {
  headers: string[]
  rows: string[][]
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="not-prose my-8 overflow-x-auto">
      {/* Desktop table */}
      <table className="hidden w-full border-collapse text-sm sm:table">
        <thead>
          <tr className="bg-(--forest) text-white">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={ri % 2 === 0 ? 'bg-white' : 'bg-(--sand)'}
            >
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-(--ink)">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile card stack */}
      <div className="flex flex-col gap-4 sm:hidden">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="rounded-lg border border-(--sand) bg-white p-4"
          >
            {headers.map((header, ci) => (
              <div key={ci} className="flex justify-between py-1">
                <span className="text-xs font-semibold text-(--ink)/60">
                  {header}
                </span>
                <span className="text-sm text-(--ink)">{row[ci]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
