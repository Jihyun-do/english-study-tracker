import { createPortal } from 'react-dom'
import { Check, MoreVertical } from 'lucide-react'
import type { AdminMemberItem } from '../../../data/mockAdminData'
import { useFixedDropdown } from '../../../hooks/useFixedDropdown'
import menuStyles from '../AdminItemMenu.module.css'
import styles from './AdminMemberMenu.module.css'

interface AdminMemberMenuProps {
  member: AdminMemberItem
  isMonthlyPick: boolean
  onMonthlyPick: () => void
  onViewInfo: () => void
}

export function AdminMemberMenu({
  member,
  isMonthlyPick,
  onMonthlyPick,
  onViewInfo,
}: AdminMemberMenuProps) {
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
        aria-label={`${member.name} 스터디원 관리 메뉴`}
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>
      {open &&
        position &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`${menuStyles.menuDropdown} ${menuStyles.menuDropdownFixed} ${styles.menuDropdown}`}
            style={{ top: position.top, right: position.right }}
          >
            <button
              type="button"
              className={`${menuStyles.menuItem} ${styles.pickItem} ${
                isMonthlyPick ? styles.pickItemActive : ''
              }`}
              onClick={(event) => {
                event.stopPropagation()
                closeAndRun(onMonthlyPick)
              }}
            >
              <span>🏅 이번 달 BEST 선정</span>
              {isMonthlyPick && (
                <Check size={14} className={styles.checkIcon} aria-hidden="true" />
              )}
            </button>
            <div className={styles.separator} role="separator" />
            <button
              type="button"
              className={menuStyles.menuItem}
              onClick={(event) => {
                event.stopPropagation()
                closeAndRun(onViewInfo)
              }}
            >
              👤 회원 정보
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}
