import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminButton } from '../../components/admin/AdminButton'
import { NoticeForm } from '../../components/admin/content/NoticeForm'
import { createEmptyNoticeForm } from '../../components/admin/content/contentUtils'
import { useStudyContent } from '../../contexts/StudyContentContext'
import { useToast } from '../../contexts/ToastContext'
import { ADMIN_ROUTES } from '../../router/paths'
import styles from './AdminContentFormPage.module.css'

export function AdminNoticeCreatePage() {
  const navigate = useNavigate()
  const { addNotice } = useStudyContent()
  const { showToast } = useToast()
  const [form, setForm] = useState(createEmptyNoticeForm)

  const handleSubmit = () => {
    addNotice(form)
    showToast('공지를 등록했습니다.')
    navigate(ADMIN_ROUTES.content)
  }

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="공지 작성"
        description="작성한 공지는 게시일 00:00에 공개됩니다"
        action={
          <AdminButton variant="ghost" onClick={() => navigate(ADMIN_ROUTES.content)}>
            목록으로
          </AdminButton>
        }
      />

      <NoticeForm form={form} onChange={setForm} onSubmit={handleSubmit} submitLabel="공지 등록" />
    </div>
  )
}
