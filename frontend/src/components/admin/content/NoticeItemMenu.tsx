import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'
import { useFixedDropdown } from '../../../hooks/useFixedDropdown'
import styles from '../AdminItemMenu.module.css'

interface NoticeItemMenuProps {
  isBanner: boolean
  canSetBanner: boolean
  onEdit: () => void
  onSetBanner: () => void
  onHide: () => void
  onDelete: () => void
}

export function NoticeItemMenu({
  isBanner,
  canSetBanner,
  onEdit,
  onSetBanner,
  onHide,
  onDelete,
}: NoticeItemMenuProps) {
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
        aria-label="공지 관리 메뉴"
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
            {canSetBanner && !isBanner && (
              <button
                type="button"
                className={styles.menuItem}
                onClick={(event) => {
                  event.stopPropagation()
                  closeAndRun(onSetBanner)
                }}
              >
                홈 배너 지정
              </button>
            )}
            <button
              type="button"
              className={styles.menuItem}
              onClick={(event) => {
                event.stopPropagation()
                closeAndRun(onHide)
              }}
            >
              종료 처리
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
