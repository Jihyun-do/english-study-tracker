import { useEffect } from 'react'
import { AdminButton } from './AdminButton'
import styles from './AdminConfirmDialog.module.css'

interface AdminConfirmDialogProps {
  isOpen: boolean
  message: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function AdminConfirmDialog({
  isOpen,
  message,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onCancel} role="presentation">
      <div
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-message"
      >
        <p id="admin-confirm-message" className={styles.message}>
          {message}
        </p>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.actions}>
          <AdminButton variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </AdminButton>
          <AdminButton variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  )
}
