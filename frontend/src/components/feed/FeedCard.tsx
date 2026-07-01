import { Heart } from 'lucide-react'
import { Card } from '../ui/Card'
import type { FeedPost } from '../../data/mockFeedData'
import { useLikeToggle } from '../../hooks/useLikeToggle'
import { SubmissionImage } from './SubmissionImage'
import { MiniAudioPlayer } from './MiniAudioPlayer'
import styles from './FeedCard.module.css'

interface FeedCardProps {
  post: FeedPost
}

export function FeedCard({ post }: FeedCardProps) {
  const { isLiked, likeCount, toggleLike } = useLikeToggle(post.isLiked, post.likeCount)

  return (
    <Card className={styles.card} padding="md">
      <div className={styles.header}>
        <div
          className={styles.avatar}
          style={{ backgroundColor: post.avatarColor }}
          aria-hidden="true"
        >
          {post.userName.charAt(0)}
        </div>
        <div className={styles.meta}>
          <p className={styles.userName}>{post.userName}</p>
          <p className={styles.date}>{post.submittedAt}</p>
        </div>
      </div>

      <p className={styles.memo}>{post.memo}</p>

      <SubmissionImage theme={post.imageTheme} userName={post.userName} />

      {post.hasAudio && post.audioDuration && (
        <div className={styles.audioWrap}>
          <MiniAudioPlayer duration={post.audioDuration} />
        </div>
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
          onClick={toggleLike}
          aria-pressed={isLiked}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>
      </div>
    </Card>
  )
}
