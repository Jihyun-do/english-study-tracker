import { useState } from 'react'
import { FeedListItem } from '../components/feed/FeedListItem'
import { FeedDetailPage } from './FeedDetailPage'
import { EmptyState } from '../components/ui/EmptyState'
import { mockFeedPosts } from '../data/mockFeedData'
import styles from './FeedPage.module.css'

export function FeedPage() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  if (selectedPostId) {
    return (
      <FeedDetailPage
        postId={selectedPostId}
        onBack={() => setSelectedPostId(null)}
      />
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h2 className={styles.title}>인증 피드</h2>
        <p className={styles.subtitle}>스터디원들의 학습 인증을 빠르게 확인해보세요</p>
      </header>

      {mockFeedPosts.length === 0 ? (
        <EmptyState message="아직 인증글이 없습니다." variant="boxed" />
      ) : (
        <ul className={styles.list}>
          {mockFeedPosts.map((post) => (
            <li key={post.id}>
              <FeedListItem post={post} onClick={() => setSelectedPostId(post.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
