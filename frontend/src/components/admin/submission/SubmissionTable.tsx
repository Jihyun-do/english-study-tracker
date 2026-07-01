import { useMemo } from 'react'
import { ChevronRight, Image, Mic } from 'lucide-react'
import type { AdminSubmissionAssignmentGroup, AdminSubmissionItem } from '../../../data/mockAdminData'
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from '../AdminTable'
import {
  filterSubmissions,
  formatSubmittedAtDisplay,
  type SubmissionFilterStatus,
} from './submissionUtils'
import { FeedbackStatusBadge } from './FeedbackStatusBadge'
import styles from './SubmissionTable.module.css'

interface SubmissionTableProps {
  submissions: AdminSubmissionItem[]
  search: string
  filter: SubmissionFilterStatus
  publishDate?: string
  onSelect: (item: AdminSubmissionItem) => void
}

function AttachmentCell({ item }: { item: AdminSubmissionItem }) {
  const imageCount = item.hasImage ? 1 : 0
  const audioCount = item.hasAudio ? 1 : 0

  return (
    <div className={styles.attachmentCell}>
      <span
        className={`${styles.attachmentItem} ${imageCount === 0 ? styles.attachmentItemMuted : ''}`}
      >
        <Image size={14} aria-hidden="true" />
        <span>{imageCount}</span>
      </span>
      <span
        className={`${styles.attachmentItem} ${audioCount === 0 ? styles.attachmentItemMuted : ''}`}
      >
        <Mic size={14} aria-hidden="true" />
        <span>{audioCount}</span>
      </span>
    </div>
  )
}

function SubmittedAtCell({
  submittedAt,
  publishDate,
}: {
  submittedAt: string | null
  publishDate?: string
}) {
  const display = formatSubmittedAtDisplay(submittedAt, publishDate)

  return (
    <time className={styles.submittedAt} dateTime={display}>
      {display}
    </time>
  )
}

export function SubmissionTable({
  submissions,
  search,
  filter,
  publishDate,
  onSelect,
}: SubmissionTableProps) {
  const filtered = useMemo(
    () => filterSubmissions(submissions, search, filter),
    [submissions, search, filter],
  )

  if (filtered.length === 0) return null

  return (
    <AdminTable fluid>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.colMember} />
          <col className={styles.colFeedback} />
          <col className={styles.colAttachment} />
          <col className={styles.colSubmitted} />
          <col className={styles.colDetail} />
        </colgroup>
        <AdminTableHead>
          <tr>
            <AdminTableHeaderCell>회원</AdminTableHeaderCell>
            <AdminTableHeaderCell>피드백</AdminTableHeaderCell>
            <AdminTableHeaderCell align="center">첨부</AdminTableHeaderCell>
            <AdminTableHeaderCell align="center">제출시간</AdminTableHeaderCell>
            <AdminTableHeaderCell align="center">상세</AdminTableHeaderCell>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {filtered.map((item) => (
            <AdminTableRow key={item.id} onClick={() => onSelect(item)}>
              <AdminTableCell>
                <div className={styles.memberCell}>
                  <span
                    className={styles.avatar}
                    style={{ backgroundColor: item.avatarColor }}
                  >
                    {item.memberName.charAt(0)}
                  </span>
                  <span className={styles.memberName}>{item.memberName}</span>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <FeedbackStatusBadge item={item} variant="table" showTime />
              </AdminTableCell>
              <AdminTableCell align="center">
                <AttachmentCell item={item} />
              </AdminTableCell>
              <AdminTableCell align="center">
                <SubmittedAtCell submittedAt={item.submittedAt} publishDate={publishDate} />
              </AdminTableCell>
              <AdminTableCell align="center">
                <ChevronRight size={16} className={styles.detailIcon} aria-hidden="true" />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </table>
    </AdminTable>
  )
}

interface SubmissionTableForGroupProps {
  group: AdminSubmissionAssignmentGroup
  search: string
  filter: SubmissionFilterStatus
  onSelect: (item: AdminSubmissionItem) => void
}

export function SubmissionTableForGroup({
  group,
  search,
  filter,
  onSelect,
}: SubmissionTableForGroupProps) {
  return (
    <SubmissionTable
      submissions={group.submissions}
      search={search}
      filter={filter}
      publishDate={group.publishDate}
      onSelect={onSelect}
    />
  )
}
