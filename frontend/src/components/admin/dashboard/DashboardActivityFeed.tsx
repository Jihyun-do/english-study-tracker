import { Card } from '../../ui/Card'
import type { DashboardActivity } from '../../../data/mockDashboardData'
import styles from './DashboardActivityFeed.module.css'

const ACTIVITY_EMOJI: Record<DashboardActivity['type'], string> = {
  submission: '📝',
  topic: '💡',
  comment: '💬',
  notice: '📢',
  poll: '🗳️',
}

interface DashboardActivityFeedProps {
  activities: DashboardActivity[]
}

export function DashboardActivityFeed({ activities }: DashboardActivityFeedProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>최근 활동</h2>
      <Card padding="md">
        <ul className={styles.list}>
          {activities.map((activity) => (
            <li key={activity.id} className={styles.item}>
              <span className={styles.emoji} aria-hidden="true">
                {ACTIVITY_EMOJI[activity.type]}
              </span>
              <div className={styles.content}>
                <p className={styles.message}>{activity.message}</p>
                <p className={styles.time}>{activity.createdAt}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  )
}
