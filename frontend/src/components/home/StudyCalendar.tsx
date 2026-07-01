import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '../ui/Card'
import styles from './StudyCalendar.module.css'

interface StudyCalendarProps {
  year: number
  month: number
  completedDates: number[]
  today: number
  onDateClick?: (day: number) => void
  selectedDate?: number | null
  className?: string
  onMonthChange?: (year: number, month: number) => void
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay()
}

export function StudyCalendar({
  year: initialYear,
  month: initialMonth,
  completedDates,
  today,
  onDateClick,
  selectedDate = null,
  className = '',
  onMonthChange,
}: StudyCalendarProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)

  const calendarCells = useMemo(() => {
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [firstDay, daysInMonth])

  const isCurrentMonth = year === initialYear && month === initialMonth

  const goToPrevMonth = () => {
    const nextMonth = month === 1 ? 12 : month - 1
    const nextYear = month === 1 ? year - 1 : year
    setYear(nextYear)
    setMonth(nextMonth)
    onMonthChange?.(nextYear, nextMonth)
  }

  const goToNextMonth = () => {
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    setYear(nextYear)
    setMonth(nextMonth)
    onMonthChange?.(nextYear, nextMonth)
  }

  const getDayStatus = (day: number) => {
    if (isCurrentMonth && day === today) return 'today'
    if (isCurrentMonth && selectedDate === day) return 'selected'
    if (isCurrentMonth && completedDates.includes(day)) return 'completed'
    return 'default'
  }

  const renderDay = (day: number) => {
    const status = getDayStatus(day)
    const className = `${styles.day} ${styles[status]}`

    if (onDateClick) {
      return (
        <button
          type="button"
          className={className}
          onClick={() => onDateClick(day)}
          aria-label={`${month}월 ${day}일`}
          aria-pressed={isCurrentMonth && selectedDate === day}
        >
          {day}
        </button>
      )
    }

    return <span className={className}>{day}</span>
  }

  return (
    <Card className={`${styles.calendar} ${className}`} padding="md">
      <div className={styles.header}>
        <button type="button" className={styles.navBtn} onClick={goToPrevMonth} aria-label="이전 달">
          <ChevronLeft size={20} />
        </button>
        <h2 className={styles.title}>
          {year}년 {month}월
        </h2>
        <button type="button" className={styles.navBtn} onClick={goToNextMonth} aria-label="다음 달">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <span key={day} className={styles.weekday}>
            {day}
          </span>
        ))}
      </div>

      <div className={styles.grid}>
        {calendarCells.map((day, index) =>
          day === null ? (
            <div key={`empty-${index}`} className={styles.cell} />
          ) : (
            <div key={day} className={styles.cell}>
              {renderDay(day)}
            </div>
          ),
        )}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.completedDot}`} />
          완료
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.todayDot}`} />
          오늘
        </span>
      </div>
    </Card>
  )
}
