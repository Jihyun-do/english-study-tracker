import { ArrowLeft } from 'lucide-react'
import { NoticeDetailContent } from '../components/notice/NoticeDetailContent'
import { useStudyContent } from '../contexts/StudyContentContext'
import styles from './NoticeDetailPage.module.css'

interface NoticeDetailPageProps {
  noticeId: string
  onBack: () => void
}

export function NoticeDetailPage({ noticeId, onBack }: NoticeDetailPageProps) {
  const { getNoticeById } = useStudyContent()
  const notice = getNoticeById(noticeId)

  if (!notice) return null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="뒤로">
          <ArrowLeft size={20} />
        </button>
        <h2 className={styles.headerTitle}>공지사항</h2>
      </header>

      <NoticeDetailContent
        title={notice.title}
        publishDate={notice.publishDate}
        content={notice.content}
      />
    </div>
  )
}
