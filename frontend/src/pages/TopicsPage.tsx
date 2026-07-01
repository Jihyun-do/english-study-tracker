import { useEffect, useMemo, useState } from 'react'
import { TopicCard } from '../components/topics/TopicCard'
import { TopicMonthBanner } from '../components/topics/TopicMonthBanner'
import { SortTabs } from '../components/topics/SortTabs'
import { FloatingActionButton } from '../components/topics/FloatingActionButton'
import { TopicSuggestPage } from './TopicSuggestPage'
import { TopicDetailPage } from './TopicDetailPage'
import {
  mockTopicSuggestions,
  sortTopics,
  type TopicSort,
} from '../data/mockTopicData'
import styles from './TopicsPage.module.css'

interface TopicsPageProps {
  openTopicId?: string | null
  onOpenTopicIdConsumed?: () => void
}

export function TopicsPage({
  openTopicId,
  onOpenTopicIdConsumed,
}: TopicsPageProps) {
  const [sort, setSort] = useState<TopicSort>('popular')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  const sortedTopics = useMemo(
    () => sortTopics(mockTopicSuggestions, sort),
    [sort],
  )

  useEffect(() => {
    if (openTopicId) {
      setSelectedTopicId(openTopicId)
      onOpenTopicIdConsumed?.()
    }
  }, [openTopicId, onOpenTopicIdConsumed])

  if (showCreate) {
    return <TopicSuggestPage onBack={() => setShowCreate(false)} />
  }

  if (selectedTopicId) {
    return (
      <TopicDetailPage
        topicId={selectedTopicId}
        onBack={() => setSelectedTopicId(null)}
      />
    )
  }

  return (
    <div className={styles.page}>
      <TopicMonthBanner />

      <SortTabs value={sort} onChange={setSort} />

      <ul className={styles.list}>
        {sortedTopics.map((topic) => (
          <li key={topic.id}>
            <TopicCard
              topic={topic}
              onClick={() => setSelectedTopicId(topic.id)}
            />
          </li>
        ))}
      </ul>

      <FloatingActionButton label="주제 제안" onClick={() => setShowCreate(true)} />
    </div>
  )
}
