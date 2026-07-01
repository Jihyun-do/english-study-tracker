import { StreakCard } from './StreakCard'
import { ProgressCard } from './ProgressCard'
import styles from './StatsRow.module.css'

interface StatsRowProps {
  streakDays: number
  monthlyRate: number
}

export function StatsRow({ streakDays, monthlyRate }: StatsRowProps) {
  return (
    <div className={styles.row}>
      <StreakCard days={streakDays} />
      <ProgressCard rate={monthlyRate} />
    </div>
  )
}
