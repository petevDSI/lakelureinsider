import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-(--lake)">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-(--forest) sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-base text-(--ink)/70">
        That page doesn&apos;t exist. The park is open, though.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-(--forest) px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to Home
        </Link>
        <Link
          href="/chimney-rock"
          className="rounded-md border border-(--sand) px-5 py-2.5 text-sm font-semibold text-(--ink) transition-colors hover:bg-(--sand)"
        >
          Chimney Rock Guide
        </Link>
        <Link
          href="/lake-lure"
          className="rounded-md border border-(--sand) px-5 py-2.5 text-sm font-semibold text-(--ink) transition-colors hover:bg-(--sand)"
        >
          Lake Lure Guide
        </Link>
      </div>
    </div>
  )
}
