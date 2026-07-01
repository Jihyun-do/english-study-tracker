import { Flame } from 'lucide-react'
import { Card } from '../ui/Card'
import styles from './StreakCard.module.css'

interface StreakCardProps {
  days: number
}

export function StreakCard({ days }: StreakCardProps) {
  return (
    <Card className={styles.streakCard} padding="md">
      <div className={styles.iconWrap}>
        <Flame size={28} className={styles.flame} fill="currentColor" />
      </div>
      <p className={styles.value}>{days}일 연속!</p>
    </Card>
  )
}
