import type { DashboardTodoCounts } from '../../../data/mockDashboardData'
import { ADMIN_ROUTES } from '../../../router/paths'
import type { AdminMemberItem, MonthlyBestPickMap } from '../../../data/mockAdminData'
import type { AdminAssignment } from '../../../types/assignment'
import type { AdminPoll } from '../../../types/content'
import { getAssignmentOperationalStatus } from '../assignment/assignmentUtils'
import { getPollOperationalStatus } from '../content/contentUtils'

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getDeadlineDDay(deadlineDate: string, now = new Date()): string {
  const deadline = startOfDay(parseDateOnly(deadlineDate))
  const today = startOfDay(now)
  const diffDays = Math.round((deadline.getTime() - today.getTime()) / 86_400_000)

  if (diffDays > 0) return `D-${diffDays}`
  if (diffDays === 0) return 'D-Day'
  return `D+${Math.abs(diffDays)}`
}

export function getStudyMemberCount(members: AdminMemberItem[]): number {
  return members.filter((member) => member.role === 'ROLE_USER').length
}

export function getMonthlyPickMemberName(
  picks: MonthlyBestPickMap,
  members: AdminMemberItem[],
  monthKey: string,
): string | null {
  const memberId = picks[monthKey]
  if (!memberId) return null
  return members.find((member) => member.id === memberId)?.name ?? null
}

export function getPublishedAssignments(
  assignments: AdminAssignment[],
  now = new Date(),
): AdminAssignment[] {
  return assignments.filter(
    (assignment) => getAssignmentOperationalStatus(assignment, now) === 'published',
  )
}

export function getActivePolls(polls: AdminPoll[], now = new Date()): AdminPoll[] {
  return polls.filter((poll) => getPollOperationalStatus(poll, now) === 'active')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

export type DashboardTodoType =
  | 'newComments'
  | 'feedbackPending'
  | 'endingTodayPolls'

export type DashboardTodoTone = 'red' | 'yellow' | 'blue' | 'purple'

export interface DashboardTodoItem {
  type: DashboardTodoType
  emoji: string
  label: string
  count: number
  href: string
  tone: DashboardTodoTone
}

const TODO_ITEM_DEFS: Omit<DashboardTodoItem, 'count'>[] = [
  {
    type: 'newComments',
    emoji: '🔴',
    label: '새 댓글',
    href: `${ADMIN_ROUTES.submission}?filter=new_comments`,
    tone: 'red',
  },
  {
    type: 'feedbackPending',
    emoji: '🟡',
    label: '피드백 대기',
    href: `${ADMIN_ROUTES.submission}?filter=feedback_pending`,
    tone: 'yellow',
  },
  {
    type: 'endingTodayPolls',
    emoji: '🟣',
    label: '오늘 종료되는 투표',
    href: `${ADMIN_ROUTES.content}?tab=polls&filter=ending_today`,
    tone: 'purple',
  },
]

const MAX_TODO_ITEMS = 5

export function buildDashboardTodoItems(counts: DashboardTodoCounts): DashboardTodoItem[] {
  return TODO_ITEM_DEFS.map((item) => ({
    ...item,
    count: counts[item.type],
  }))
    .filter((item) => item.count > 0)
    .slice(0, MAX_TODO_ITEMS)
}
