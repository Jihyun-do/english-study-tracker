import styles from './LoadingSkeleton.module.css'

type LoadingSkeletonVariant = 'text' | 'textShort' | 'card' | 'table-row'

interface LoadingSkeletonProps {
  variant?: LoadingSkeletonVariant
  count?: number
  className?: string
}

const VARIANT_CLASS: Record<LoadingSkeletonVariant, string> = {
  text: styles.text,
  textShort: styles.textShort,
  card: styles.card,
  'table-row': styles.tableRow,
}

export function LoadingSkeleton({
  variant = 'text',
  count = 1,
  className = '',
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`${styles.skeleton} ${VARIANT_CLASS[variant]} ${className}`}
      aria-hidden="true"
    />
  ))

  if (count === 1) return items[0]

  return <div className={styles.list}>{items}</div>
}
