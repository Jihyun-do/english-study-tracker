import { Heart } from 'lucide-react'
import { Card } from '../ui/Card'
import { AdoptedBadge } from './AdoptedBadge'
import { TopicAuthorDisplay } from './TopicAuthorDisplay'
import { LinkPreview } from './LinkPreview'
import { formatTopicDate } from '../../data/mockTopicData'
import styles from './TopicDetailContent.module.css'

export interface TopicDetailContentData {
  title: string
  description: string
  referenceLink?: string
  isAdopted: boolean
  likeCount: number
  authorName: string
  isAnonymous?: boolean
  createdAtISO: string
}

interface TopicDetailContentProps {
  topic: TopicDetailContentData
  isLiked?: boolean
  onToggleLike?: () => void
  readOnlyLike?: boolean
  linkOpensInNewTab?: boolean
}

export function TopicDetailContent({
  topic,
  isLiked = false,
  onToggleLike,
  readOnlyLike = false,
  linkOpensInNewTab = false,
}: TopicDetailContentProps) {
  const likeCount = topic.likeCount

  return (
    <Card padding="md">
      <div className={styles.titleRow}>
        <h3 className={styles.title}>{topic.title}</h3>
        {topic.isAdopted && <AdoptedBadge />}
      </div>

      {topic.isAdopted && (
        <p className={styles.adoptedNote}>
          스터디장이 채택한 주제입니다. 좋아요는 선호도를 나타내며 투표는 계속 가능합니다.
        </p>
      )}

      <p className={styles.description}>{topic.description}</p>

      {topic.referenceLink && (
        <LinkPreview url={topic.referenceLink} openInNewTab={linkOpensInNewTab} />
      )}

      <div className={styles.meta}>
        <TopicAuthorDisplay
          authorName={topic.authorName}
          isAnonymous={topic.isAnonymous}
          date={formatTopicDate(topic.createdAtISO)}
        />
        {readOnlyLike ? (
          <span className={styles.likeDisplay} aria-label={`좋아요 ${likeCount}`}>
            <Heart size={16} />
            <span>{likeCount}</span>
          </span>
        ) : (
          <button
            type="button"
            className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
            onClick={onToggleLike}
            aria-pressed={isLiked}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{likeCount}</span>
          </button>
        )}
      </div>
    </Card>
  )
}
