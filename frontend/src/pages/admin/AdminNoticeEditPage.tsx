import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminButton } from '../../components/admin/AdminButton'
import { NoticeForm } from '../../components/admin/content/NoticeForm'
import { noticeToForm } from '../../components/admin/content/contentUtils'
import { useStudyContent } from '../../contexts/StudyContentContext'
import { useToast } from '../../contexts/ToastContext'
import { ADMIN_ROUTES } from '../../router/paths'
import type { NoticeFormData } from '../../types/content'
import styles from './AdminContentFormPage.module.css'

export function AdminNoticeEditPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getNoticeById, updateNotice } = useStudyContent()
  const { showToast } = useToast()
  const notice = id ? getNoticeById(id) : undefined

  const [form, setForm] = useState<NoticeFormData | null>(
    notice ? noticeToForm(notice) : null,
  )

  useEffect(() => {
    if (!id) {
      navigate(ADMIN_ROUTES.content, { replace: true })
      return
    }
    if (!notice) {
      navigate(ADMIN_ROUTES.content, { replace: true })
      return
    }
    setForm(noticeToForm(notice))
  }, [id, notice, navigate])

  if (!id || !notice || !form) return null

  const handleSubmit = () => {
    updateNotice(id, form)
    showToast('공지를 수정했습니다.')
    navigate(ADMIN_ROUTES.content)
  }

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="공지 수정"
        description="공지 내용과 홈 배너 지정을 변경할 수 있습니다"
        action={
          <AdminButton variant="ghost" onClick={() => navigate(ADMIN_ROUTES.content)}>
            목록으로
          </AdminButton>
        }
      />

      <NoticeForm
        form={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        submitLabel="변경 저장"
        isEditing
        noticeId={id}
      />
    </div>
  )
}
