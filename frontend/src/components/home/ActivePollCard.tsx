import { Card } from '../ui/Card'
import type { AdminPoll } from '../../types/content'
import {
  formatPollDday,
  formatPollRemainText,
  getDaysUntilPollEnd,
} from '../../lib/poll/userPollUtils'
import styles from './ActivePollCard.module.css'

interface ActivePollCardProps {
  poll: AdminPoll
  onVoteClick: () => void
}

export function ActivePollCard({ poll, onVoteClick }: ActivePollCardProps) {
  const daysLeft = getDaysUntilPollEnd(poll.endDate)

  return (
    <section>
      <Card className={styles.card} padding="md">
        <div className={styles.header}>
          <span className={styles.sectionLabel}>📋 진행 중인 투표</span>
          <span className={styles.dday}>{formatPollDday(daysLeft)}</span>
        </div>
        <h2 className={styles.pollTitle}>{poll.title}</h2>
        <p className={styles.remain}>{formatPollRemainText(daysLeft)}</p>
        <button type="button" className={styles.voteBtn} onClick={onVoteClick}>
          투표하기
        </button>
      </Card>
    </section>
  )
}
