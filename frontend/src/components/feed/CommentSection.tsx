import { useState } from 'react'
import { Mic, Send } from 'lucide-react'
import { Card } from '../ui/Card'
import type { CurrentUser, FeedComment } from '../../data/mockFeedData'
import { CommentList } from './CommentList'
import styles from './CommentSection.module.css'

interface CommentSectionProps {
  postId: string
  comments: FeedComment[]
  currentUser: CurrentUser
  onAddComment: (comment: Omit<FeedComment, 'id' | 'createdAt'>) => void
}

function RoleBadge({ role }: { role: FeedComment['role'] }) {
  const badgeClass =
    role === 'leader' ? styles.roleBadgeLeader : styles.roleBadgeMember
  return (
    <span className={`${styles.roleBadge} ${badgeClass}`}>
      {role === 'leader' ? '스터디장' : '스터디원'}
    </span>
  )
}

export function CommentSection({ postId, comments, currentUser, onAddComment }: CommentSectionProps) {
  const [text, setText] = useState('')
  const [attachVoice, setAttachVoice] = useState(false)

  const isLeader = currentUser.role === 'leader'
  const canSubmit = text.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return

    onAddComment({
      postId,
      authorName: currentUser.name,
      avatarColor: currentUser.avatarColor,
      role: currentUser.role,
      content: text.trim(),
      hasVoiceFeedback: isLeader && attachVoice,
      voiceDuration: isLeader && attachVoice ? '0:15' : undefined,
    })

    setText('')
    setAttachVoice(false)
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>
        댓글 <span className={styles.count}>{comments.length}</span>
      </h3>

      <CommentList comments={comments} emptyMessage="아직 댓글이 없어요. 첫 댓글을 남겨보세요!" />

      <Card className={styles.formCard} padding="md">
        <div className={styles.formHeader}>
          <div
            className={styles.formAvatar}
            style={{ backgroundColor: currentUser.avatarColor }}
            aria-hidden="true"
          >
            {currentUser.name.charAt(0)}
          </div>
          <div className={styles.formMeta}>
            <span className={styles.formAuthor}>{currentUser.name}</span>
            <RoleBadge role={currentUser.role} />
          </div>
        </div>

        <p className={styles.formHint}>스터디원 · 스터디장 모두 댓글을 남길 수 있어요</p>

        <textarea
          className={styles.textarea}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="응원이나 피드백을 남겨보세요"
          rows={3}
        />

        {isLeader && (
          <div className={styles.voiceAttach}>
            <button
              type="button"
              className={`${styles.voiceToggle} ${attachVoice ? styles.voiceToggleActive : ''}`}
              onClick={() => setAttachVoice((prev) => !prev)}
            >
              <Mic size={16} />
              <span>음성 피드백 추가</span>
            </button>
            {attachVoice && (
              <div className={styles.voiceRecord}>
                <button type="button" className={styles.recordBtn} aria-label="음성 녹음">
                  <Mic size={18} />
                </button>
                <span className={styles.recordHint}>탭하여 녹음 (더미 UI)</span>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className={styles.submitBtn}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          <Send size={16} />
          <span>댓글 남기기</span>
        </button>
      </Card>
    </section>
  )
}
