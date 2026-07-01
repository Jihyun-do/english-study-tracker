import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'
import type { FeedVisibility } from '../../data/mockAdminData'
import { useFixedDropdown } from '../../hooks/useFixedDropdown'
import styles from './AdminItemMenu.module.css'

interface AdminItemMenuProps {
  visibility: FeedVisibility
  onHide: () => void
  onDelete: () => void
  ariaLabel?: string
}

export function AdminItemMenu({
  visibility,
  onHide,
  onDelete,
  ariaLabel = '관리 메뉴',
}: AdminItemMenuProps) {
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
        aria-label={ariaLabel}
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
            {visibility === 'public' && (
              <button
                type="button"
                className={styles.menuItem}
                onClick={(event) => {
                  event.stopPropagation()
                  closeAndRun(onHide)
                }}
              >
                숨김 처리
              </button>
            )}
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
