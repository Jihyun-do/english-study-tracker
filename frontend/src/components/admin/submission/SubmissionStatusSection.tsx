import { useMemo, useState } from 'react'
import type { AdminSubmissionAssignmentGroup, AdminSubmissionItem } from '../../../data/mockAdminData'
import { Card } from '../../ui/Card'
import { EmptyState } from '../../ui/EmptyState'
import { SubmissionAssignmentCollapse } from './SubmissionAssignmentCollapse'
import { SubmissionCollapseTrigger } from './SubmissionCollapseTrigger'
import {
  hasVisibleSubmissions,
  type SubmissionFilterStatus,
} from './submissionUtils'
import styles from './SubmissionStatusSection.module.css'

interface SubmissionStatusSectionProps {
  title: string
  defaultExpanded?: boolean
  groups: AdminSubmissionAssignmentGroup[]
  search: string
  filter: SubmissionFilterStatus
  onSelect: (item: AdminSubmissionItem) => void
}

export function SubmissionStatusSection({
  title,
  defaultExpanded = true,
  groups,
  search,
  filter,
  onSelect,
}: SubmissionStatusSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const visibleGroups = useMemo(
    () => groups.filter((group) => hasVisibleSubmissions(group, search, filter)),
    [groups, search, filter],
  )

  if (groups.length === 0) return null

  return (
    <section className={styles.section}>
      <Card className={styles.panel} padding="sm">
        <SubmissionCollapseTrigger
          level="section"
          label={title}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((prev) => !prev)}
        />

        {isExpanded && (
          <div className={styles.body}>
            {visibleGroups.length === 0 ? (
              <EmptyState message="검색·필터 조건에 맞는 제출 내역이 없습니다." variant="inline" />
            ) : (
              visibleGroups.map((group, index) => (
                <SubmissionAssignmentCollapse
                  key={group.assignmentId}
                  group={group}
                  defaultExpanded={index === 0}
                  search={search}
                  filter={filter}
                  onSelect={onSelect}
                />
              ))
            )}
          </div>
        )}
      </Card>
    </section>
  )
}
