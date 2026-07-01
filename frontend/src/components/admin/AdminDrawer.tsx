import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import styles from './AdminDrawer.module.css'

interface AdminDrawerProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function AdminDrawer({ isOpen, title, onClose, children }: AdminDrawerProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <aside
        className={styles.drawer}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </aside>
    </div>
  )
}
