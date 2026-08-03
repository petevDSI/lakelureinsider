import type { FaqItem } from '@/types/content'
import { faqPageJsonLd } from '@/lib/jsonld'

interface FAQProps {
  faqs?: FaqItem[]
}

export function FAQ({ faqs }: FAQProps) {
  if (!faqs || faqs.length === 0) return null

  const jsonLd = faqPageJsonLd(faqs)

  return (
    <section className="not-prose my-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="mb-6 font-display text-2xl font-bold text-[--forest]">
        Frequently Asked Questions
      </h2>
      <dl className="divide-y divide-[--sand]">
        {faqs.map((faq, i) => (
          <details key={i} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <dt className="text-base font-semibold text-[--ink]">{faq.q}</dt>
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-[--lake] transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <dd className="mt-3 text-base leading-relaxed text-[--ink]/80">
              {faq.a}
            </dd>
          </details>
        ))}
      </dl>
    </section>
  )
}
