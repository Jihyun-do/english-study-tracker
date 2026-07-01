import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  centered?: boolean
  className?: string
}

export function LoadingSpinner({
  size = 'md',
  label,
  centered = false,
  className = '',
}: LoadingSpinnerProps) {
  const spinner = (
    <span
      className={`${styles.spinner} ${styles[size]} ${className}`}
      role="status"
      aria-label={label ?? '로딩 중'}
    />
  )

  if (!centered && !label) return spinner

  return (
    <div className={styles.center}>
      {spinner}
      {label && <p className={styles.label}>{label}</p>}
    </div>
  )
}
