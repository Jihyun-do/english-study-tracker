import { Heart } from 'lucide-react'
import { Card } from '../ui/Card'
import { mockPopularTopics } from '../../data/mockHomeSections'
import styles from './PopularTopicsSection.module.css'

interface PopularTopicsSectionProps {
  onTopicClick: (topicId: string) => void
}

const RANK_LABEL = ['1위', '2위', '3위']

export function PopularTopicsSection({ onTopicClick }: PopularTopicsSectionProps) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>🏆 이번 달 인기 주제</h3>
      <Card padding="sm">
        <ul className={styles.list}>
          {mockPopularTopics.map((topic, index) => (
            <li key={topic.topicId}>
              <button
                type="button"
                className={styles.item}
                onClick={() => onTopicClick(topic.topicId)}
              >
                <span className={styles.rank}>{RANK_LABEL[index]}</span>
                <span className={styles.topicTitle}>{topic.title}</span>
                <span className={styles.likes}>
                  <Heart size={14} />
                  {topic.likeCount}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  )
}
