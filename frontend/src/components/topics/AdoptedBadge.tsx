import { Trophy } from 'lucide-react'
import styles from './AdoptedBadge.module.css'

interface AdoptedBadgeProps {
  size?: 'default' | 'sm'
}

export function AdoptedBadge({ size = 'default' }: AdoptedBadgeProps) {
  return (
    <span className={`${styles.badge} ${size === 'sm' ? styles.sm : ''}`}>
      <Trophy size={size === 'sm' ? 10 : 12} />
      <span>채택</span>
    </span>
  )
}
