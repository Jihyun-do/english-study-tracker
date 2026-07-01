export type NoticeVisibility = 'public' | 'hidden'

export type NoticeOperationalStatus = 'published' | 'scheduled' | 'hidden'

export type NoticeFilterStatus = 'all' | NoticeOperationalStatus

export interface AdminNotice {
  id: string
  title: string
  preview: string
  content: string
  publishDate: string
  visibility: NoticeVisibility
  isBanner: boolean
  createdAt: string
}

export type PollOperationalStatus = 'active' | 'scheduled' | 'closed'

export type PollFilterStatus = 'all' | PollOperationalStatus

export interface PollOption {
  id: string
  label: string
  voteCount: number
}

export interface AdminPoll {
  id: string
  title: string
  options: PollOption[]
  startDate: string
  endDate: string
  allowMultiple: boolean
  participantCount: number
  totalMembers: number
  createdAt: string
}

export interface NoticeFormData {
  title: string
  preview: string
  content: string
  publishDate: string
  isBanner: boolean
}

export interface PollFormData {
  title: string
  options: string[]
  startDate: string
  endDate: string
  allowMultiple: boolean
}

export type CheeringMessageStatus = 'in_use' | 'active' | 'inactive'

export interface AdminCheeringMessage {
  id: string
  message: string
  status: CheeringMessageStatus
  createdAt: string
}

export interface CheeringMessageFormData {
  message: string
}
