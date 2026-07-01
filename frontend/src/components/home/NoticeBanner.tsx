import { ChevronRight } from 'lucide-react'
import { useStudyContent } from '../../contexts/StudyContentContext'
import styles from './NoticeBanner.module.css'

interface NoticeBannerProps {
  onClick: (noticeId: string) => void
}

export function NoticeBanner({ onClick }: NoticeBannerProps) {
  const { getBannerNotice } = useStudyContent()
  const notice = getBannerNotice()

  if (!notice) return null

  return (
    <button
      type="button"
      className={styles.banner}
      onClick={() => onClick(notice.id)}
    >
      <span className={styles.text}>{notice.preview}</span>
      <ChevronRight size={16} className={styles.icon} />
    </button>
  )
}
