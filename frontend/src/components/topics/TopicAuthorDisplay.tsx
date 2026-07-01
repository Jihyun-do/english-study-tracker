import type { TopicSuggestion } from '../../data/mockTopicData'
import { getTopicDisplayAuthor } from '../../data/mockTopicData'
import styles from './TopicAuthorDisplay.module.css'

interface TopicAuthorDisplayProps {
  topic?: TopicSuggestion
  authorName?: string
  isAnonymous?: boolean
  date?: string
  className?: string
}

export function TopicAuthorDisplay({
  topic,
  authorName,
  isAnonymous = false,
  date,
  className,
}: TopicAuthorDisplayProps) {
  const displayName = topic
    ? getTopicDisplayAuthor(topic)
    : isAnonymous
      ? '익명'
      : (authorName ?? '')

  return (
    <p className={`${styles.meta} ${className ?? ''}`}>
      <span className={styles.name}>{displayName}</span>
      {date && (
        <>
          <span className={styles.divider} aria-hidden="true">
            ·
          </span>
          <span className={styles.date}>{date}</span>
        </>
      )}
    </p>
  )
}
