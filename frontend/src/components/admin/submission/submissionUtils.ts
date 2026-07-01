import type { AdminSubmissionAssignmentGroup, AdminSubmissionItem } from '../../../data/mockAdminData'

export type FeedbackStatus = 'pending' | 'completed'

export type SubmissionFilterStatus =
  | 'all'
  | 'feedback_pending'
  | 'feedback_completed'
  | 'new_comments'

export function getFeedbackStatus(item: AdminSubmissionItem): FeedbackStatus | null {
  if (item.status !== 'completed') return null
  if (item.feedbackStatus) return item.feedbackStatus
  if (item.feedbackPreview || item.feedbackAt) return 'completed'
  return 'pending'
}

export function isAssignmentClosed(
  deadlineDate: string,
  deadlineTime: string,
  now = new Date(),
): boolean {
  const deadlineAt = new Date(`${deadlineDate}T${deadlineTime}:00`)
  return now > deadlineAt
}

export function formatSubmissionDateLabel(publishDate: string): string {
  const [, month, day] = publishDate.split('-').map(Number)
  return `${month}월 ${day}일 과제`
}

export function formatSubmittedAtDisplay(
  submittedAt: string | null,
  publishDate?: string,
): string {
  if (!submittedAt || submittedAt === '-') return '-'

  if (/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}$/.test(submittedAt)) {
    return submittedAt
  }

  if (/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/.test(submittedAt)) {
    return `${submittedAt}:00`
  }

  const timeMatch = submittedAt.match(/^(\d{2}:\d{2})(?::(\d{2}))?$/)
  if (timeMatch && publishDate) {
    const [y, m, d] = publishDate.split('-')
    const seconds = timeMatch[2] ?? '00'
    return `${y}.${m}.${d} ${timeMatch[1]}:${seconds}`
  }

  return submittedAt
}

import { getSubmissionListPriority } from './submissionCommentUtils'

function sortByFeedbackPriority(items: AdminSubmissionItem[]): AdminSubmissionItem[] {
  return [...items].sort((a, b) => getSubmissionListPriority(a) - getSubmissionListPriority(b))
}

export function filterSubmissions(
  submissions: AdminSubmissionItem[],
  search: string,
  filter: SubmissionFilterStatus,
): AdminSubmissionItem[] {
  const query = search.trim()

  const submittedOnly = submissions.filter((item) => item.status === 'completed')

  const filtered = submittedOnly.filter((item) => {
    const matchesSearch = query.length === 0 || item.memberName.includes(query)
    const feedbackStatus = getFeedbackStatus(item)
    const matchesFilter =
      filter === 'all' ||
      (filter === 'feedback_pending' && feedbackStatus === 'pending') ||
      (filter === 'feedback_completed' && feedbackStatus === 'completed') ||
      (filter === 'new_comments' && (item.unreadSubmitterCommentCount ?? 0) > 0)
    return matchesSearch && matchesFilter
  })

  return sortByFeedbackPriority(filtered)
}

export function splitSubmissionGroups(
  groups: AdminSubmissionAssignmentGroup[],
  now = new Date(),
): {
  active: AdminSubmissionAssignmentGroup[]
  closed: AdminSubmissionAssignmentGroup[]
} {
  const active: AdminSubmissionAssignmentGroup[] = []
  const closed: AdminSubmissionAssignmentGroup[] = []

  for (const group of groups) {
    if (isAssignmentClosed(group.deadlineDate, group.deadlineTime, now)) {
      closed.push(group)
    } else {
      active.push(group)
    }
  }

  const sortByDate = (a: AdminSubmissionAssignmentGroup, b: AdminSubmissionAssignmentGroup) =>
    b.publishDate.localeCompare(a.publishDate)

  return {
    active: active.sort(sortByDate),
    closed: closed.sort(sortByDate),
  }
}

export function hasVisibleSubmissions(
  group: AdminSubmissionAssignmentGroup,
  search: string,
  filter: SubmissionFilterStatus,
): boolean {
  return filterSubmissions(group.submissions, search, filter).length > 0
}

export function getMonthKey(publishDate: string): string {
  return publishDate.slice(0, 7)
}

export function getSubmissionMonthKeys(
  groups: AdminSubmissionAssignmentGroup[],
  now = new Date(),
): string[] {
  const keys = new Set(groups.map((group) => getMonthKey(group.publishDate)))
  keys.add(getCurrentMonthKey(now))
  return Array.from(keys).sort((a, b) => b.localeCompare(a))
}

export function filterGroupsByMonth(
  groups: AdminSubmissionAssignmentGroup[],
  monthKey: string,
): AdminSubmissionAssignmentGroup[] {
  return groups.filter((group) => getMonthKey(group.publishDate) === monthKey)
}

export function getCurrentMonthKey(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  return `${year}년 ${month}월`
}

export function parseSubmissionFilter(value: string | null): SubmissionFilterStatus {
  if (value === 'new_comments') return 'new_comments'
  if (value === 'feedback_pending') return 'feedback_pending'
  if (value === 'feedback_completed') return 'feedback_completed'
  return 'all'
}

export interface SubmissionMonthGroup {
  monthKey: string
  label: string
  assignments: AdminSubmissionAssignmentGroup[]
}

export function groupClosedByMonth(
  groups: AdminSubmissionAssignmentGroup[],
): SubmissionMonthGroup[] {
  const map = new Map<string, AdminSubmissionAssignmentGroup[]>()

  for (const group of groups) {
    const monthKey = getMonthKey(group.publishDate)
    const existing = map.get(monthKey) ?? []
    existing.push(group)
    map.set(monthKey, existing)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([monthKey, assignments]) => ({
      monthKey,
      label: formatMonthLabel(monthKey),
      assignments: assignments.sort((a, b) => b.publishDate.localeCompare(a.publishDate)),
    }))
}

export interface SubmissionSummary {
  submittedCount: number
  totalCount: number
  rate: number
}

export function getSubmissionSummary(group: AdminSubmissionAssignmentGroup): SubmissionSummary {
  const totalCount = group.submissions.length
  const submittedCount = group.submissions.filter((item) => item.status === 'completed').length
  const rate = totalCount === 0 ? 0 : Math.round((submittedCount / totalCount) * 100)

  return { submittedCount, totalCount, rate }
}

export function formatSubmissionSummary(summary: SubmissionSummary): string {
  return `${summary.submittedCount} / ${summary.totalCount} 제출`
}

export function formatAssignmentPublishDate(publishDate: string): string {
  const [year, month, day] = publishDate.split('-')
  return `${year}.${month}.${day}`
}

export function formatSubmissionCountLabel(summary: SubmissionSummary): string {
  return `제출 ${summary.submittedCount} / ${summary.totalCount}명`
}

export function monthHasVisibleAssignments(
  month: SubmissionMonthGroup,
  search: string,
  filter: SubmissionFilterStatus,
): boolean {
  return month.assignments.some((group) => hasVisibleSubmissions(group, search, filter))
}

export function countVisibleAssignmentsInMonth(
  month: SubmissionMonthGroup,
  search: string,
  filter: SubmissionFilterStatus,
): number {
  return month.assignments.filter((group) => hasVisibleSubmissions(group, search, filter)).length
}
