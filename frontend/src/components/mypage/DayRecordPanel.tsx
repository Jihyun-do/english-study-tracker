import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import type { DayRecord } from '../../data/mockMyPageData'
import { getWeekdayLabel } from '../../data/mockMyPageData'
import { SubmittedDayRecord } from './SubmittedDayRecord'
import styles from './DayRecordPanel.module.css'

interface DayRecordPanelProps {
  year: number
  month: number
  day: number
  record: DayRecord | null
  isReferenceMonth: boolean
  hasAssignment: boolean
}

export function DayRecordPanel({
  year,
  month,
  day,
  record,
  isReferenceMonth,
  hasAssignment,
}: DayRecordPanelProps) {
  const weekday = getWeekdayLabel(year, month, day)

  if (!isReferenceMonth) {
    return (
      <Card className={styles.empty} padding="lg">
        <EmptyState message="이 달의 학습 기록이 없습니다." className={styles.emptyText} />
      </Card>
    )
  }

  if (!hasAssignment) {
    return (
      <Card className={styles.empty} padding="lg">
        <h3 className={styles.recordTitle}>
          {month}월 {day}일 ({weekday}) 기록
        </h3>
        <EmptyState message="아직 등록된 과제가 없습니다." className={styles.noAssignmentText} />
      </Card>
    )
  }

  if (!record || !record.isSubmitted) {
    return (
      <Card className={styles.empty} padding="lg">
        <h3 className={styles.recordTitle}>
          {month}월 {day}일 ({weekday}) 기록
        </h3>
        <p className={styles.pendingBadge}>📝 과제 미제출</p>
        <EmptyState message="아직 이 날짜의 학습 기록이 없습니다." className={styles.emptyText} />
      </Card>
    )
  }

  return (
    <SubmittedDayRecord
      key={`${year}-${month}-${day}`}
      year={year}
      month={month}
      weekday={weekday}
      day={day}
      record={record}
    />
  )
}
