import { Card } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { ProgressBar } from '../ui/ProgressBar'
import type { MaterialSubmissionStatus } from '../../data/mockSubmissionStatusData'
import styles from './SubmissionStatus.module.css'

const MAX_VISIBLE_AVATARS = 7

interface SubmissionStatusProps {
  status: MaterialSubmissionStatus
}

export function SubmissionStatus({ status }: SubmissionStatusProps) {
  const { totalMembers, submittedCount, submitters } = status
  const rate = totalMembers > 0 ? Math.round((submittedCount / totalMembers) * 100) : 0
  const visibleSubmitters = submitters.slice(0, MAX_VISIBLE_AVATARS)
  const overflowCount = Math.max(submittedCount - MAX_VISIBLE_AVATARS, 0)

  return (
    <section aria-label="제출 현황">
      <Card className={styles.card} padding="md">
        <h4 className={styles.title}>제출 현황</h4>

        <div className={styles.summaryRow}>
          <p className={styles.summary}>
            전체 <strong>{totalMembers}명</strong> 중 <strong>{submittedCount}명</strong> 완료
          </p>
          <span className={styles.rate}>{rate}%</span>
        </div>

        <ProgressBar value={rate} />

        {submittedCount > 0 && (
          <div className={styles.avatarGroup} aria-label={`${submittedCount}명 제출 완료`}>
            {visibleSubmitters.map((submitter) => (
              <Avatar
                key={submitter.id}
                src={submitter.imageUrl}
                fallbackEmoji={submitter.fallbackEmoji}
                backgroundColor={submitter.backgroundColor}
              />
            ))}
            {overflowCount > 0 && <span className={styles.overflow}>+{overflowCount}</span>}
          </div>
        )}
      </Card>
    </section>
  )
}
