import { ChevronDown, ChevronRight } from 'lucide-react'
import styles from './SubmissionCollapseTrigger.module.css'

interface SubmissionCollapseTriggerProps {
  label: string
  summary?: string
  isExpanded: boolean
  onToggle: () => void
  level?: 'section' | 'month' | 'date'
}

export function SubmissionCollapseTrigger({
  label,
  summary,
  isExpanded,
  onToggle,
  level = 'section',
}: SubmissionCollapseTriggerProps) {
  return (
    <button
      type="button"
      className={`${styles.trigger} ${styles[level]}`}
      onClick={onToggle}
      aria-expanded={isExpanded}
    >
      {isExpanded ? (
        <ChevronDown size={18} className={styles.icon} />
      ) : (
        <ChevronRight size={18} className={styles.icon} />
      )}
      <span className={styles.label}>{label}</span>
      {summary && <span className={styles.summary}>{summary}</span>}
    </button>
  )
}
