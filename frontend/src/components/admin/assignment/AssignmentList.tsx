import { useEffect, useMemo, useState } from 'react'
import type { AdminAssignment } from '../../../types/assignment'
import { AdminPagination } from '../AdminPagination'
import { Card } from '../../ui/Card'
import { EmptyState } from '../../ui/EmptyState'
import { SubmissionCollapseTrigger } from '../submission/SubmissionCollapseTrigger'
import { AssignmentItemMenu } from './AssignmentItemMenu'
import {
  AdminStatusBadge,
  assignmentStatusToVariant,
} from '../AdminStatusBadge'
import {
  DEFAULT_ASSIGNMENT_PAGE_SIZE,
  filterAssignments,
  formatDeadlineLabel,
  formatPublishDateLabel,
  getAssignmentOperationalStatus,
  getAssignmentStatusLabel,
  paginateAssignments,
} from './assignmentUtils'
import styles from './AssignmentList.module.css'

interface AssignmentListProps {
  title: string
  assignments: AdminAssignment[]
  search: string
  pageSize?: number
  onEdit: (assignment: AdminAssignment) => void
}

export function AssignmentList({
  title,
  assignments,
  search,
  pageSize = DEFAULT_ASSIGNMENT_PAGE_SIZE,
  onEdit,
}: AssignmentListProps) {
  const [isExpanded, setIsExpanded] = useState(() => assignments.length > 0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setIsExpanded(assignments.length > 0)
  }, [assignments])

  useEffect(() => {
    setPage(1)
  }, [search, assignments])

  const filtered = useMemo(
    () => filterAssignments(assignments, search, 'all'),
    [assignments, search],
  )

  const paginated = useMemo(
    () => paginateAssignments(filtered, page, pageSize),
    [filtered, page, pageSize],
  )

  return (
    <section className={styles.section}>
      <Card className={styles.panel} padding="sm">
        <SubmissionCollapseTrigger
          level="section"
          label={`${title} (${assignments.length})`}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((prev) => !prev)}
        />

        {isExpanded && (
          <div className={styles.panelBody}>
            {paginated.totalItems === 0 ? (
              <EmptyState
                message={
                  search.trim().length > 0
                    ? '검색 조건에 맞는 과제가 없습니다.'
                    : '등록된 과제가 없습니다.'
                }
                variant="boxed"
              />
            ) : (
              <>
                <ul className={styles.list}>
                  {paginated.items.map((assignment) => {
                    const status = getAssignmentOperationalStatus(assignment)

                    return (
                      <li key={assignment.id}>
                        <div className={styles.card}>
                          <div className={styles.cardHeader}>
                            <div className={styles.cardHeaderMain}>
                              <span className={styles.dateBadge}>
                                {formatPublishDateLabel(assignment.publishDate)}
                              </span>
                              <AdminStatusBadge
                                label={getAssignmentStatusLabel(status)}
                                variant={assignmentStatusToVariant(status)}
                              />
                            </div>
                            <AssignmentItemMenu
                              ariaLabel={`${assignment.title} 관리 메뉴`}
                              onEdit={() => onEdit(assignment)}
                            />
                          </div>
                          <p className={styles.cardTitle}>{assignment.title}</p>
                          <p className={styles.cardMeta}>
                            PDF {assignment.pdfFiles.length}개 · 음성{' '}
                            {assignment.audioFiles.length}개 · 마감{' '}
                            {formatDeadlineLabel(
                              assignment.deadlineDate,
                              assignment.deadlineTime,
                            )}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>

                {paginated.totalPages > 1 && (
                  <AdminPagination
                    page={paginated.page}
                    totalPages={paginated.totalPages}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
          </div>
        )}
      </Card>
    </section>
  )
}
