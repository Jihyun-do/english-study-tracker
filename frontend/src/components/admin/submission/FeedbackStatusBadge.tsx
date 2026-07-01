import { Check, Circle } from 'lucide-react'
import type { AdminSubmissionItem } from '../../../data/mockAdminData'
import { getFeedbackStatus, type FeedbackStatus } from './submissionUtils'
import styles from './FeedbackStatusBadge.module.css'

export type { FeedbackStatus }

interface FeedbackStatusBadgeProps {
  item: AdminSubmissionItem
  showTime?: boolean
  variant?: 'default' | 'table'
}

export function FeedbackStatusBadge({
  item,
  showTime = false,
  variant = 'default',
}: FeedbackStatusBadgeProps) {
  const status = getFeedbackStatus(item)
  if (!status) return null

  const isCompleted = status === 'completed'
  const unreadCount = item.unreadSubmitterCommentCount ?? 0
  const hasNewComments = isCompleted && unreadCount > 0
  const displayTime = (showTime || variant === 'table') && isCompleted && item.feedbackAt

  return (
    <div className={`${styles.wrap} ${styles[variant]}`}>
      <div className={styles.badgeRow}>
        <span
          className={`${styles.badge} ${isCompleted ? styles.completed : styles.pending}`}
        >
          {isCompleted ? (
            <>
              <Check size={12} className={styles.badgeIcon} aria-hidden="true" />
              피드백 완료
            </>
          ) : (
            <>
              <Circle size={10} fill="currentColor" className={styles.pendingIcon} aria-hidden="true" />
              피드백 대기
            </>
          )}
        </span>
        {hasNewComments && (
          <span className={styles.newCommentBadge}>
            <span className={styles.newCommentDot} aria-hidden="true" />
            새 댓글
          </span>
        )}
      </div>

      {displayTime && <span className={styles.time}>{item.feedbackAt}</span>}
    </div>
  )
}
