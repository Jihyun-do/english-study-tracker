import type {
  AdminCheeringMessage,
  AdminNotice,
  AdminPoll,
  CheeringMessageFormData,
  CheeringMessageStatus,
  NoticeFilterStatus,
  NoticeFormData,
  NoticeOperationalStatus,
  PollFormData,
  PollOperationalStatus,
} from '../../../types/content'
import { formatDateInput } from '../assignment/assignmentUtils'

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getNoticeOperationalStatus(
  notice: AdminNotice,
  now = new Date(),
): NoticeOperationalStatus {
  if (notice.visibility === 'hidden') return 'hidden'
  const publish = parseDateOnly(notice.publishDate)
  if (publish > startOfDay(now)) return 'scheduled'
  return 'published'
}

export function getNoticeStatusLabel(status: NoticeOperationalStatus): string {
  switch (status) {
    case 'published':
      return '게시중'
    case 'scheduled':
      return '예약'
    case 'hidden':
      return '종료'
  }
}

export function filterNotices(
  notices: AdminNotice[],
  search: string,
  filter: NoticeFilterStatus,
  now = new Date(),
): AdminNotice[] {
  const query = search.trim().toLowerCase()

  return notices.filter((notice) => {
    const status = getNoticeOperationalStatus(notice, now)
    if (filter !== 'all' && status !== filter) return false
    if (query.length === 0) return true
    return (
      notice.title.toLowerCase().includes(query) ||
      notice.preview.toLowerCase().includes(query)
    )
  })
}

export function getPollOperationalStatus(
  poll: AdminPoll,
  now = new Date(),
): PollOperationalStatus {
  const start = parseDateOnly(poll.startDate)
  const end = parseDateOnly(poll.endDate)
  const today = startOfDay(now)

  if (today < start) return 'scheduled'
  if (today > end) return 'closed'
  return 'active'
}

export function getPollStatusLabel(status: PollOperationalStatus): string {
  switch (status) {
    case 'active':
      return '진행중'
    case 'scheduled':
      return '예약'
    case 'closed':
      return '마감'
  }
}

export function filterPolls(polls: AdminPoll[], search: string): AdminPoll[] {
  const query = search.trim().toLowerCase()
  if (query.length === 0) return polls

  return polls.filter((poll) => poll.title.toLowerCase().includes(query))
}

export type PollListFilter = 'all' | 'ending_today'

export function parsePollListFilter(value: string | null): PollListFilter {
  return value === 'ending_today' ? 'ending_today' : 'all'
}

export function filterPollsByListFilter(
  polls: AdminPoll[],
  listFilter: PollListFilter,
  now = new Date(),
): AdminPoll[] {
  if (listFilter !== 'ending_today') return polls
  const today = formatDateInput(now)
  return polls.filter((poll) => poll.endDate === today)
}

export function splitPollsByStatus(
  polls: AdminPoll[],
  now = new Date(),
): Record<PollOperationalStatus, AdminPoll[]> {
  const result: Record<PollOperationalStatus, AdminPoll[]> = {
    active: [],
    scheduled: [],
    closed: [],
  }

  for (const poll of polls) {
    result[getPollOperationalStatus(poll, now)].push(poll)
  }

  return result
}

export function createEmptyNoticeForm(): NoticeFormData {
  const today = formatDateInput(new Date())
  return {
    title: '',
    preview: '',
    content: '',
    publishDate: today,
    isBanner: false,
  }
}

export function noticeToForm(notice: AdminNotice): NoticeFormData {
  return {
    title: notice.title,
    preview: notice.preview,
    content: notice.content,
    publishDate: notice.publishDate,
    isBanner: notice.isBanner,
  }
}

export function createNoticeFromForm(form: NoticeFormData, id?: string, existing?: AdminNotice): AdminNotice {
  const today = new Date().toISOString().slice(0, 10)
  return {
    id: id ?? `notice-${Date.now()}`,
    title: form.title.trim(),
    preview: form.preview.trim(),
    content: form.content.trim(),
    publishDate: form.publishDate,
    visibility: existing?.visibility ?? 'public',
    isBanner: form.isBanner,
    createdAt: existing?.createdAt ?? today,
  }
}

export function createEmptyPollForm(): PollFormData {
  const today = formatDateInput(new Date())
  return {
    title: '',
    options: ['', ''],
    startDate: today,
    endDate: today,
    allowMultiple: false,
  }
}

export function pollToForm(poll: AdminPoll): PollFormData {
  return {
    title: poll.title,
    options: poll.options.map((option) => option.label),
    startDate: poll.startDate,
    endDate: poll.endDate,
    allowMultiple: poll.allowMultiple,
  }
}

export function createPollFromForm(
  form: PollFormData,
  id?: string,
  existing?: AdminPoll,
): AdminPoll {
  const trimmedOptions = form.options.map((label) => label.trim()).filter(Boolean)
  const options = trimmedOptions.map((label, index) => {
    const existingOption = existing?.options[index]
    return {
      id: existingOption?.id ?? `opt-${Date.now()}-${index}`,
      label,
      voteCount: existingOption?.voteCount ?? 0,
    }
  })

  return {
    id: id ?? `poll-${Date.now()}`,
    title: form.title.trim(),
    options,
    startDate: form.startDate,
    endDate: form.endDate,
    allowMultiple: form.allowMultiple,
    participantCount: existing?.participantCount ?? 0,
    totalMembers: existing?.totalMembers ?? 15,
    createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
  }
}

export function getPollParticipationRate(poll: AdminPoll): number {
  if (poll.totalMembers === 0) return 0
  return Math.round((poll.participantCount / poll.totalMembers) * 100)
}

export type ContentTab = 'notices' | 'polls' | 'cheering'

export function parseContentTab(value: string | null): ContentTab {
  if (value === 'polls') return 'polls'
  if (value === 'cheering') return 'cheering'
  return 'notices'
}

export function getCheeringStatusLabel(status: CheeringMessageStatus): string {
  switch (status) {
    case 'in_use':
      return '사용중'
    case 'active':
      return '사용중'
    case 'inactive':
      return '비활성'
  }
}

export function filterCheeringMessages(
  messages: AdminCheeringMessage[],
  search: string,
): AdminCheeringMessage[] {
  const query = search.trim().toLowerCase()
  if (query.length === 0) return messages
  return messages.filter((message) => message.message.toLowerCase().includes(query))
}

export function createEmptyCheeringForm(): CheeringMessageFormData {
  return { message: '' }
}

export function cheeringToForm(message: AdminCheeringMessage): CheeringMessageFormData {
  return { message: message.message }
}

export function createCheeringFromForm(
  form: CheeringMessageFormData,
  id?: string,
  existing?: AdminCheeringMessage,
): AdminCheeringMessage {
  const today = new Date().toISOString().slice(0, 10)
  return {
    id: id ?? `cheer-${Date.now()}`,
    message: form.message.trim(),
    status: existing?.status ?? 'active',
    createdAt: existing?.createdAt ?? today,
  }
}
