import type { AdminPoll } from '../../../types/content'
import { AdminDrawer } from '../AdminDrawer'
import {
  AdminStatusBadge,
  pollStatusToVariant,
} from '../AdminStatusBadge'
import { ProgressBar } from '../../ui/ProgressBar'
import {
  getPollOperationalStatus,
  getPollParticipationRate,
  getPollStatusLabel,
} from './contentUtils'
import styles from './PollResultDrawer.module.css'

interface PollResultDrawerProps {
  poll: AdminPoll | null
  onClose: () => void
}

export function PollResultDrawer({ poll, onClose }: PollResultDrawerProps) {
  if (!poll) return null

  const status = getPollOperationalStatus(poll)
  const totalVotes = poll.options.reduce((sum, option) => sum + option.voteCount, 0)
  const participationRate = getPollParticipationRate(poll)

  return (
    <AdminDrawer isOpen={poll !== null} title="투표 결과" onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{poll.title}</h3>
          <AdminStatusBadge
            label={getPollStatusLabel(status)}
            variant={pollStatusToVariant(status)}
          />
        </div>

        <p className={styles.period}>
          {poll.startDate} ~ {poll.endDate}
          {poll.allowMultiple && ' · 복수 선택 허용'}
        </p>

        <div className={styles.summary}>
          <div>
            <span className={styles.summaryLabel}>참여</span>
            <strong>
              {poll.participantCount}/{poll.totalMembers}명
            </strong>
          </div>
          <div>
            <span className={styles.summaryLabel}>참여율</span>
            <strong>{participationRate}%</strong>
          </div>
        </div>

        <ul className={styles.optionList}>
          {poll.options.map((option) => {
            const percentage =
              totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0

            return (
              <li key={option.id} className={styles.optionItem}>
                <div className={styles.optionHeader}>
                  <span className={styles.optionLabel}>{option.label}</span>
                  <span className={styles.optionCount}>
                    {option.voteCount}표 ({percentage}%)
                  </span>
                </div>
                <ProgressBar value={percentage} max={100} />
              </li>
            )
          })}
        </ul>
      </div>
    </AdminDrawer>
  )
}
