import { ChevronRight } from 'lucide-react'
import { Card } from '../ui/Card'
import styles from './TodayAssignment.module.css'

interface TodayAssignmentProps {
  sectionTitle: string
  assignmentTitle: string
  onDetailClick: () => void
}

export function TodayAssignment({
  sectionTitle,
  assignmentTitle,
  onDetailClick,
}: TodayAssignmentProps) {
  return (
    <section>
      <Card padding="md">
        <p className={styles.sectionLabel}>{sectionTitle}</p>
        <h2 className={styles.assignmentTitle}>{assignmentTitle}</h2>
        <button type="button" className={styles.detailLink} onClick={onDetailClick}>
          자세히 보기
          <ChevronRight size={16} />
        </button>
      </Card>
    </section>
  )
}
