import { getInsiderPostsByCluster } from '@/lib/insider-tips'
import { PostCard } from '@/components/insider-tips/PostCard'

interface Props {
  cluster: string
  heading?: string
}

export function RecentInsiderTips({ cluster, heading = 'Insider Tips' }: Props) {
  const posts = getInsiderPostsByCluster(cluster)
  if (posts.length === 0) return null

  return (
    <div className="not-prose my-8">
      <h2 className="font-display text-xl font-semibold text-[--forest] mb-3">{heading}</h2>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <a
        href="/insider-tips"
        className="mt-3 inline-block text-sm font-medium text-[--lake] hover:underline"
      >
        All insider tips →
      </a>
    </div>
  )
}
