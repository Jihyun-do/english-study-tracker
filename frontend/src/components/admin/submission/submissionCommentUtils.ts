import type { AdminSubmissionItem } from '../../../data/mockAdminData'
import type { ThreadComment } from '../../../types/comment'
import { getFeedbackStatus } from './submissionUtils'

const LEADER = { name: '지수', avatarColor: '#9F7AEA' }

export function countUnreadSubmitterComments(comments: ThreadComment[]): number {
  return comments.filter(
    (comment) =>
      !comment.isDeleted &&
      comment.role === 'submitter' &&
      comment.isUnreadByAdmin,
  ).length
}

export function sortCommentsByTime(comments: ThreadComment[]): ThreadComment[] {
  return [...comments].sort(
    (a, b) => (a.createdAtSort ?? 0) - (b.createdAtSort ?? 0),
  )
}

export function markSubmitterCommentsAsRead(
  comments: ThreadComment[],
): ThreadComment[] {
  return comments.map((comment) =>
    comment.role === 'submitter' ? { ...comment, isUnreadByAdmin: false } : comment,
  )
}

export function buildCommentsFromLegacy(submission: AdminSubmissionItem): ThreadComment[] {
  if (submission.comments && submission.comments.length > 0) {
    return sortCommentsByTime(submission.comments)
  }

  if (!submission.feedbackPreview) return []

  return [
    {
      id: `feedback-${submission.id}`,
      authorName: LEADER.name,
      avatarColor: LEADER.avatarColor,
      role: 'leader',
      content: submission.feedbackPreview,
      createdAt: submission.feedbackAt ?? '이전 피드백',
      createdAtSort: submission.feedbackAt
        ? Date.parse(submission.feedbackAt.replace(/\./g, '-').replace(' ', 'T')) || 0
        : 0,
      hasVoiceFeedback: false,
    },
  ]
}

export function syncSubmissionFromComments(
  submission: AdminSubmissionItem,
  comments: ThreadComment[],
): AdminSubmissionItem {
  const sorted = sortCommentsByTime(comments)
  const activeComments = sorted.filter((comment) => !comment.isDeleted)
  const leaderComments = activeComments.filter((comment) => comment.role === 'leader')
  const firstLeader = leaderComments[0]
  const unreadCount = countUnreadSubmitterComments(sorted)
  const hasLeaderComment = leaderComments.length > 0

  return {
    ...submission,
    comments: sorted,
    commentCount: activeComments.length,
    unreadSubmitterCommentCount: unreadCount,
    feedbackStatus: hasLeaderComment ? 'completed' : submission.feedbackStatus ?? 'pending',
    feedbackAt: hasLeaderComment
      ? submission.feedbackAt ?? firstLeader?.createdAt ?? null
      : submission.feedbackAt,
    feedbackPreview: firstLeader?.content ?? submission.feedbackPreview,
  }
}

export function createLeaderComment(
  payload: { text?: string; voiceDuration?: string },
  sortTime: number,
  displayTime: string,
): ThreadComment {
  return {
    id: `comment-${sortTime}`,
    authorName: LEADER.name,
    avatarColor: LEADER.avatarColor,
    role: 'leader',
    content: payload.text ?? '음성 피드백을 남겼습니다.',
    createdAt: displayTime,
    createdAtSort: sortTime,
    hasVoiceFeedback: Boolean(payload.voiceDuration),
    voiceDuration: payload.voiceDuration,
  }
}

export function getSubmissionListPriority(item: AdminSubmissionItem): number {
  const status = getFeedbackStatus(item)
  const unread = item.unreadSubmitterCommentCount ?? 0

  if (status === 'pending') return 0
  if (unread > 0) return 1
  return 2
}
