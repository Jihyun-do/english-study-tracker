import { useNavigate } from 'react-router-dom'
import { AdminButton } from '../AdminButton'
import { Card } from '../../ui/Card'
import { EmptyState } from '../../ui/EmptyState'
import type { AdminPoll } from '../../../types/content'
import { ADMIN_ROUTES } from '../../../router/paths'
import styles from './DashboardPollCard.module.css'

interface DashboardPollCardProps {
  polls: AdminPoll[]
}

export function DashboardPollCard({ polls }: DashboardPollCardProps) {
  const navigate = useNavigate()
  const activePoll = polls[0]

  return (
    <Card className={styles.card} padding="md">
      <h2 className={styles.title}>진행중 투표</h2>

      {activePoll ? (
        <div className={styles.body}>
          <p className={styles.pollTitle}>{activePoll.title}</p>
          <p className={styles.meta}>
            참여 {activePoll.participantCount}/{activePoll.totalMembers}명
          </p>
          <p className={styles.meta}>종료일 {activePoll.endDate}</p>
          {polls.length > 1 && (
            <p className={styles.more}>외 {polls.length - 1}건 진행중</p>
          )}
        </div>
      ) : (
        <EmptyState message="현재 진행중인 투표가 없습니다." fill />
      )}

      <AdminButton
        variant="secondary"
        className={styles.action}
        onClick={() => navigate(`${ADMIN_ROUTES.content}?tab=polls`)}
      >
        투표 관리
      </AdminButton>
    </Card>
  )
}
