import { Card } from '../ui/Card'
import styles from './LearningStatsCard.module.css'

interface LearningStatsCardProps {
  streakDays: number
  monthlyRate: number
  totalSubmissions: number
}

export function LearningStatsCard({
  streakDays,
  monthlyRate,
  totalSubmissions,
}: LearningStatsCardProps) {
  return (
    <Card className={styles.card} padding="md">
      <div className={styles.stat}>
        <span className={styles.emoji}>🔥</span>
        <p className={styles.value}>{streakDays}일 연속</p>
        <p className={styles.label}>연속 참여일</p>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.emoji}>📈</span>
        <p className={styles.value}>{monthlyRate}%</p>
        <p className={styles.label}>이번 달 참여율</p>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.emoji}>✅</span>
        <p className={styles.value}>{totalSubmissions}회</p>
        <p className={styles.label}>총 제출 수</p>
      </div>
    </Card>
  )
}
