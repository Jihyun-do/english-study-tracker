import type { AdminMemberItem, MonthlyBestPickMap } from '../../../data/mockAdminData'
import { formatMonthLabel } from '../submission/submissionUtils'

export type MemberSortKey = 'participationRate' | 'streakDays' | 'submissionRate'

export type MemberSortDir = 'asc' | 'desc'

export interface MemberSortState {
  key: MemberSortKey
  dir: MemberSortDir
}

export function getMemberMonthlyStats(
  member: AdminMemberItem,
  monthKey: string,
) {
  return member.monthlyStats[monthKey] ?? null
}

export function getMemberParticipationRate(member: AdminMemberItem, monthKey: string): number {
  const stats = getMemberMonthlyStats(member, monthKey)
  if (!stats || stats.assignmentCount === 0) return 0
  return Math.round((stats.participatedCount / stats.assignmentCount) * 100)
}

export function getMemberSubmissionRate(member: AdminMemberItem, monthKey: string): number {
  const stats = getMemberMonthlyStats(member, monthKey)
  if (!stats || stats.submissionTargetCount === 0) return 0
  return Math.round((stats.submittedCount / stats.submissionTargetCount) * 100)
}

export function getMemberSortValue(
  member: AdminMemberItem,
  key: MemberSortKey,
  monthKey: string,
): number {
  switch (key) {
    case 'participationRate':
      return getMemberParticipationRate(member, monthKey)
    case 'submissionRate':
      return getMemberSubmissionRate(member, monthKey)
    case 'streakDays':
      return member.streakDays
  }
}

export function formatMemberMonthOption(monthKey: string): string {
  return formatMonthLabel(monthKey)
}

/** 스터디원(ROLE_USER)만 조회 — 스터디장(ROLE_ADMIN) 제외 */
export function filterStudyMembers(
  members: AdminMemberItem[],
  search: string,
): AdminMemberItem[] {
  const query = search.trim().toLowerCase()

  return members.filter((member) => {
    if (member.role !== 'ROLE_USER') return false
    return query.length === 0 || member.name.toLowerCase().includes(query)
  })
}

export function sortMembers(
  members: AdminMemberItem[],
  sort: MemberSortState | null,
  monthKey: string,
): AdminMemberItem[] {
  if (!sort) return members

  const sorted = [...members]
  const direction = sort.dir === 'asc' ? 1 : -1

  sorted.sort((a, b) => {
    const aVal = getMemberSortValue(a, sort.key, monthKey)
    const bVal = getMemberSortValue(b, sort.key, monthKey)
    return (aVal - bVal) * direction
  })

  return sorted
}

export function toggleMemberSort(
  current: MemberSortState | null,
  key: MemberSortKey,
): MemberSortState {
  if (current?.key !== key) {
    return { key, dir: 'desc' }
  }

  return { key, dir: current.dir === 'desc' ? 'asc' : 'desc' }
}

/** 백엔드 연동 시 year + month + memberId 형태로 저장 */
export interface MonthlyBestPickRecord {
  year: number
  month: number
  memberId: string | null
}

export function monthKeyToYearMonth(monthKey: string): { year: number; month: number } {
  const [year, month] = monthKey.split('-').map(Number)
  return { year, month }
}

export function getMonthlyBestMemberId(
  picks: MonthlyBestPickMap,
  monthKey: string,
): string | null {
  return picks[monthKey] ?? null
}

export function isMemberMonthlyPick(
  picks: MonthlyBestPickMap,
  monthKey: string,
  memberId: string,
): boolean {
  return picks[monthKey] === memberId
}

export function toggleMonthlyBestPick(
  picks: MonthlyBestPickMap,
  monthKey: string,
  memberId: string,
): MonthlyBestPickMap {
  const current = picks[monthKey] ?? null
  return {
    ...picks,
    [monthKey]: current === memberId ? null : memberId,
  }
}

export function removeMemberFromMonthlyPicks(
  picks: MonthlyBestPickMap,
  memberId: string,
): MonthlyBestPickMap {
  return Object.fromEntries(
    Object.entries(picks).map(([key, id]) => [key, id === memberId ? null : id]),
  )
}
