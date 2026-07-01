import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'
import type { CheeringMessageStatus } from '../../../types/content'
import { useFixedDropdown } from '../../../hooks/useFixedDropdown'
import styles from '../AdminItemMenu.module.css'

interface CheeringItemMenuProps {
  status: CheeringMessageStatus
  onEdit: () => void
  onActivate: () => void
  onDeactivate: () => void
  onDelete: () => void
}

export function CheeringItemMenu({
  status,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
}: CheeringItemMenuProps) {
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
        aria-label="응원 문구 관리 메뉴"
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
                closeAndRun(onEdit)
              }}
            >
              수정
            </button>
            {status === 'inactive' ? (
              <button
                type="button"
                className={styles.menuItem}
                onClick={(event) => {
                  event.stopPropagation()
                  closeAndRun(onActivate)
                }}
              >
                사용
              </button>
            ) : (
              <button
                type="button"
                className={styles.menuItem}
                onClick={(event) => {
                  event.stopPropagation()
                  closeAndRun(onDeactivate)
                }}
              >
                비활성
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
