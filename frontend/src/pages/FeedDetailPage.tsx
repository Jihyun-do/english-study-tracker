import { useCallback, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { FeedCard } from '../components/feed/FeedCard'
import { CommentSection } from '../components/feed/CommentSection'
import {
  getCommentsByPostId,
  getFeedPostById,
  mockCurrentUser,
  type FeedComment,
} from '../data/mockFeedData'
import styles from './FeedDetailPage.module.css'

interface FeedDetailPageProps {
  postId: string
  onBack: () => void
}

export function FeedDetailPage({ postId, onBack }: FeedDetailPageProps) {
  const post = getFeedPostById(postId)
  const [comments, setComments] = useState<FeedComment[]>(() => getCommentsByPostId(postId))

  const handleAddComment = useCallback(
    (comment: Omit<FeedComment, 'id' | 'createdAt'>) => {
      const newComment: FeedComment = {
        ...comment,
        id: `comment-${Date.now()}`,
        createdAt: '방금 전',
      }
      setComments((prev) => [...prev, newComment])
    },
    [],
  )

  if (!post) return null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="뒤로 가기">
          <ArrowLeft size={22} />
        </button>
        <h2 className={styles.headerTitle}>인증 상세</h2>
      </header>

      <FeedCard post={post} />

      <CommentSection
        postId={postId}
        comments={comments}
        currentUser={mockCurrentUser}
        onAddComment={handleAddComment}
      />
    </div>
  )
}
