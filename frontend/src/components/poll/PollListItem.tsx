import { useState } from 'react'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import type { AdminPoll } from '../../types/content'
import { useUserPoll } from '../../contexts/UserPollContext'
import { useToast } from '../../contexts/ToastContext'
import {
  formatPollPeriod,
  formatPollRemainText,
  getDaysUntilPollEnd,
  getPollResultPercentages,
} from '../../lib/poll/userPollUtils'
import styles from './PollListItem.module.css'

interface PollListItemProps {
  poll: AdminPoll
  isActive: boolean
}

export function PollListItem({ poll, isActive }: PollListItemProps) {
  const { hasVoted, getUserVote, submitVote } = useUserPoll()
  const { showToast } = useToast()
  const voted = hasVoted(poll.id)
  const userSelection = getUserVote(poll.id)

  const [selected, setSelected] = useState<string[]>(() => userSelection)

  const daysLeft = getDaysUntilPollEnd(poll.endDate)
  const resultPercents = getPollResultPercentages(poll)

  const toggleOption = (optionId: string) => {
    if (voted || !isActive) return

    if (poll.allowMultiple) {
      setSelected((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
      )
      return
    }

    setSelected([optionId])
  }

  const handleSubmit = () => {
    if (selected.length === 0) {
      showToast('투표할 항목을 선택해주세요.')
      return
    }
    submitVote(poll.id, selected)
    showToast('투표가 완료되었습니다.')
  }

  const showVoteForm = isActive && !voted

  return (
    <Card className={styles.card} padding="md">
      <div className={styles.header}>
        <h3 className={styles.title}>{poll.title}</h3>
        {isActive ? (
          <span className={styles.badgeActive}>진행중</span>
        ) : (
          <span className={styles.badgeClosed}>종료</span>
        )}
      </div>

      <p className={styles.period}>{formatPollPeriod(poll.startDate, poll.endDate)}</p>

      {isActive && (
        <p className={styles.remain}>{formatPollRemainText(daysLeft)}</p>
      )}

      {poll.allowMultiple && isActive && !voted && (
        <p className={styles.hint}>복수 선택 가능</p>
      )}

      <ul className={styles.options}>
        {poll.options.map((option) => {
          const isSelected = voted
            ? userSelection.includes(option.id)
            : selected.includes(option.id)
          const percent =
            resultPercents.find((item) => item.optionId === option.id)?.percent ?? 0
          const showResult = !showVoteForm

          return (
            <li key={option.id}>
              {showVoteForm ? (
                <button
                  type="button"
                  className={`${styles.optionBtn} ${isSelected ? styles.optionBtnSelected : ''}`}
                  onClick={() => toggleOption(option.id)}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`${styles.optionIndicator} ${
                      poll.allowMultiple ? styles.checkbox : styles.radio
                    } ${isSelected ? styles.optionIndicatorSelected : ''}`}
                    aria-hidden="true"
                  />
                  <span className={styles.optionLabel}>{option.label}</span>
                </button>
              ) : (
                <div className={styles.resultRow}>
                  <div className={styles.resultHeader}>
                    <span
                      className={`${styles.optionLabel} ${isSelected ? styles.optionLabelSelected : ''}`}
                    >
                      {option.label}
                      {isSelected && voted && (
                        <span className={styles.myVote}>내 선택</span>
                      )}
                    </span>
                    <span className={styles.percent}>{percent}%</span>
                  </div>
                  <div className={styles.resultBar}>
                    <ProgressBar value={percent} />
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {showVoteForm && (
        <button type="button" className={styles.submitBtn} onClick={handleSubmit}>
          투표하기
        </button>
      )}

      {isActive && voted && (
        <p className={styles.completed}>투표에 참여했습니다.</p>
      )}
    </Card>
  )
}
