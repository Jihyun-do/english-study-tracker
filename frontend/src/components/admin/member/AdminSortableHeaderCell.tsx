import { ChevronDown, ChevronUp } from 'lucide-react'
import type { MemberSortDir, MemberSortKey } from './memberUtils'
import styles from './AdminSortableHeaderCell.module.css'

interface AdminSortableHeaderCellProps {
  label: string
  sortKey: MemberSortKey
  activeKey: MemberSortKey | null
  sortDir: MemberSortDir
  onSort: (key: MemberSortKey) => void
}

export function AdminSortableHeaderCell({
  label,
  sortKey,
  activeKey,
  sortDir,
  onSort,
}: AdminSortableHeaderCellProps) {
  const isActive = activeKey === sortKey

  return (
    <th className={styles.headerCell}>
      <button
        type="button"
        className={`${styles.sortBtn} ${isActive ? styles.sortBtnActive : ''}`}
        onClick={() => onSort(sortKey)}
      >
        <span>{label}</span>
        {isActive && (
          sortDir === 'asc' ? (
            <ChevronUp size={14} className={styles.sortIcon} aria-hidden="true" />
          ) : (
            <ChevronDown size={14} className={styles.sortIcon} aria-hidden="true" />
          )
        )}
      </button>
    </th>
  )
}

export type { MemberSortKey }
