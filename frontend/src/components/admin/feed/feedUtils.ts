import type { AdminFeedItem } from '../../../data/mockAdminData'
import { getCurrentMonthKey } from '../submission/submissionUtils'

export function getFeedMonthKey(createdAtISO: string): string {
  return createdAtISO.slice(0, 7)
}

export function getFeedMonthKeys(items: AdminFeedItem[], now = new Date()): string[] {
  const keys = new Set(items.map((item) => getFeedMonthKey(item.createdAtISO)))
  keys.add(getCurrentMonthKey(now))
  return Array.from(keys).sort((a, b) => b.localeCompare(a))
}

export function filterFeedItemsByMonth(
  items: AdminFeedItem[],
  monthKey: string,
): AdminFeedItem[] {
  return items.filter((item) => getFeedMonthKey(item.createdAtISO) === monthKey)
}

export function filterFeedItems(
  items: AdminFeedItem[],
  search: string,
  monthKey: string,
): AdminFeedItem[] {
  const byMonth = filterFeedItemsByMonth(items, monthKey)

  const query = search.trim().toLowerCase()
  if (query.length === 0) return byMonth

  return byMonth.filter((item) => item.authorName.toLowerCase().includes(query))
}

export function getDefaultFeedMonthKey(items: AdminFeedItem[], now = new Date()): string {
  const monthKeys = getFeedMonthKeys(items, now)
  return monthKeys.find((key) => key === getCurrentMonthKey(now)) ?? monthKeys[0]
}
