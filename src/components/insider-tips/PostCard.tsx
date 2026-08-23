import Image from 'next/image'
import type { InsiderPost } from '@/lib/insider-tips'

export function PostCard({ post }: { post: InsiderPost }) {
  return (
    <a
      href={`/${post.slug}`}
      className="group flex gap-4 rounded-lg border border-(--sand) bg-white p-4 hover:border-(--lake)/40 transition-colors"
    >
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-(--sand)">
        <Image
          src={post.heroImage}
          alt={post.heroAlt}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-(--ink)/40 mb-1">{post.published}</p>
        <h3 className="font-semibold text-(--forest) leading-snug group-hover:text-(--lake) text-sm">
          {post.title}
        </h3>
        <p className="text-xs text-(--ink)/60 mt-1 line-clamp-2">{post.description}</p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-(--sand) text-(--ink)/60 rounded-full px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}
