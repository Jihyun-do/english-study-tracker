import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import styles from './ProgressCard.module.css'

interface ProgressCardProps {
  rate: number
}

export function ProgressCard({ rate }: ProgressCardProps) {
  return (
    <Card className={styles.progressCard} padding="md">
      <div className={styles.content}>
        <p className={styles.label}>이번 달 참여율</p>
        <p className={styles.value}>{rate}%</p>
        <ProgressBar value={rate} />
      </div>
      <div className={styles.mascot} aria-hidden="true">
        🌱
      </div>
    </Card>
  )
}
