import { getInsiderPosts } from '@/lib/insider-tips'
import { FilterablePostList } from '@/components/insider-tips/FilterablePostList'

export function InsiderTipsIndex() {
  const posts = getInsiderPosts()
  if (posts.length === 0) {
    return <p className="text-(--ink)/50 py-4">No posts yet — check back soon.</p>
  }
  return <FilterablePostList posts={posts} />
}
