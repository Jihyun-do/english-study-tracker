import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { AdminSubmissionAssignmentGroup, AdminSubmissionItem } from '../../../data/mockAdminData'
import { SubmissionTableForGroup } from './SubmissionTable'
import {
  formatAssignmentPublishDate,
  formatSubmissionCountLabel,
  getSubmissionSummary,
  hasVisibleSubmissions,
  type SubmissionFilterStatus,
} from './submissionUtils'
import styles from './SubmissionAssignmentCollapse.module.css'

interface SubmissionAssignmentCollapseProps {
  group: AdminSubmissionAssignmentGroup
  search: string
  filter: SubmissionFilterStatus
  defaultExpanded?: boolean
  onSelect: (item: AdminSubmissionItem) => void
}

export function SubmissionAssignmentCollapse({
  group,
  search,
  filter,
  defaultExpanded = false,
  onSelect,
}: SubmissionAssignmentCollapseProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (!hasVisibleSubmissions(group, search, filter)) return null

  const summary = getSubmissionSummary(group)

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <ChevronDown size={18} className={styles.icon} aria-hidden="true" />
        ) : (
          <ChevronRight size={18} className={styles.icon} aria-hidden="true" />
        )}
        <span className={styles.header}>
          <span className={styles.title}>{group.title}</span>
          <span className={styles.date}>{formatAssignmentPublishDate(group.publishDate)}</span>
          <span className={styles.count}>{formatSubmissionCountLabel(summary)}</span>
        </span>
      </button>

      {isExpanded && (
        <div className={styles.body}>
          <SubmissionTableForGroup
            group={group}
            search={search}
            filter={filter}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  )
}
