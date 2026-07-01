import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'
import { useFixedDropdown } from '../../../hooks/useFixedDropdown'
import styles from '../AdminItemMenu.module.css'

interface PollItemMenuProps {
  onEdit: () => void
  onViewResults: () => void
  onDelete: () => void
}

export function PollItemMenu({ onEdit, onViewResults, onDelete }: PollItemMenuProps) {
  const { anchorRef, dropdownRef, open, position, toggle, close } = useFixedDropdown()

  const closeAndRun = (action: () => void) => {
    close()
    action()
  }

  return (
    <div className={styles.menuWrap}>
      <button
        ref={anchorRef}
        type="button"
        className={styles.menuBtn}
        onClick={toggle}
        aria-label="투표 관리 메뉴"
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
              className={styles.menuItem}
              onClick={(event) => {
                event.stopPropagation()
                closeAndRun(onViewResults)
              }}
            >
              결과 보기
            </button>
            <button
              type="button"
              className={styles.menuItem}
              onClick={(event) => {
                event.stopPropagation()
                closeAndRun(onEdit)
              }}
            >
              수정
            </button>
            <button
              type="button"
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              onClick={(event) => {
                event.stopPropagation()
                closeAndRun(onDelete)
              }}
            >
              삭제
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}
