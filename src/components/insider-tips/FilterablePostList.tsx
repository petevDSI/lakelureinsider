'use client'

import { useState } from 'react'
import type { InsiderPost } from '@/lib/insider-tips'
import { PostCard } from './PostCard'

export function FilterablePostList({ posts }: { posts: InsiderPost[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)))

  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts

  return (
    <div>
      {allTags.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              activeTag === null
                ? 'border-(--lake) bg-(--lake) text-white'
                : 'border-(--sand) bg-white text-(--ink)/70 hover:border-(--lake)/50'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                activeTag === tag
                  ? 'border-(--lake) bg-(--lake) text-white'
                  : 'border-(--sand) bg-white text-(--ink)/70 hover:border-(--lake)/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-(--ink)/50 py-4">No posts with this tag yet.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
