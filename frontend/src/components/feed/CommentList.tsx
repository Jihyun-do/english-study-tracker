import { useEffect, useRef, useState } from 'react'
import { Mic, MoreVertical, Play } from 'lucide-react'
import type { CommentAuthorRole, ThreadComment } from '../../types/comment'
import { DELETED_COMMENT_MESSAGE } from '../../types/comment'
import { EmptyState } from '../ui/EmptyState'
import styles from './CommentSection.module.css'

export type CommentItemData = ThreadComment

interface CommentListProps {
  comments: CommentItemData[]
  emptyMessage?: string
  manageableRole?: CommentAuthorRole
  onEditComment?: (commentId: string, content: string) => void
  onDeleteComment?: (commentId: string) => void
}

interface CommentItemProps {
  comment: CommentItemData
  manageableRole?: CommentAuthorRole
  onEditComment?: (commentId: string, content: string) => void
  onDeleteComment?: (commentId: string) => void
}

const ROLE_BADGE_LABEL: Record<CommentAuthorRole, string> = {
  leader: '스터디장',
  submitter: '제출자',
  member: '스터디원',
}

const ROLE_BADGE_CLASS: Record<CommentAuthorRole, string> = {
  leader: styles.roleBadgeLeader,
  submitter: styles.roleBadgeSubmitter,
  member: styles.roleBadgeMember,
}

function RoleBadge({ role }: { role: CommentAuthorRole }) {
  return (
    <span className={`${styles.roleBadge} ${ROLE_BADGE_CLASS[role]}`}>
      {ROLE_BADGE_LABEL[role]}
    </span>
  )
}

function CommentVoicePlayer({ duration }: { duration: string }) {
  return (
    <div className={styles.voicePlayer}>
      <div className={styles.voiceLabel}>
        <Mic size={12} />
        <span>음성 피드백</span>
      </div>
      <div className={styles.voiceControls}>
        <button type="button" className={styles.voicePlayBtn} aria-label="음성 피드백 재생">
          <Play size={12} fill="currentColor" />
        </button>
        <div className={styles.voiceTrack}>
          <div className={styles.voiceProgress} />
        </div>
        <span className={styles.voiceDuration}>{duration}</span>
      </div>
    </div>
  )
}

function CommentItemMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className={styles.menuWrap} ref={menuRef}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="댓글 메뉴"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className={styles.menuDropdown}>
          <button
            type="button"
            className={styles.menuItem}
            onClick={() => {
              setOpen(false)
              onEdit()
            }}
          >
            수정
          </button>
          <button
            type="button"
            className={`${styles.menuItem} ${styles.menuItemDanger}`}
            onClick={() => {
              setOpen(false)
              onDelete()
            }}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  )
}

function CommentItem({
  comment,
  manageableRole,
  onEditComment,
  onDeleteComment,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const canManage =
    !comment.isDeleted &&
    manageableRole !== undefined &&
    comment.role === manageableRole &&
    onEditComment &&
    onDeleteComment

  const handleSaveEdit = () => {
    if (!editText.trim() || !onEditComment) return
    onEditComment(comment.id, editText.trim())
    setIsEditing(false)
  }

  return (
    <li className={`${styles.commentItem} ${comment.isDeleted ? styles.commentDeleted : ''}`}>
      <div
        className={styles.commentAvatar}
        style={{ backgroundColor: comment.avatarColor }}
        aria-hidden="true"
      >
        {comment.authorName.charAt(0)}
      </div>
      <div className={styles.commentBody}>
        <div className={styles.commentHeader}>
          <div className={styles.commentMeta}>
            <span className={styles.commentAuthor}>{comment.authorName}</span>
            <RoleBadge role={comment.role} />
          </div>
          {canManage && !isEditing && (
            <CommentItemMenu
              onEdit={() => {
                setEditText(comment.content)
                setIsEditing(true)
              }}
              onDelete={() => onDeleteComment(comment.id)}
            />
          )}
        </div>

        {isEditing ? (
          <div className={styles.editArea}>
            <textarea
              className={styles.editTextarea}
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              rows={3}
            />
            <div className={styles.editActions}>
              <button
                type="button"
                className={styles.editCancelBtn}
                onClick={() => setIsEditing(false)}
              >
                취소
              </button>
              <button
                type="button"
                className={styles.editSaveBtn}
                onClick={handleSaveEdit}
                disabled={!editText.trim()}
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className={styles.commentText}>
              {comment.isDeleted ? DELETED_COMMENT_MESSAGE : comment.content}
            </p>
            {!comment.isDeleted && comment.hasVoiceFeedback && comment.voiceDuration && (
              <CommentVoicePlayer duration={comment.voiceDuration} />
            )}
            <time className={styles.commentTime} dateTime={comment.createdAt}>
              {comment.createdAt}
            </time>
          </>
        )}
      </div>
    </li>
  )
}

export function CommentList({
  comments,
  emptyMessage = '아직 피드백이 없어요.',
  manageableRole,
  onEditComment,
  onDeleteComment,
}: CommentListProps) {
  if (comments.length === 0) {
    return <EmptyState message={emptyMessage} variant="inline" className={styles.empty} />
  }

  return (
    <ul className={styles.list}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          manageableRole={manageableRole}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </ul>
  )
}
