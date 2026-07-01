import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminButton } from '../../components/admin/AdminButton'
import { AssignmentForm } from '../../components/admin/assignment/AssignmentForm'
import {
  assignmentToForm,
  formToAssignment,
} from '../../components/admin/assignment/assignmentUtils'
import { useAdminAssignments } from '../../contexts/AdminAssignmentsContext'
import { useToast } from '../../contexts/ToastContext'
import { ADMIN_ROUTES } from '../../router/paths'
import type { AssignmentFormData } from '../../types/assignment'
import styles from './AdminAssignmentFormPage.module.css'

export function AdminAssignmentEditPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getAssignmentById, updateAssignment } = useAdminAssignments()
  const { showToast } = useToast()
  const assignment = id ? getAssignmentById(id) : undefined

  const [form, setForm] = useState<AssignmentFormData | null>(
    assignment ? assignmentToForm(assignment) : null,
  )

  useEffect(() => {
    if (!id) {
      navigate(ADMIN_ROUTES.assignments, { replace: true })
      return
    }
    if (!assignment) {
      navigate(ADMIN_ROUTES.assignments, { replace: true })
      return
    }
    setForm(assignmentToForm(assignment))
  }, [assignment, id, navigate])

  if (!assignment || !form) return null

  const handleSubmit = () => {
    if (form.title.trim().length === 0 || form.publishDate.length === 0) return
    updateAssignment(formToAssignment(form, assignment))
    showToast('과제를 수정했습니다.')
    navigate(ADMIN_ROUTES.assignments)
  }

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="과제 수정"
        description="등록한 과제는 공개일 00:00에 사용자 홈·자료실에 자동 연결됩니다"
        action={
          <AdminButton variant="ghost" onClick={() => navigate(ADMIN_ROUTES.assignments)}>
            목록으로
          </AdminButton>
        }
      />

      <AssignmentForm
        form={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        submitLabel="과제 수정"
        isEditing
      />
    </div>
  )
}
