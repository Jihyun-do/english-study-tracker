import { useState } from 'react'
import type { AdminSubmissionItem } from '../../../data/mockAdminData'
import { SubmissionAssignmentCollapse } from './SubmissionAssignmentCollapse'
import { SubmissionCollapseTrigger } from './SubmissionCollapseTrigger'
import {
  countVisibleAssignmentsInMonth,
  getCurrentMonthKey,
  monthHasVisibleAssignments,
  type SubmissionFilterStatus,
  type SubmissionMonthGroup,
} from './submissionUtils'
import styles from './SubmissionMonthGroup.module.css'

interface SubmissionMonthGroupProps {
  month: SubmissionMonthGroup
  search: string
  filter: SubmissionFilterStatus
  onSelect: (item: AdminSubmissionItem) => void
}

export function SubmissionMonthGroupSection({
  month,
  search,
  filter,
  onSelect,
}: SubmissionMonthGroupProps) {
  const isCurrentMonth = month.monthKey === getCurrentMonthKey()
  const [isExpanded, setIsExpanded] = useState(isCurrentMonth)

  if (!monthHasVisibleAssignments(month, search, filter)) return null

  const visibleCount = countVisibleAssignmentsInMonth(month, search, filter)

  return (
    <div className={styles.root}>
      <SubmissionCollapseTrigger
        level="month"
        label={`${month.label} (${visibleCount})`}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((prev) => !prev)}
      />

      {isExpanded && (
        <div className={styles.body}>
          {month.assignments.map((group) => (
            <SubmissionAssignmentCollapse
              key={group.assignmentId}
              group={group}
              search={search}
              filter={filter}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
