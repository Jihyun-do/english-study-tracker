import type {
  AdminAssignment,
  AssignmentFormData,
  AssignmentMediaFile,
  AssignmentListQuery,
  AssignmentListStatusFilter,
  AssignmentOperationalStatus,
  AssignmentPublishStatus,
  PaginatedResult,
} from '../../../types/assignment'

export const DEFAULT_ASSIGNMENT_PAGE_SIZE = 10

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createEmptyForm(): AssignmentFormData {
  const today = formatDateInput(new Date())
  return {
    publishDate: today,
    title: '',
    description: '',
    pdfFiles: [],
    audioFiles: [],
    deadlineDate: today,
    deadlineTime: '23:59',
  }
}

export function assignmentToForm(assignment: AdminAssignment): AssignmentFormData {
  return {
    publishDate: assignment.publishDate,
    title: assignment.title,
    description: assignment.description,
    pdfFiles: [...assignment.pdfFiles],
    audioFiles: [...assignment.audioFiles],
    deadlineDate: assignment.deadlineDate,
    deadlineTime: assignment.deadlineTime,
  }
}

export function formToAssignment(
  form: AssignmentFormData,
  existing?: AdminAssignment,
): AdminAssignment {
  const now = new Date().toISOString()
  return {
    id: existing?.id ?? generateId(),
    publishDate: form.publishDate,
    title: form.title.trim(),
    description: form.description.trim(),
    pdfFiles: [...form.pdfFiles],
    audioFiles: [...form.audioFiles],
    deadlineDate: form.deadlineDate,
    deadlineTime: form.deadlineTime,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
}

export function formatDateInput(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatPublishDateLabel(publishDate: string): string {
  const [, month, day] = publishDate.split('-').map(Number)
  return `${month}월 ${day}일 과제`
}

export function formatDeadlineLabel(deadlineDate: string, deadlineTime: string): string {
  return `${deadlineDate} ${deadlineTime}`
}

export function getPublishStatus(publishDate: string, now = new Date()): AssignmentPublishStatus {
  const publishAt = new Date(`${publishDate}T00:00:00`)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return publishAt > todayStart ? 'scheduled' : 'published'
}

export function getAssignmentOperationalStatus(
  assignment: AdminAssignment,
  now = new Date(),
): AssignmentOperationalStatus {
  const deadlineAt = new Date(`${assignment.deadlineDate}T${assignment.deadlineTime}:00`)
  if (now > deadlineAt) return 'closed'
  return getPublishStatus(assignment.publishDate, now)
}

export function getAssignmentStatusLabel(status: AssignmentOperationalStatus): string {
  switch (status) {
    case 'scheduled':
      return '예약'
    case 'published':
      return '공개중'
    case 'closed':
      return '마감'
  }
}

export function sortAssignmentsByPublishDate(assignments: AdminAssignment[]): AdminAssignment[] {
  return [...assignments].sort((a, b) => b.publishDate.localeCompare(a.publishDate))
}

export function filterAssignments(
  assignments: AdminAssignment[],
  search: string,
  status: AssignmentListStatusFilter,
): AdminAssignment[] {
  const query = search.trim().toLowerCase()
  return sortAssignmentsByPublishDate(assignments).filter((assignment) => {
    const matchesSearch =
      query.length === 0 || assignment.title.toLowerCase().includes(query)
    const matchesStatus =
      status === 'all' || getAssignmentOperationalStatus(assignment) === status
    return matchesSearch && matchesStatus
  })
}

export function paginateAssignments<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalPages,
    totalItems,
  }
}

export function queryAssignments(
  assignments: AdminAssignment[],
  query: AssignmentListQuery,
): PaginatedResult<AdminAssignment> {
  const filtered = filterAssignments(assignments, query.search, query.status)
  return paginateAssignments(filtered, query.page, query.pageSize)
}

export function getAssignmentMonthKey(publishDate: string): string {
  return publishDate.slice(0, 7)
}

export function getAssignmentMonthKeys(
  assignments: AdminAssignment[],
  now = new Date(),
): string[] {
  const keys = new Set(assignments.map((item) => getAssignmentMonthKey(item.publishDate)))
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  keys.add(`${y}-${m}`)
  return Array.from(keys).sort((a, b) => b.localeCompare(a))
}

export function filterAssignmentsByMonth(
  assignments: AdminAssignment[],
  monthKey: string,
): AdminAssignment[] {
  return assignments.filter(
    (item) => getAssignmentMonthKey(item.publishDate) === monthKey,
  )
}

export function filterAssignmentsDueToday(
  assignments: AdminAssignment[],
  now = new Date(),
): AdminAssignment[] {
  const today = formatDateInput(now)
  return assignments.filter((assignment) => assignment.deadlineDate === today)
}

export function splitAssignmentsByOperationalStatus(
  assignments: AdminAssignment[],
  now = new Date(),
): {
  scheduled: AdminAssignment[]
  published: AdminAssignment[]
  closed: AdminAssignment[]
} {
  const scheduled: AdminAssignment[] = []
  const published: AdminAssignment[] = []
  const closed: AdminAssignment[] = []

  for (const assignment of sortAssignmentsByPublishDate(assignments)) {
    const status = getAssignmentOperationalStatus(assignment, now)
    if (status === 'scheduled') scheduled.push(assignment)
    else if (status === 'published') published.push(assignment)
    else closed.push(assignment)
  }

  return { scheduled, published, closed }
}

export function splitAssignmentsByClosure(
  assignments: AdminAssignment[],
  now = new Date(),
): { active: AdminAssignment[]; closed: AdminAssignment[] } {
  const active: AdminAssignment[] = []
  const closed: AdminAssignment[] = []

  for (const assignment of sortAssignmentsByPublishDate(assignments)) {
    if (getAssignmentOperationalStatus(assignment, now) === 'closed') {
      closed.push(assignment)
    } else {
      active.push(assignment)
    }
  }

  return { active, closed }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export function createMediaFileFromBrowserFile(file: File): AssignmentMediaFile {
  return {
    id: generateId(),
    name: file.name,
    sizeLabel: formatFileSize(file.size),
  }
}
