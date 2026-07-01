import styles from './ContentSegmentTabs.module.css'

export type ContentTab = 'notices' | 'polls' | 'cheering'

interface ContentSegmentTabsProps {
  value: ContentTab
  onChange: (tab: ContentTab) => void
}

const TABS: { key: ContentTab; label: string }[] = [
  { key: 'notices', label: '공지' },
  { key: 'polls', label: '투표' },
  { key: 'cheering', label: '응원 문구' },
]

export function ContentSegmentTabs({ value, onChange }: ContentSegmentTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="콘텐츠 유형">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={value === key}
          className={`${styles.tab} ${value === key ? styles.tabActive : ''}`}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
