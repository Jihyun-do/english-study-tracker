import type { AssignmentOperationalStatus } from '../../types/assignment'
import type {
  CheeringMessageStatus,
  NoticeOperationalStatus,
  PollOperationalStatus,
} from '../../types/content'
import styles from './AdminStatusBadge.module.css'

export type AdminStatusBadgeVariant = 'success' | 'warning' | 'neutral' | 'danger'

interface AdminStatusBadgeProps {
  label: string
  variant: AdminStatusBadgeVariant
  className?: string
}

export function AdminStatusBadge({ label, variant, className = '' }: AdminStatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>{label}</span>
  )
}

export function noticeStatusToVariant(
  status: NoticeOperationalStatus,
): AdminStatusBadgeVariant {
  switch (status) {
    case 'published':
      return 'success'
    case 'scheduled':
      return 'warning'
    case 'hidden':
      return 'neutral'
  }
}

export function pollStatusToVariant(status: PollOperationalStatus): AdminStatusBadgeVariant {
  switch (status) {
    case 'active':
      return 'success'
    case 'scheduled':
      return 'warning'
    case 'closed':
      return 'neutral'
  }
}

export function assignmentStatusToVariant(
  status: AssignmentOperationalStatus,
): AdminStatusBadgeVariant {
  switch (status) {
    case 'published':
      return 'success'
    case 'scheduled':
      return 'warning'
    case 'closed':
      return 'neutral'
  }
}

export function cheeringStatusToVariant(
  status: CheeringMessageStatus,
): AdminStatusBadgeVariant {
  switch (status) {
    case 'in_use':
      return 'success'
    case 'active':
      return 'success'
    case 'inactive':
      return 'neutral'
  }
}
