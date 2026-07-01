import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminButton } from '../../components/admin/AdminButton'
import { MemberMonthSelect } from '../../components/admin/member/MemberMonthSelect'
import { AssignmentList } from '../../components/admin/assignment/AssignmentList'
import {
  filterAssignmentsByMonth,
  filterAssignmentsDueToday,
  getAssignmentMonthKeys,
  splitAssignmentsByOperationalStatus,
} from '../../components/admin/assignment/assignmentUtils'
import { getCurrentMonthKey } from '../../components/admin/submission/submissionUtils'
import { useAdminAssignments } from '../../contexts/AdminAssignmentsContext'
import { EmptyState } from '../../components/ui/EmptyState'
import { ADMIN_ROUTES } from '../../router/paths'
import type { AdminAssignment } from '../../types/assignment'
import styles from './AdminAssignmentListPage.module.css'

function getDefaultAssignmentMonthKey(assignments: AdminAssignment[]): string {
  const monthKeys = getAssignmentMonthKeys(assignments)
  return monthKeys.find((key) => key === getCurrentMonthKey()) ?? monthKeys[0]
}

export function AdminAssignmentListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { assignments } = useAdminAssignments()
  const [monthKey, setMonthKey] = useState(() => getDefaultAssignmentMonthKey(assignments))
  const [search, setSearch] = useState('')

  const dueTodayOnly = searchParams.get('filter') === 'due_today'

  const monthKeys = useMemo(() => getAssignmentMonthKeys(assignments), [assignments])

  const monthAssignments = useMemo(() => {
    const byMonth = filterAssignmentsByMonth(assignments, monthKey)
    return dueTodayOnly ? filterAssignmentsDueToday(byMonth) : byMonth
  }, [assignments, monthKey, dueTodayOnly])

  const { scheduled, published, closed } = useMemo(
    () => splitAssignmentsByOperationalStatus(monthAssignments),
    [monthAssignments],
  )

  useEffect(() => {
    setSearch('')
  }, [monthKey])

  const handleEdit = (assignment: AdminAssignment) => {
    navigate(ADMIN_ROUTES.assignmentEdit(assignment.id))
  }

  const hasAssignmentsInMonth = monthAssignments.length > 0

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="과제 관리"
        description="등록한 과제는 공개일 00:00에 사용자 홈·자료실에 자동 연결됩니다"
        action={
          <AdminButton onClick={() => navigate(ADMIN_ROUTES.assignmentNew)}>
            ➕ 과제 등록
          </AdminButton>
        }
      />

      <div className={styles.controls}>
        <MemberMonthSelect
          label="과제 월"
          monthKeys={monthKeys}
          value={monthKey}
          onChange={setMonthKey}
        />

        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="과제 검색"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {!hasAssignmentsInMonth ? (
        <EmptyState
          message={
            dueTodayOnly
              ? '오늘 마감인 과제가 없습니다.'
              : '해당 월에 등록된 과제가 없습니다.'
          }
          variant="boxed"
        />
      ) : (
        <div className={styles.sections}>
          <AssignmentList
            key={`${monthKey}-scheduled`}
            title="예약 과제"
            assignments={scheduled}
            search={search}
            onEdit={handleEdit}
          />
          <AssignmentList
            key={`${monthKey}-published`}
            title="진행중 과제"
            assignments={published}
            search={search}
            onEdit={handleEdit}
          />
          <AssignmentList
            key={`${monthKey}-closed`}
            title="마감 과제"
            assignments={closed}
            search={search}
            onEdit={handleEdit}
          />
        </div>
      )}
    </div>
  )
}
