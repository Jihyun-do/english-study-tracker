import type { TopicSort } from '../../data/mockTopicData'
import styles from './SortTabs.module.css'

interface SortTabsProps {
  value: TopicSort
  onChange: (sort: TopicSort) => void
}

const TABS: { id: TopicSort; label: string }[] = [
  { id: 'popular', label: '인기순' },
  { id: 'latest', label: '최신순' },
]

export function SortTabs({ value, onChange }: SortTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="정렬">
      {TABS.map(({ id, label }) => {
        const isActive = value === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
