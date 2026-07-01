import type { ReactNode } from 'react'
import styles from './AdminButton.module.css'

interface AdminButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function AdminButton({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
  className = '',
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
