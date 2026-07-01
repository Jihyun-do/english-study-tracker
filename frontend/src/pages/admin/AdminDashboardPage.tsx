import { useMemo } from 'react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminStatCard } from '../../components/admin/AdminStatCard'
import { DashboardNoticeCard } from '../../components/admin/dashboard/DashboardNoticeCard'
import { DashboardPollCard } from '../../components/admin/dashboard/DashboardPollCard'
import { DashboardAssignmentsSection } from '../../components/admin/dashboard/DashboardAssignmentsSection'
import { DashboardTodoCard } from '../../components/admin/dashboard/DashboardTodoCard'
import { DashboardActivityFeed } from '../../components/admin/dashboard/DashboardActivityFeed'
import {
  buildDashboardTodoItems,
  getActivePolls,
  getMonthlyPickMemberName,
  getPublishedAssignments,
  getStudyMemberCount,
} from '../../components/admin/dashboard/dashboardUtils'
import { useAdminAssignments } from '../../contexts/AdminAssignmentsContext'
import { useStudyContent } from '../../contexts/StudyContentContext'
import {
  mockAdminMembers,
  mockAdminMonthlyBestPicks,
} from '../../data/mockAdminData'
import {
  mockDashboardActivities,
  mockDashboardAssignmentProgress,
  mockDashboardTodaySubmissionCount,
  mockDashboardTodoCounts,
  DASHBOARD_REFERENCE_NOW,
} from '../../data/mockDashboardData'
import { getCurrentMonthKey } from '../../components/admin/submission/submissionUtils'
import styles from './AdminDashboardPage.module.css'

export function AdminDashboardPage() {
  const { assignments } = useAdminAssignments()
  const { getBannerNotice, polls } = useStudyContent()

  const monthKey = getCurrentMonthKey(DASHBOARD_REFERENCE_NOW)
  const bannerNotice = getBannerNotice()
  const activePolls = useMemo(
    () => getActivePolls(polls, DASHBOARD_REFERENCE_NOW),
    [polls],
  )
  const activeAssignments = useMemo(
    () => getPublishedAssignments(assignments, DASHBOARD_REFERENCE_NOW),
    [assignments],
  )

  const memberCount = getStudyMemberCount(mockAdminMembers)
  const monthlyPickName = getMonthlyPickMemberName(
    mockAdminMonthlyBestPicks,
    mockAdminMembers,
    monthKey,
  )

  const todoItems = useMemo(
    () => buildDashboardTodoItems(mockDashboardTodoCounts),
    [],
  )

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="대시보드"
        description="스터디장이 가장 먼저 확인하는 운영 현황입니다"
      />

      <div className={styles.statsGrid}>
        <AdminStatCard label="스터디원 수" value={memberCount} emoji="👥" />
        <AdminStatCard label="진행중 과제" value={activeAssignments.length} emoji="📚" />
        <AdminStatCard
          label="오늘 제출한 인원"
          value={mockDashboardTodaySubmissionCount}
          emoji="📝"
        />
        <AdminStatCard
          label="이번 달 선정자"
          value={monthlyPickName ?? '—'}
          emoji="🏅"
        />
      </div>

      <DashboardTodoCard items={todoItems} />

      <div className={styles.summaryGrid}>
        <DashboardNoticeCard notice={bannerNotice} />
        <DashboardPollCard polls={activePolls} />
      </div>

      <DashboardAssignmentsSection
        assignments={activeAssignments}
        progressMap={mockDashboardAssignmentProgress}
      />

      <DashboardActivityFeed activities={mockDashboardActivities} />
    </div>
  )
}
