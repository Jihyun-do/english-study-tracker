import { useCallback, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { MemberMonthSelect } from '../../components/admin/member/MemberMonthSelect'
import { AdminSubmissionDetailDrawer } from '../../components/admin/submission/AdminSubmissionDetailDrawer'
import { SubmissionStatusSection } from '../../components/admin/submission/SubmissionStatusSection'
import {
  filterGroupsByMonth,
  getCurrentMonthKey,
  getSubmissionMonthKeys,
  parseSubmissionFilter,
  splitSubmissionGroups,
  type SubmissionFilterStatus,
} from '../../components/admin/submission/submissionUtils'
import type { AdminSubmissionAssignmentGroup, AdminSubmissionItem } from '../../data/mockAdminData'
import { mockAdminSubmissionGroups } from '../../data/mockAdminData'
import { EmptyState } from '../../components/ui/EmptyState'
import styles from './AdminSubmissionPage.module.css'

const FEEDBACK_FILTERS: { key: SubmissionFilterStatus; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'new_comments', label: '새 댓글' },
  { key: 'feedback_pending', label: '피드백 대기' },
  { key: 'feedback_completed', label: '피드백 완료' },
]

function getDefaultSubmissionMonthKey(groups: AdminSubmissionAssignmentGroup[]): string {
  const monthKeys = getSubmissionMonthKeys(groups)
  return monthKeys.find((key) => key === getCurrentMonthKey()) ?? monthKeys[0]
}

export function AdminSubmissionPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [groups, setGroups] = useState(mockAdminSubmissionGroups)
  const [monthKey, setMonthKey] = useState(() =>
    getDefaultSubmissionMonthKey(mockAdminSubmissionGroups),
  )
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filter = parseSubmissionFilter(searchParams.get('filter'))

  const handleFilterChange = useCallback(
    (nextFilter: SubmissionFilterStatus) => {
      if (nextFilter === 'all') {
        setSearchParams({})
        return
      }
      setSearchParams({ filter: nextFilter })
    },
    [setSearchParams],
  )

  const monthKeys = useMemo(() => getSubmissionMonthKeys(groups), [groups])

  const monthGroups = useMemo(
    () => filterGroupsByMonth(groups, monthKey),
    [groups, monthKey],
  )

  const { active, closed } = useMemo(() => splitSubmissionGroups(monthGroups), [monthGroups])

  const selected = useMemo(() => {
    if (!selectedId) return null
    for (const group of groups) {
      const found = group.submissions.find((item) => item.id === selectedId)
      if (found) return found
    }
    return null
  }, [groups, selectedId])

  const handleUpdateSubmission = useCallback((updated: AdminSubmissionItem) => {
    setGroups((prev) =>
      prev.map((group) => ({
        ...group,
        submissions: group.submissions.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      })),
    )
  }, [])

  const hasAssignmentsInMonth = monthGroups.length > 0

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="제출 현황"
        description="제출된 과제를 확인하고 피드백을 남겨주세요"
      />

      <div className={styles.controls}>
        <MemberMonthSelect
          label="과제 월"
          monthKeys={monthKeys}
          value={monthKey}
          onChange={setMonthKey}
        />
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="회원 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {FEEDBACK_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`${styles.filterBtn} ${filter === key ? styles.filterActive : ''}`}
              onClick={() => handleFilterChange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!hasAssignmentsInMonth ? (
        <EmptyState message="해당 월에 등록된 과제가 없습니다." variant="boxed" />
      ) : (
        <>
          <SubmissionStatusSection
            title="진행중 과제"
            defaultExpanded
            groups={active}
            search={search}
            filter={filter}
            onSelect={(item) => setSelectedId(item.id)}
          />

          <SubmissionStatusSection
            title="마감된 과제"
            defaultExpanded
            groups={closed}
            search={search}
            filter={filter}
            onSelect={(item) => setSelectedId(item.id)}
          />
        </>
      )}

      <AdminSubmissionDetailDrawer
        submission={selected}
        onClose={() => setSelectedId(null)}
        onUpdate={handleUpdateSubmission}
      />
    </div>
  )
}
