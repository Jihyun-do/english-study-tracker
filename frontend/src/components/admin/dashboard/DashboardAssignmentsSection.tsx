import { useNavigate } from 'react-router-dom'
import { AdminButton } from '../AdminButton'
import { Card } from '../../ui/Card'
import { EmptyState } from '../../ui/EmptyState'
import type { AdminAssignment } from '../../../types/assignment'
import type { DashboardAssignmentProgress } from '../../../data/mockDashboardData'
import { ADMIN_ROUTES } from '../../../router/paths'
import { getDeadlineDDay } from './dashboardUtils'
import styles from './DashboardAssignmentsSection.module.css'

interface DashboardAssignmentsSectionProps {
  assignments: AdminAssignment[]
  progressMap: Record<string, DashboardAssignmentProgress>
}

export function DashboardAssignmentsSection({
  assignments,
  progressMap,
}: DashboardAssignmentsSectionProps) {
  const navigate = useNavigate()

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>진행중 과제</h2>
        <AdminButton variant="ghost" onClick={() => navigate(ADMIN_ROUTES.assignments)}>
          과제 관리
        </AdminButton>
      </div>

      {assignments.length === 0 ? (
        <Card padding="md">
          <EmptyState message="현재 진행중인 과제가 없습니다." />
        </Card>
      ) : (
        <ul className={styles.list}>
          {assignments.map((assignment) => {
            const progress = progressMap[assignment.id] ?? { submitted: 0, total: 0 }

            return (
              <li key={assignment.id}>
                <Card className={styles.item} padding="md">
                  <div className={styles.itemHeader}>
                    <p className={styles.assignmentTitle}>{assignment.title}</p>
                    <span className={styles.dday}>{getDeadlineDDay(assignment.deadlineDate)}</span>
                  </div>
                  <p className={styles.meta}>
                    마감 {assignment.deadlineDate} · 제출 {progress.submitted} / {progress.total}명
                  </p>
                  <AdminButton
                    variant="ghost"
                    className={styles.itemLink}
                    onClick={() => navigate(ADMIN_ROUTES.submission)}
                  >
                    제출 현황
                  </AdminButton>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
