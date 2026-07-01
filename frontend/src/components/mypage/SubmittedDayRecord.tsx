import { useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import { Card } from '../ui/Card'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { SubmissionImage } from '../feed/SubmissionImage'
import { MiniAudioPlayer } from '../feed/MiniAudioPlayer'
import { CommentList } from '../feed/CommentList'
import { SubmissionItemMenu } from './SubmissionItemMenu'
import type { DayRecord } from '../../data/mockMyPageData'
import { hasUnreadFeedback } from '../../data/mockMyPageData'
import { useAppNavigation } from '../../context/AppNavigationContext'
import { useMyPageSubmissions } from '../../contexts/MyPageSubmissionsContext'
import { useToast } from '../../contexts/ToastContext'
import { isBeforeSubmissionDeadline } from '../../submission/submissionUtils'
import styles from './DayRecordPanel.module.css'

interface SubmittedDayRecordProps {
  year: number
  month: number
  weekday: string
  day: number
  record: DayRecord
}

export function SubmittedDayRecord({ year, month, weekday, day, record }: SubmittedDayRecordProps) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [feedbackLastReadAt, setFeedbackLastReadAt] = useState(record.feedbackLastReadAt ?? null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { openEditSubmission } = useAppNavigation()
  const { deleteSubmission } = useMyPageSubmissions()
  const { showToast } = useToast()

  const feedbacks = record.feedbacks ?? []
  const feedbackCount = record.feedbackCount ?? feedbacks.length
  const hasUnread = hasUnreadFeedback(feedbacks, feedbackLastReadAt)
  const canEdit = record.dueAt ? isBeforeSubmissionDeadline(record.dueAt) : false

  const toggleFeedback = () => {
    setIsFeedbackOpen((prev) => {
      const next = !prev
      if (next) {
        setFeedbackLastReadAt(new Date().toISOString())
      }
      return next
    })
  }

  const handleEdit = () => {
    if (!record.submissionId || !record.assignmentId) return

    openEditSubmission({
      submissionId: record.submissionId,
      assignmentId: record.assignmentId,
      day,
      year,
      month,
      initialMemo: record.memo ?? '',
      initialImageTheme: record.submissionImageTheme,
      initialAudioFileName: record.submissionAudioFileName,
      initialAudioDuration: record.submissionAudioDuration,
    })
  }

  const handleDeleteConfirm = () => {
    deleteSubmission(day)
    setIsDeleteDialogOpen(false)
    showToast('제출이 삭제되었습니다.')
  }

  return (
    <div className={styles.panel}>
      <div className={styles.recordHeader}>
        <h3 className={styles.recordTitle}>
          {month}월 {day}일 ({weekday}) 기록
        </h3>
        <span className={styles.completedBadge}>🟢 과제 제출 완료</span>
      </div>

      <Card className={styles.recordCard} padding="md">
        <div className={styles.assignmentHeader}>
          <span className={styles.assignmentLabel}>제출한 과제</span>
          <div className={styles.assignmentHeaderActions}>
            {record.submittedTime && (
              <time className={styles.submittedTime}>{record.submittedTime}</time>
            )}
            <SubmissionItemMenu
              canEdit={canEdit}
              onEdit={handleEdit}
              onDelete={() => setIsDeleteDialogOpen(true)}
            />
          </div>
        </div>

        {record.assignmentTitle && (
          <p className={styles.assignmentTitle}>{record.assignmentTitle}</p>
        )}

        {record.memo && <p className={styles.memo}>&ldquo;{record.memo}&rdquo;</p>}

        {record.submissionImageTheme && (
          <>
            <div className={styles.divider} />
            <SubmissionImage theme={record.submissionImageTheme} userName="나" />
          </>
        )}

        {record.submissionAudioDuration && (
          <>
            <div className={styles.divider} />
            <div className={styles.audioWrap}>
              <MiniAudioPlayer duration={record.submissionAudioDuration} />
            </div>
          </>
        )}

        <div className={styles.footer}>
          <div className={styles.likeStat} aria-label={`좋아요 ${record.likesReceived ?? 0}개`}>
            <Heart size={16} fill="currentColor" />
            <span>좋아요 {record.likesReceived ?? 0}</span>
          </div>
          <button
            type="button"
            className={`${styles.feedbackBtn} ${isFeedbackOpen ? styles.feedbackBtnActive : ''}`}
            onClick={toggleFeedback}
            aria-expanded={isFeedbackOpen}
            aria-label={`피드백 ${feedbackCount}개${hasUnread ? ', 새 피드백 있음' : ''}`}
          >
            <MessageCircle size={16} />
            <span>피드백 {feedbackCount}</span>
            {hasUnread && <span className={styles.unreadDot} aria-hidden="true" />}
          </button>
        </div>

        <div
          className={`${styles.feedbackAccordion} ${isFeedbackOpen ? styles.feedbackAccordionOpen : ''}`}
        >
          <div className={styles.feedbackAccordionInner}>
            <div className={styles.feedbackPanel}>
              <CommentList comments={feedbacks} />
            </div>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        message="제출한 과제를 삭제하시겠습니까?"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  )
}
