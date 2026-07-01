import type { AdminPoll } from '../../types/content'
import { getPollOperationalStatus } from '../../components/admin/content/contentUtils'

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getActivePolls(polls: AdminPoll[], now = new Date()): AdminPoll[] {
  return polls
    .filter((poll) => getPollOperationalStatus(poll, now) === 'active')
    .sort((a, b) => parseDateOnly(a.endDate).getTime() - parseDateOnly(b.endDate).getTime())
}

export function getClosedPolls(polls: AdminPoll[], now = new Date()): AdminPoll[] {
  return polls
    .filter((poll) => getPollOperationalStatus(poll, now) === 'closed')
    .sort((a, b) => parseDateOnly(b.endDate).getTime() - parseDateOnly(a.endDate).getTime())
}

export function getHomeFeaturedPoll(polls: AdminPoll[], now = new Date()): AdminPoll | null {
  return getActivePolls(polls, now)[0] ?? null
}

export function getDaysUntilPollEnd(endDate: string, now = new Date()): number {
  const end = startOfDay(parseDateOnly(endDate))
  const today = startOfDay(now)
  const diffMs = end.getTime() - today.getTime()
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
}

export function formatPollRemainText(daysLeft: number): string {
  if (daysLeft === 0) return '오늘 종료'
  return `${daysLeft}일 남음`
}

export function formatPollDday(daysLeft: number): string {
  if (daysLeft === 0) return 'D-Day'
  return `D-${daysLeft}`
}

export function formatPollPeriod(startDate: string, endDate: string): string {
  const format = (value: string) => {
    const [year, month, day] = value.split('-')
    return `${Number(month)}/${Number(day)}`
  }
  return `${format(startDate)} ~ ${format(endDate)}`
}

export function getPollResultPercentages(poll: AdminPoll): { optionId: string; percent: number }[] {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.voteCount, 0)
  if (totalVotes === 0) {
    return poll.options.map((option) => ({ optionId: option.id, percent: 0 }))
  }
  return poll.options.map((option) => ({
    optionId: option.id,
    percent: Math.round((option.voteCount / totalVotes) * 100),
  }))
}
