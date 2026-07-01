import { useMemo } from 'react'
import type { AdminSubmissionAssignmentGroup, AdminSubmissionItem } from '../../../data/mockAdminData'
import {
  formatSubmissionDateLabel,
  hasVisibleSubmissions,
  type SubmissionFilterStatus,
} from './submissionUtils'
import { SubmissionTableForGroup } from './SubmissionTable'
import styles from './SubmissionAssignmentTable.module.css'

interface SubmissionAssignmentTableProps {
  group: AdminSubmissionAssignmentGroup
  search: string
  filter: SubmissionFilterStatus
  onSelect: (item: AdminSubmissionItem) => void
}

/** 진행중 과제용 — 제목과 테이블을 바로 표시 */
export function SubmissionAssignmentTable({
  group,
  search,
  filter,
  onSelect,
}: SubmissionAssignmentTableProps) {
  const isVisible = useMemo(
    () => hasVisibleSubmissions(group, search, filter),
    [group, search, filter],
  )

  if (!isVisible) return null

  return (
    <div className={styles.block}>
      <div className={styles.heading}>
        <h3 className={styles.dateLabel}>{formatSubmissionDateLabel(group.publishDate)}</h3>
        <p className={styles.title}>{group.title}</p>
      </div>

      <SubmissionTableForGroup
        group={group}
        search={search}
        filter={filter}
        onSelect={onSelect}
      />
    </div>
  )
}
