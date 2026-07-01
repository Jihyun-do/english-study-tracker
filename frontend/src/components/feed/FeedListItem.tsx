import { Heart, MessageCircle } from 'lucide-react'
import { SubmissionImage } from './SubmissionImage'
import { Card } from '../ui/Card'
import type { FeedPost } from '../../data/mockFeedData'
import { truncateFeedMemo } from '../../data/mockFeedData'
import styles from './FeedListItem.module.css'

interface FeedListItemProps {
  post: FeedPost
  onClick: () => void
}

export function FeedListItem({ post, onClick }: FeedListItemProps) {
  return (
    <button type="button" className={styles.cardBtn} onClick={onClick}>
      <Card className={styles.card} padding="sm">
        <div className={styles.thumb}>
          <SubmissionImage
            theme={post.imageTheme}
            userName={post.userName}
            variant="compact"
          />
        </div>

        <div className={styles.body}>
          <div className={styles.header}>
            <div
              className={styles.avatar}
              style={{ backgroundColor: post.avatarColor }}
              aria-hidden="true"
            >
              {post.userName.charAt(0)}
            </div>
            <span className={styles.userName}>{post.userName}</span>
          </div>

          <p className={styles.memo}>&ldquo;{truncateFeedMemo(post.memo)}&rdquo;</p>

          <div className={styles.stats}>
            <span className={styles.likes}>
              <Heart size={13} fill="currentColor" />
              {post.likeCount}
            </span>
            <span className={styles.comments}>
              <MessageCircle size={13} />
              {post.commentCount}
            </span>
          </div>

          <span className={styles.time}>{post.submittedAt}</span>
        </div>
      </Card>
    </button>
  )
}
