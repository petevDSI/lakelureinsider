import type { Metadata } from 'next'
import Link from 'next/link'
import { RecordsSearch } from '@/components/records/RecordsSearch'

export const metadata: Metadata = {
  title: 'Lake Lure Town Records Search — Minutes, Agendas & Packets',
  description:
    'A free, searchable archive of Town of Lake Lure meeting minutes, agendas and agenda packets since 2021. Search by name, place, project or keyword and open the original PDF at the right page.',
  alternates: { canonical: '/records' },
}

export default function RecordsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-(--lake)">
        Lake Lure Insider · Public records archive
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold text-(--forest) sm:text-4xl">
        Lake Lure Town Records Search
      </h1>
      <p className="mt-3 max-w-2xl text-(--ink)/80">
        Search Town Council and board minutes, agendas and meeting packets by name, place,
        project or keyword. Every result opens the original PDF at the page where the words
        appear.
      </p>

      <div className="mt-8">
        <RecordsSearch />
      </div>

      <div className="mt-12 border-t border-(--sand) pt-5 text-sm text-(--ink)/70">
        <p>
          This archive is an independent project of Lake Lure Insider. It is not run by or
          affiliated with the Town of Lake Lure. Documents are copies of public records kept so
          they stay available and searchable.
        </p>
        <p className="mt-2">
          Text is read automatically from the PDFs, and scanned pages are read by optical
          character recognition, so names and numbers can contain errors. Always confirm
          important details against the original PDF, which every result links to. To report an
          error or request a correction, <Link href="/contact" className="text-(--lake) underline">contact us</Link>.
        </p>
      </div>
    </div>
  )
}
