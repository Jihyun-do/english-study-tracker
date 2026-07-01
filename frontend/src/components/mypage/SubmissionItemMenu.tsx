import { createPortal } from 'react-dom'
import type { MouseEvent } from 'react'
import { MoreVertical } from 'lucide-react'
import { useFixedDropdown } from '../../hooks/useFixedDropdown'
import styles from './SubmissionItemMenu.module.css'

interface SubmissionItemMenuProps {
  canEdit: boolean
  onEdit: () => void
  onDelete: () => void
}

export function SubmissionItemMenu({ canEdit, onEdit, onDelete }: SubmissionItemMenuProps) {
  const { anchorRef, dropdownRef, open, position, toggle, close } = useFixedDropdown()

  const closeAndRun = (action: () => void) => {
    close()
    action()
  }

  const handleEdit = (event: MouseEvent) => {
    event.stopPropagation()
    if (!canEdit) return
    closeAndRun(onEdit)
  }

  const handleDelete = (event: MouseEvent) => {
    event.stopPropagation()
    if (!canEdit) return
    closeAndRun(onDelete)
  }

  return (
    <div className={styles.menuWrap}>
      <button
        ref={anchorRef}
        type="button"
        className={styles.menuBtn}
        onClick={toggle}
        aria-label="제출 과제 관리 메뉴"
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>
      {open &&
        position &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`${styles.menuDropdown} ${styles.menuDropdownFixed}`}
            style={{ top: position.top, right: position.right }}
          >
            <button
              type="button"
              className={`${styles.menuItem} ${!canEdit ? styles.menuItemDisabled : ''}`}
              onClick={handleEdit}
              disabled={!canEdit}
            >
              수정
            </button>
            <button
              type="button"
              className={`${styles.menuItem} ${styles.menuItemDanger} ${!canEdit ? styles.menuItemDisabled : ''}`}
              onClick={handleDelete}
              disabled={!canEdit}
            >
              삭제
            </button>
            {!canEdit && (
              <p className={styles.hint}>제출 마감 이후에는 수정 및 삭제할 수 없습니다.</p>
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}
