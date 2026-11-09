import Image from 'next/image'
import { getAffiliate } from '@/data/affiliates'

interface ShopItem {
  /** Affiliate id in src/data/affiliates.ts */
  id: string
  /** Category shown as a small kicker, e.g. "Bedding" */
  category: string
  /** Product name. Leave the placeholder until the real item is known. */
  name: string
  /** Where it is in the house and why guests like it */
  description: string
  imageSrc?: string
  imageAlt?: string
}

interface ShopTheStayProps {
  items: ShopItem[]
}

/**
 * Product cards for "shop the stay" pages. Amazon prices change constantly
 * and Associates rules restrict showing them, so no prices are rendered.
 * An affiliate entry still set to '#' shows a disabled "Link coming soon"
 * button instead of a dead link.
 */
export function ShopTheStay({ items }: ShopTheStayProps) {
  return (
    <div className="not-prose my-10">
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => {
          const entry = getAffiliate(item.id)
          if (!entry) {
            console.warn(`[ShopTheStay] Unknown affiliate id: "${item.id}"`)
          }
          const ready = !!entry && entry.url !== '#' && entry.url !== ''
          return (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-(--sand) bg-white shadow-sm"
            >
              {item.imageSrc ? (
                <div className="relative h-52">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt ?? item.name}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-52 items-center justify-center bg-(--sand) text-sm font-medium text-(--forest)/60">
                  Photo coming soon
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-(--lake)">
                  {item.category}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-(--forest)">
                  {item.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-(--ink)/80">
                  {item.description}
                </p>
                {ready ? (
                  <a
                    href={entry!.url}
                    rel="sponsored nofollow noopener"
                    target="_blank"
                    className="mt-5 inline-flex items-center justify-center rounded-lg bg-(--clay) px-5 py-3 text-sm font-semibold !text-white no-underline transition-opacity hover:opacity-90"
                  >
                    {entry!.label}
                  </a>
                ) : (
                  <span
                    aria-disabled="true"
                    className="mt-5 inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-(--sand) bg-(--paper) px-5 py-3 text-sm font-semibold text-(--ink)/50"
                  >
                    Link coming soon
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-5 text-center text-xs text-(--ink)/60">
        As an Amazon Associate I earn from qualifying purchases.{' '}
        <a href="/affiliate-disclosure" className="underline">
          Disclosure
        </a>
      </p>
    </div>
  )
}
