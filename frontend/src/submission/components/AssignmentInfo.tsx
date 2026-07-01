import { Card } from '../../components/ui/Card'
import type { SubmissionAssignment } from '../../submission/types'
import styles from './AssignmentInfo.module.css'

interface AssignmentInfoProps {
  assignment: SubmissionAssignment
}

export function AssignmentInfo({ assignment }: AssignmentInfoProps) {
  return (
    <Card padding="md">
      <span className={styles.badge}>{assignment.dateLabel}</span>
      <h3 className={styles.title}>{assignment.title}</h3>
      <p className={styles.description}>{assignment.description}</p>
    </Card>
  )
}
