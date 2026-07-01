import { useState, type FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { useToast } from '../contexts/ToastContext'
import styles from './TopicSuggestPage.module.css'

interface TopicSuggestPageProps {
  onBack: () => void
}

export function TopicSuggestPage({ onBack }: TopicSuggestPageProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [referenceLink, setReferenceLink] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    showToast('주제를 제안했습니다.')
    onBack()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="뒤로 가기">
          <ArrowLeft size={22} />
        </button>
        <h2 className={styles.title}>주제 제안하기</h2>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Card padding="md">
          <div className={styles.field}>
            <label htmlFor="topic-title" className={styles.label}>
              제목
            </label>
            <input
              id="topic-title"
              type="text"
              className={styles.input}
              placeholder="예: 해외여행 영어"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="topic-description" className={styles.label}>
              설명
            </label>
            <textarea
              id="topic-description"
              className={styles.textarea}
              placeholder="어떤 주제로 공부하면 좋을지 설명해주세요"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="topic-link" className={styles.label}>
              참고 링크
              <span className={styles.optional}>(선택)</span>
            </label>
            <input
              id="topic-link"
              type="url"
              className={styles.input}
              placeholder="https://youtube.com/..."
              value={referenceLink}
              onChange={(event) => setReferenceLink(event.target.value)}
            />
          </div>

          <div className={styles.anonymousField}>
            <label className={styles.anonymousLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isAnonymous}
                onChange={(event) => setIsAnonymous(event.target.checked)}
              />
              <span>익명으로 등록</span>
            </label>
            <p className={styles.anonymousHint}>
              체크 시 목록·상세 화면에 &ldquo;익명&rdquo;으로만 표시됩니다.
              실제 작성자 정보는 관리자 화면에서만 확인할 수 있습니다.
            </p>
          </div>
        </Card>

        <button type="submit" className={styles.submitBtn}>
          제안 등록하기
        </button>
      </form>
    </div>
  )
}
