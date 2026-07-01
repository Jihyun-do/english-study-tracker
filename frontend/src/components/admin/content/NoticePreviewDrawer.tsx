import type { AdminNotice } from '../../../types/content'
import { NoticeDetailContent } from '../../notice/NoticeDetailContent'
import { AdminDrawer } from '../AdminDrawer'

interface NoticePreviewDrawerProps {
  notice: AdminNotice | null
  onClose: () => void
}

export function NoticePreviewDrawer({ notice, onClose }: NoticePreviewDrawerProps) {
  return (
    <AdminDrawer isOpen={notice !== null} title="공지사항" onClose={onClose}>
      {notice && (
        <NoticeDetailContent
          title={notice.title}
          publishDate={notice.publishDate}
          content={notice.content}
        />
      )}
    </AdminDrawer>
  )
}
