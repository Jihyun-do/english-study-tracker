export type CommentAuthorRole = 'leader' | 'member' | 'submitter'

export interface ThreadComment {
  id: string
  authorName: string
  avatarColor: string
  role: CommentAuthorRole
  content: string
  createdAt: string
  /** 시간순 정렬용 (timestamp ms) */
  createdAtSort?: number
  hasVoiceFeedback?: boolean
  voiceDuration?: string
  isDeleted?: boolean
  /** 제출자 댓글 중 관리자가 아직 확인하지 않은 경우 */
  isUnreadByAdmin?: boolean
}

export const DELETED_COMMENT_MESSAGE = '삭제된 댓글입니다.'
