import { useEffect, useState } from 'react'
import { Mic, Music, Send, Square, Trash2, X } from 'lucide-react'
import { MiniAudioPlayer } from '../../feed/MiniAudioPlayer'
import styles from './AdminSubmissionCommentForm.module.css'

type VoiceStep = 'idle' | 'recording' | 'recorded'

export interface FeedbackSubmitPayload {
  text?: string
  voiceDuration?: string
}

interface VoiceAttachment {
  duration: string
}

interface AdminSubmissionCommentFormProps {
  onSubmit: (payload: FeedbackSubmitPayload) => void
}

function formatRecordingTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function AdminSubmissionCommentForm({ onSubmit }: AdminSubmissionCommentFormProps) {
  const [text, setText] = useState('')
  const [voiceStep, setVoiceStep] = useState<VoiceStep>('idle')
  const [voiceAttachment, setVoiceAttachment] = useState<VoiceAttachment | null>(null)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  useEffect(() => {
    if (voiceStep !== 'recording') return

    const timer = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [voiceStep])

  const canSubmit =
    text.trim().length > 0 || voiceAttachment !== null

  const resetVoice = () => {
    setVoiceStep('idle')
    setVoiceAttachment(null)
    setRecordingSeconds(0)
  }

  const handleStartRecording = () => {
    setRecordingSeconds(0)
    setVoiceStep('recording')
  }

  const handleStopRecording = () => {
    const duration = formatRecordingTime(recordingSeconds)
    setVoiceAttachment({ duration })
    setVoiceStep('recorded')
  }

  const handleCancelRecording = () => {
    resetVoice()
  }

  const handleDeleteAttachment = () => {
    resetVoice()
  }

  const handleSubmit = () => {
    if (!canSubmit) return

    onSubmit({
      text: text.trim() || undefined,
      voiceDuration: voiceAttachment?.duration,
    })

    setText('')
    resetVoice()
  }

  return (
    <div className={styles.form}>
      <p className={styles.formLabel}>댓글 작성</p>

      <textarea
        className={styles.textarea}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="댓글을 입력하세요..."
        rows={3}
        disabled={voiceStep === 'recording'}
      />

      <div className={styles.voiceSection}>
        <p className={styles.voiceSectionLabel}>음성 첨부 (선택)</p>

        {voiceStep === 'idle' && !voiceAttachment && (
          <button
            type="button"
            className={styles.attachBtn}
            onClick={handleStartRecording}
          >
            <Mic size={16} />
            음성 첨부
          </button>
        )}

        {voiceStep === 'recording' && (
          <div className={styles.recordingPanel}>
            <div className={styles.recordingInfo}>
              <span className={styles.recordingDot} aria-hidden="true" />
              <span className={styles.recordingText}>녹음중...</span>
              <span className={styles.recordingTime}>
                {formatRecordingTime(recordingSeconds)}
              </span>
            </div>
            <div className={styles.recordingActions}>
              <button type="button" className={styles.stopBtn} onClick={handleStopRecording}>
                <Square size={12} fill="currentColor" />
                중지
              </button>
              <button type="button" className={styles.cancelBtn} onClick={handleCancelRecording}>
                <X size={14} />
                취소
              </button>
            </div>
          </div>
        )}

        {voiceAttachment && voiceStep === 'recorded' && (
          <div className={styles.attachmentPanel}>
            <div className={styles.attachmentHeader}>
              <Music size={14} className={styles.attachmentIcon} />
              <span className={styles.attachmentLabel}>녹음된 음성</span>
            </div>
            <MiniAudioPlayer duration={voiceAttachment.duration} />
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleDeleteAttachment}
            >
              <Trash2 size={14} />
              삭제
            </button>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.submitBtn}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          <Send size={16} />
          등록
        </button>
      </div>
    </div>
  )
}
