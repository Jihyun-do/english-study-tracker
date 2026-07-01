import styles from './EmptyState.module.css'

type EmptyStateVariant = 'plain' | 'boxed' | 'inline'

interface EmptyStateProps {
  message: string
  variant?: EmptyStateVariant
  fill?: boolean
  className?: string
}

export function EmptyState({
  message,
  variant = 'plain',
  fill = false,
  className = '',
}: EmptyStateProps) {
  return (
    <p
      className={`${styles.empty} ${styles[variant]} ${fill ? styles.fill : ''} ${className}`}
      role="status"
    >
      {message}
    </p>
  )
}
