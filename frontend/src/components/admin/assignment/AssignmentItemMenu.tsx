import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'
import { useFixedDropdown } from '../../../hooks/useFixedDropdown'
import menuStyles from '../AdminItemMenu.module.css'

interface AssignmentItemMenuProps {
  onEdit: () => void
  ariaLabel?: string
}

export function AssignmentItemMenu({
  onEdit,
  ariaLabel = '과제 관리 메뉴',
}: AssignmentItemMenuProps) {
  const { anchorRef, dropdownRef, open, position, toggle, close } = useFixedDropdown()

  const closeAndRun = (action: () => void) => {
    close()
    action()
  }

  return (
    <div className={menuStyles.menuWrap}>
      <button
        ref={anchorRef}
        type="button"
        className={menuStyles.menuBtn}
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
            className={`${menuStyles.menuDropdown} ${menuStyles.menuDropdownFixed}`}
            style={{ top: position.top, right: position.right }}
          >
            <button
              type="button"
              className={menuStyles.menuItem}
              onClick={(event) => {
                event.stopPropagation()
                closeAndRun(onEdit)
              }}
            >
              수정
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}
