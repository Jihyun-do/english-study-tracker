import { useState } from 'react'

import { useAuth } from '../auth/AuthContext'

import { MyPageProfileHeader } from '../components/mypage/MyPageProfileHeader'

import { LearningStatsCard } from '../components/mypage/LearningStatsCard'

import { StudyCalendar } from '../components/home/StudyCalendar'

import { DayRecordPanel } from '../components/mypage/DayRecordPanel'

import { mockAdminStudySettings } from '../data/mockAdminData'

import { hasAssignmentOnDate } from '../data/mockMyPageData'

import { useMyPageSubmissions } from '../contexts/MyPageSubmissionsContext'

import styles from './MyPage.module.css'

export function MyPage() {
  const { user } = useAuth()
  const { myPageData, getDayRecord } = useMyPageSubmissions()

  const {
    streakDays,
    monthlyParticipationRate,
    totalSubmissions,
    year,
    month,
    completedDates,
    assignmentDates,
    today,
  } = myPageData

  const [selectedDate, setSelectedDate] = useState<number>(today)
  const [viewYear, setViewYear] = useState(year)
  const [viewMonth, setViewMonth] = useState(month)

  const isReferenceMonth = viewYear === year && viewMonth === month
  const hasAssignment =
    isReferenceMonth && hasAssignmentOnDate(assignmentDates, selectedDate)
  const record = isReferenceMonth ? getDayRecord(selectedDate) : null

  return (
    <div className={styles.page}>
      <MyPageProfileHeader
        userName={user?.name ?? '명수'}
        studyName={mockAdminStudySettings.name}
      />

      <LearningStatsCard
        streakDays={streakDays}
        monthlyRate={monthlyParticipationRate}
        totalSubmissions={totalSubmissions}
      />

      <StudyCalendar
        year={year}
        month={month}
        completedDates={completedDates}
        today={today}
        selectedDate={selectedDate}
        onDateClick={setSelectedDate}
        onMonthChange={(y, m) => {
          setViewYear(y)
          setViewMonth(m)
        }}
        className={styles.calendar}
      />

      <DayRecordPanel
        year={viewYear}
        month={viewMonth}
        day={selectedDate}
        record={record}
        isReferenceMonth={isReferenceMonth}
        hasAssignment={hasAssignment}
      />
    </div>
  )
}
