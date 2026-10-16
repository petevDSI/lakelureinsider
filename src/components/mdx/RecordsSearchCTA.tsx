import Link from 'next/link'

/** Callout that points readers to the Town records search. Used on the News index. */
export function RecordsSearchCTA() {
  return (
    <aside className="not-prose my-8 rounded-xl border border-(--lake)/30 bg-(--sand)/50 p-5 sm:p-6">
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-(--lake)">
        Free public tool
      </p>
      <h2 className="mt-2 font-display text-xl font-bold text-(--forest) sm:text-2xl">
        Search every Lake Lure town meeting document
      </h2>
      <p className="mt-2 max-w-2xl text-(--ink)/80">
        Minutes, agendas and meeting packets going back to 2021, saved in our own archive so they
        stay available. Search a name, a street, a project or a phrase, and jump straight to the
        page in the original PDF.
      </p>
      <Link
        href="/records"
        className="mt-4 inline-block rounded-md bg-(--lake) px-5 py-2.5 font-semibold text-white hover:brightness-110"
      >
        Search the town records →
      </Link>
    </aside>
  )
}
