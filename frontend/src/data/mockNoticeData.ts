/** @deprecated Use StudyContentContext and mockContentData instead */
export type { AdminNotice as Notice } from '../types/content'

export { mockAdminNotices as mockNotices } from './mockContentData'

import { mockAdminNotices } from './mockContentData'

export function getNoticeById(id: string) {
  return mockAdminNotices.find((notice) => notice.id === id)
}
