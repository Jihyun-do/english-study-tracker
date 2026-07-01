import type { FeedPost } from '../../data/mockFeedData'
import styles from './SubmissionImage.module.css'

interface SubmissionImageProps {
  theme: FeedPost['imageTheme']
  userName: string
  variant?: 'default' | 'compact'
}

const THEME_CLASS = {
  lavender: styles.lavender,
  mint: styles.mint,
  peach: styles.peach,
  sky: styles.sky,
} as const

export function SubmissionImage({ theme, userName, variant = 'default' }: SubmissionImageProps) {
  return (
    <div
      className={`${styles.image} ${THEME_CLASS[theme]} ${variant === 'compact' ? styles.compact : ''}`}
      role="img"
      aria-label={`${userName}님의 학습 노트 이미지`}
    >
      <div className={styles.lines}>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <span className={styles.label}>학습 노트</span>
    </div>
  )
}
