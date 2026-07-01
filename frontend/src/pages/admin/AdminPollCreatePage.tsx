import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminButton } from '../../components/admin/AdminButton'
import { PollForm } from '../../components/admin/content/PollForm'
import { createEmptyPollForm } from '../../components/admin/content/contentUtils'
import { useStudyContent } from '../../contexts/StudyContentContext'
import { useToast } from '../../contexts/ToastContext'
import { ADMIN_ROUTES } from '../../router/paths'
import styles from './AdminContentFormPage.module.css'

export function AdminPollCreatePage() {
  const navigate = useNavigate()
  const { addPoll } = useStudyContent()
  const { showToast } = useToast()
  const [form, setForm] = useState(createEmptyPollForm)

  const handleSubmit = () => {
    addPoll(form)
    showToast('투표를 등록했습니다.')
    navigate(`${ADMIN_ROUTES.content}?tab=polls`)
  }

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="투표 등록"
        description="스터디원에게 참여할 운영용 투표를 만드세요"
        action={
          <AdminButton
            variant="ghost"
            onClick={() => navigate(`${ADMIN_ROUTES.content}?tab=polls`)}
          >
            목록으로
          </AdminButton>
        }
      />

      <PollForm form={form} onChange={setForm} onSubmit={handleSubmit} submitLabel="투표 등록" />
    </div>
  )
}
