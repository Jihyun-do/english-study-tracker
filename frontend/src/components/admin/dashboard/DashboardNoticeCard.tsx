import { useNavigate } from 'react-router-dom'
import { AdminButton } from '../AdminButton'
import { Card } from '../../ui/Card'
import { EmptyState } from '../../ui/EmptyState'
import type { AdminNotice } from '../../../types/content'
import { ADMIN_ROUTES } from '../../../router/paths'
import { truncateText } from './dashboardUtils'
import styles from './DashboardNoticeCard.module.css'

interface DashboardNoticeCardProps {
  notice: AdminNotice | undefined
}

export function DashboardNoticeCard({ notice }: DashboardNoticeCardProps) {
  const navigate = useNavigate()

  return (
    <Card className={styles.card} padding="md">
      <h2 className={styles.title}>현재 공지</h2>

      {notice ? (
        <div className={styles.body}>
          <p className={styles.noticeTitle}>{notice.title}</p>
          <p className={styles.noticePreview}>
            {truncateText(notice.content.replace(/\n+/g, ' '), 80)}
          </p>
          <p className={styles.meta}>{notice.publishDate}</p>
        </div>
      ) : (
        <EmptyState message="현재 홈에 노출 중인 공지가 없습니다." fill />
      )}

      <AdminButton
        variant="secondary"
        className={styles.action}
        onClick={() => navigate(ADMIN_ROUTES.content)}
      >
        공지 관리
      </AdminButton>
    </Card>
  )
}
