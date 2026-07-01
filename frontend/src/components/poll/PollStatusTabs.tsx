import styles from './PollStatusTabs.module.css'

export type PollViewTab = 'active' | 'closed'

interface PollStatusTabsProps {
  value: PollViewTab
  onChange: (tab: PollViewTab) => void
}

const TABS: { id: PollViewTab; label: string }[] = [
  { id: 'active', label: '진행 중인 투표' },
  { id: 'closed', label: '종료된 투표' },
]

export function PollStatusTabs({ value, onChange }: PollStatusTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="투표 목록">
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
