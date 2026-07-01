export interface AssignmentMediaFile {
  id: string
  name: string
  sizeLabel?: string
}

export interface AdminAssignment {
  id: string
  /** YYYY-MM-DD — 사용자에게 공개되는 날짜 (해당일 00:00) */
  publishDate: string
  title: string
  description: string
  pdfFiles: AssignmentMediaFile[]
  audioFiles: AssignmentMediaFile[]
  /** YYYY-MM-DD */
  deadlineDate: string
  /** HH:mm */
  deadlineTime: string
  createdAt: string
  updatedAt: string
}

export interface AssignmentFormData {
  publishDate: string
  title: string
  description: string
  pdfFiles: AssignmentMediaFile[]
  audioFiles: AssignmentMediaFile[]
  deadlineDate: string
  deadlineTime: string
}

export type AssignmentPublishStatus = 'scheduled' | 'published'

/** 과제 목록 필터·표시용 운영 상태 */
export type AssignmentOperationalStatus = 'scheduled' | 'published' | 'closed'

export type AssignmentListStatusFilter = 'all' | AssignmentOperationalStatus

export interface AssignmentListQuery {
  search: string
  status: AssignmentListStatusFilter
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
}
