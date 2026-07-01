import { Card } from '../ui/Card'
import styles from './NoticeDetailContent.module.css'

export function formatNoticeDate(date: string): string {
  const [year, month, day] = date.split('-')
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

interface NoticeDetailContentProps {
  title: string
  publishDate: string
  content: string
  className?: string
}

export function NoticeDetailContent({
  title,
  publishDate,
  content,
  className = '',
}: NoticeDetailContentProps) {
  return (
    <Card className={`${styles.contentCard} ${className}`.trim()} padding="md">
      <span className={styles.label}>📢 공지사항</span>
      <h3 className={styles.title}>{title}</h3>
      <time className={styles.date} dateTime={publishDate}>
        {formatNoticeDate(publishDate)}
      </time>
      <div className={styles.divider} />
      <div className={styles.body}>
        {content.split('\n').map((line, index) =>
          line.length > 0 ? <p key={index}>{line}</p> : <br key={index} />,
        )}
      </div>
    </Card>
  )
}
