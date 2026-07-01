import { useMemo } from 'react'
import type { AdminTopicItem } from '../../../data/mockAdminData'
import { Card } from '../../ui/Card'
import { splitTopicsByAdoption } from './topicUtils'
import { TopicList } from './TopicList'
import styles from './TopicMonthGroup.module.css'

interface TopicMonthGroupSectionProps {
  topics: AdminTopicItem[]
  onSelect: (topic: AdminTopicItem) => void
  onHide: (id: string) => void
  onDelete: (id: string) => void
}

function TopicStatusGroup({
  title,
  topics,
  onSelect,
  onHide,
  onDelete,
}: {
  title: string
  topics: AdminTopicItem[]
  onSelect: (topic: AdminTopicItem) => void
  onHide: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (topics.length === 0) return null

  return (
    <div className={styles.statusGroup}>
      <h3 className={styles.statusTitle}>{title}</h3>
      <TopicList topics={topics} onSelect={onSelect} onHide={onHide} onDelete={onDelete} />
    </div>
  )
}

export function TopicMonthGroupSection({
  topics,
  onSelect,
  onHide,
  onDelete,
}: TopicMonthGroupSectionProps) {
  const { pending, adopted } = useMemo(
    () => splitTopicsByAdoption(topics),
    [topics],
  )

  return (
    <section className={styles.root}>
      <Card className={styles.panel} padding="sm">
        <div className={styles.body}>
          <TopicStatusGroup
            title="채택 대기"
            topics={pending}
            onSelect={onSelect}
            onHide={onHide}
            onDelete={onDelete}
          />

          {pending.length > 0 && adopted.length > 0 && (
            <div className={styles.divider} role="separator" />
          )}

          <TopicStatusGroup
            title="채택 완료"
            topics={adopted}
            onSelect={onSelect}
            onHide={onHide}
            onDelete={onDelete}
          />
        </div>
      </Card>
    </section>
  )
}
