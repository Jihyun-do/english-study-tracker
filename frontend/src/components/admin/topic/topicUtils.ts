import type { AdminTopicItem } from '../../../data/mockAdminData'
import {
  getCurrentMonthKey,
} from '../submission/submissionUtils'

export interface TopicMonthGroup {
  monthKey: string
  label: string
  topics: AdminTopicItem[]
}

export function getTopicMonthKey(createdAtISO: string): string {
  return createdAtISO.slice(0, 7)
}

export function getTopicMonthKeys(topics: AdminTopicItem[], now = new Date()): string[] {
  const keys = new Set(topics.map((topic) => getTopicMonthKey(topic.createdAtISO)))
  keys.add(getCurrentMonthKey(now))
  return Array.from(keys).sort((a, b) => b.localeCompare(a))
}

export function filterTopicsByMonth(
  topics: AdminTopicItem[],
  monthKey: string,
): AdminTopicItem[] {
  return sortTopicsByPopularity(
    topics.filter((topic) => getTopicMonthKey(topic.createdAtISO) === monthKey),
  )
}

export function formatTopicMonthGroupLabel(monthKey: string): string {
  const month = Number(monthKey.split('-')[1])
  return `${month}월 제안 주제`
}

export function groupTopicsByMonth(topics: AdminTopicItem[]): TopicMonthGroup[] {
  const map = new Map<string, AdminTopicItem[]>()

  for (const topic of topics) {
    const monthKey = getTopicMonthKey(topic.createdAtISO)
    const existing = map.get(monthKey) ?? []
    existing.push(topic)
    map.set(monthKey, existing)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([monthKey, monthTopics]) => ({
      monthKey,
      label: formatTopicMonthGroupLabel(monthKey),
      topics: sortTopicsByPopularity(monthTopics),
    }))
}

export function sortTopicsByPopularity(topics: AdminTopicItem[]): AdminTopicItem[] {
  return [...topics].sort((a, b) => b.likeCount - a.likeCount)
}

export function splitTopicsByAdoption(topics: AdminTopicItem[]): {
  pending: AdminTopicItem[]
  adopted: AdminTopicItem[]
} {
  const pending = sortTopicsByPopularity(topics.filter((topic) => !topic.isAdopted))
  const adopted = sortTopicsByPopularity(topics.filter((topic) => topic.isAdopted))
  return { pending, adopted }
}

export function isCurrentTopicMonth(monthKey: string, now = new Date()): boolean {
  return monthKey === getCurrentMonthKey(now)
}

export function formatTopicCreatedAtDisplay(createdAtISO: string): string {
  const date = new Date(createdAtISO)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}
