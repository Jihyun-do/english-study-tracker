import { useEffect } from 'react'
import styles from './Toast.module.css'

interface ToastProps {
  message: string | null
  onClose: () => void
  durationMs?: number
}

export function Toast({ message, onClose, durationMs = 2500 }: ToastProps) {
  useEffect(() => {
    if (!message) return

    const timer = window.setTimeout(onClose, durationMs)
    return () => window.clearTimeout(timer)
  }, [message, onClose, durationMs])

  if (!message) return null

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  )
}
