import { useNavigate } from 'react-router-dom'
import { Card } from '../../ui/Card'
import { EmptyState } from '../../ui/EmptyState'
import type { DashboardTodoItem } from './dashboardUtils'
import styles from './DashboardTodoCard.module.css'

interface DashboardTodoCardProps {
  items: DashboardTodoItem[]
}

export function DashboardTodoCard({ items }: DashboardTodoCardProps) {
  const navigate = useNavigate()

  return (
    <Card className={styles.card} padding="md">
      <h2 className={styles.title}>📌 오늘 확인할 사항</h2>

      {items.length === 0 ? (
        <EmptyState message="오늘 확인할 업무가 없습니다." />
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.type}>
              <button
                type="button"
                className={`${styles.item} ${styles[`tone_${item.tone}`]}`}
                onClick={() => navigate(item.href)}
              >
                <span className={styles.emoji} aria-hidden="true">
                  {item.emoji}
                </span>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.count}>{item.count}건</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
