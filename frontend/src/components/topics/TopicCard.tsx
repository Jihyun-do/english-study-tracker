import { type MouseEvent } from 'react'
import { Heart, ExternalLink } from 'lucide-react'
import { Card } from '../ui/Card'
import type { TopicSuggestion } from '../../data/mockTopicData'
import { formatTopicDate } from '../../data/mockTopicData'
import { useLikeToggle } from '../../hooks/useLikeToggle'
import { AdoptedBadge } from './AdoptedBadge'
import { TopicAuthorDisplay } from './TopicAuthorDisplay'
import styles from './TopicCard.module.css'

interface TopicCardProps {
  topic: TopicSuggestion
  onClick?: () => void
}

export function TopicCard({ topic, onClick }: TopicCardProps) {
  const { isLiked, likeCount, toggleLike } = useLikeToggle(topic.isLiked, topic.likeCount)

  const handleLikeClick = (event: MouseEvent) => {
    event.stopPropagation()
    toggleLike()
  }

  const content = (
    <>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>{topic.title}</h3>
        {topic.isAdopted && <AdoptedBadge />}
      </div>

      <p className={styles.description}>{topic.description}</p>

      {topic.referenceLink && (
        <a
          href={topic.referenceLink}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.preventDefault()}
        >
          <ExternalLink size={14} />
          <span>{topic.referenceLabel ?? '참고 링크'}</span>
        </a>
      )}

      <div className={styles.footer}>
        <TopicAuthorDisplay
          topic={topic}
          date={formatTopicDate(topic.createdAt)}
        />
        <button
          type="button"
          className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
          onClick={handleLikeClick}
          aria-pressed={isLiked}
          aria-label={`좋아요 ${likeCount}`}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button type="button" className={styles.cardBtn} onClick={onClick}>
        <Card className={styles.card} padding="md">
          {content}
        </Card>
      </button>
    )
  }

  return (
    <Card className={styles.card} padding="md">
      {content}
    </Card>
  )
}
