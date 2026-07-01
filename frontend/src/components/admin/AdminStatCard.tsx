import { Card } from '../ui/Card'
import styles from './AdminStatCard.module.css'

interface AdminStatCardProps {
  label: string
  value: string | number
  emoji?: string
}

export function AdminStatCard({ label, value, emoji }: AdminStatCardProps) {
  return (
    <Card className={styles.card} padding="md">
      {emoji && <span className={styles.emoji}>{emoji}</span>}
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </Card>
  )
}
