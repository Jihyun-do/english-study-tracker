import { ArrowLeft } from 'lucide-react'
import { TopicDetailContent } from '../components/topics/TopicDetailContent'
import { getTopicById } from '../data/mockTopicData'
import { useLikeToggle } from '../hooks/useLikeToggle'
import styles from './TopicDetailPage.module.css'

interface TopicDetailPageProps {
  topicId: string
  onBack: () => void
}

export function TopicDetailPage({ topicId, onBack }: TopicDetailPageProps) {
  const topic = getTopicById(topicId)
  const { isLiked, likeCount, toggleLike } = useLikeToggle(
    topic?.isLiked ?? false,
    topic?.likeCount ?? 0,
  )

  if (!topic) return null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="뒤로 가기">
          <ArrowLeft size={22} />
        </button>
        <h2 className={styles.headerTitle}>주제 상세</h2>
      </header>

      <TopicDetailContent
        topic={{
          title: topic.title,
          description: topic.description,
          referenceLink: topic.referenceLink,
          isAdopted: topic.isAdopted,
          likeCount,
          authorName: topic.authorName,
          isAnonymous: topic.isAnonymous,
          createdAtISO: topic.createdAt,
        }}
        isLiked={isLiked}
        onToggleLike={toggleLike}
        linkOpensInNewTab
      />
    </div>
  )
}
