import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminButton } from '../../components/admin/AdminButton'
import { PollForm } from '../../components/admin/content/PollForm'
import { pollToForm } from '../../components/admin/content/contentUtils'
import { useStudyContent } from '../../contexts/StudyContentContext'
import { useToast } from '../../contexts/ToastContext'
import { ADMIN_ROUTES } from '../../router/paths'
import type { PollFormData } from '../../types/content'
import styles from './AdminContentFormPage.module.css'

export function AdminPollEditPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getPollById, updatePoll } = useStudyContent()
  const { showToast } = useToast()
  const poll = id ? getPollById(id) : undefined

  const [form, setForm] = useState<PollFormData | null>(poll ? pollToForm(poll) : null)

  useEffect(() => {
    if (!id) {
      navigate(`${ADMIN_ROUTES.content}?tab=polls`, { replace: true })
      return
    }
    if (!poll) {
      navigate(`${ADMIN_ROUTES.content}?tab=polls`, { replace: true })
      return
    }
    setForm(pollToForm(poll))
  }, [id, poll, navigate])

  if (!id || !poll || !form) return null

  const handleSubmit = () => {
    updatePoll(id, form)
    showToast('투표를 수정했습니다.')
    navigate(`${ADMIN_ROUTES.content}?tab=polls`)
  }

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="투표 수정"
        description="진행 전 투표의 질문과 선택지를 수정할 수 있습니다"
        action={
          <AdminButton
            variant="ghost"
            onClick={() => navigate(`${ADMIN_ROUTES.content}?tab=polls`)}
          >
            목록으로
          </AdminButton>
        }
      />

      <PollForm
        form={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        submitLabel="변경 저장"
        isEditing
      />
    </div>
  )
}
