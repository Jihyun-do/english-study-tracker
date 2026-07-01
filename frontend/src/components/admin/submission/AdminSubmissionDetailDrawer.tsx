import { useEffect, useMemo, useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { AdminDrawer } from '../AdminDrawer'
import { SubmissionImage } from '../../feed/SubmissionImage'
import { MiniAudioPlayer } from '../../feed/MiniAudioPlayer'
import { CommentList } from '../../feed/CommentList'
import type { ThreadComment } from '../../../types/comment'
import type { AdminSubmissionItem } from '../../../data/mockAdminData'
import {
  AdminSubmissionCommentForm,
  type FeedbackSubmitPayload,
} from './AdminSubmissionCommentForm'
import { FeedbackStatusBadge } from './FeedbackStatusBadge'
import {
  buildCommentsFromLegacy,
  countUnreadSubmitterComments,
  createLeaderComment,
  markSubmitterCommentsAsRead,
  sortCommentsByTime,
  syncSubmissionFromComments,
} from './submissionCommentUtils'
import styles from './AdminSubmissionDetailDrawer.module.css'

function formatFeedbackTimestamp(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}.${m}.${d} ${h}:${min}`
}

interface AdminSubmissionDetailDrawerProps {
  submission: AdminSubmissionItem | null
  onClose: () => void
  onUpdate?: (submission: AdminSubmissionItem) => void
}

export function AdminSubmissionDetailDrawer({
  submission,
  onClose,
  onUpdate,
}: AdminSubmissionDetailDrawerProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comments, setComments] = useState<ThreadComment[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    if (!submission) return

    setIsLiked(Boolean(submission.likedByAdmin))
    setLikeCount(submission.likeCount)

    const initialComments = buildCommentsFromLegacy(submission)
    const hasUnread = countUnreadSubmitterComments(initialComments) > 0

    if (hasUnread) {
      const readComments = markSubmitterCommentsAsRead(initialComments)
      setComments(readComments)
      onUpdate?.(
        syncSubmissionFromComments(
          { ...submission, likeCount: submission.likeCount, likedByAdmin: submission.likedByAdmin },
          readComments,
        ),
      )
    } else {
      setComments(initialComments)
    }
  }, [submission, onUpdate])

  const sortedComments = useMemo(() => sortCommentsByTime(comments), [comments])

  const drawerSubmission = useMemo((): AdminSubmissionItem | null => {
    if (!submission) return null
    return syncSubmissionFromComments(
      { ...submission, likeCount, likedByAdmin: isLiked },
      sortedComments,
    )
  }, [submission, sortedComments, likeCount, isLiked])

  const commentCount = sortedComments.filter((comment) => !comment.isDeleted).length

  const persistComments = (nextComments: ThreadComment[]) => {
    if (!submission) return
    const sorted = sortCommentsByTime(nextComments)
    setComments(sorted)
    const synced = syncSubmissionFromComments(
      { ...submission, likeCount, likedByAdmin: isLiked },
      sorted,
    )
    onUpdate?.(synced)
  }

  const handleToggleLike = () => {
    if (!submission || !drawerSubmission) return

    const nextLiked = !isLiked
    const nextCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1)
    setIsLiked(nextLiked)
    setLikeCount(nextCount)
    onUpdate?.({ ...drawerSubmission, likeCount: nextCount, likedByAdmin: nextLiked })
  }

  const handleSubmitFeedback = (payload: FeedbackSubmitPayload) => {
    if (!submission) return
    if (!payload.text && !payload.voiceDuration) return

    const now = Date.now()
    const displayTime = formatFeedbackTimestamp(new Date(now))
    const newComment = createLeaderComment(payload, now, displayTime)
    persistComments([...comments, newComment])
    showToast('피드백을 등록했습니다.')
  }

  const handleEditComment = (commentId: string, content: string) => {
    persistComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, content } : comment,
      ),
    )
    showToast('댓글을 수정했습니다.')
  }

  const handleDeleteComment = (commentId: string) => {
    persistComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, isDeleted: true } : comment,
      ),
    )
    showToast('댓글을 삭제했습니다.')
  }

  const drawerTitle = useMemo(
    () => (submission ? `${submission.memberName} 제출 상세` : ''),
    [submission],
  )

  return (
    <AdminDrawer isOpen={submission !== null} title={drawerTitle} onClose={onClose}>
      {submission && drawerSubmission && (
        <div className={styles.content}>
          <div className={styles.body}>
            <div className={styles.headerRow}>
              <p className={styles.assignment}>{submission.assignmentTitle}</p>
              <FeedbackStatusBadge item={drawerSubmission} showTime />
            </div>

            {submission.memo && (
              <p className={styles.memo}>&ldquo;{submission.memo}&rdquo;</p>
            )}

            {submission.imageTheme && (
              <SubmissionImage theme={submission.imageTheme} userName={submission.memberName} />
            )}

            {submission.audioDuration && (
              <MiniAudioPlayer duration={submission.audioDuration} />
            )}

            <div className={styles.stats}>
              <button
                type="button"
                className={`${styles.statItem} ${isLiked ? styles.statItemActive : ''}`}
                onClick={handleToggleLike}
                aria-pressed={isLiked}
                aria-label={isLiked ? '좋아요 취소' : '좋아요'}
              >
                <span className={styles.statIcon} aria-hidden="true">
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'transparent'} />
                </span>
                {likeCount}
              </button>
              <span className={styles.statItem}>
                <span className={styles.statIcon} aria-hidden="true">
                  <MessageCircle size={16} />
                </span>
                {commentCount}
              </span>
            </div>

            <CommentList
              comments={sortedComments}
              emptyMessage="아직 피드백이 없어요. 댓글이나 음성으로 피드백을 남겨보세요."
              manageableRole="leader"
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>

          <AdminSubmissionCommentForm onSubmit={handleSubmitFeedback} />
        </div>
      )}
    </AdminDrawer>
  )
}
