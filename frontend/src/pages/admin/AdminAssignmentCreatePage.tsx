import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminButton } from '../../components/admin/AdminButton'
import { AssignmentForm } from '../../components/admin/assignment/AssignmentForm'
import {
  createEmptyForm,
  formToAssignment,
} from '../../components/admin/assignment/assignmentUtils'
import { useAdminAssignments } from '../../contexts/AdminAssignmentsContext'
import { useToast } from '../../contexts/ToastContext'
import { ADMIN_ROUTES } from '../../router/paths'
import type { AssignmentFormData } from '../../types/assignment'
import styles from './AdminAssignmentFormPage.module.css'

export function AdminAssignmentCreatePage() {
  const navigate = useNavigate()
  const { addAssignment } = useAdminAssignments()
  const { showToast } = useToast()
  const [form, setForm] = useState<AssignmentFormData>(createEmptyForm)

  const handleSubmit = () => {
    if (form.title.trim().length === 0 || form.publishDate.length === 0) return
    addAssignment(formToAssignment(form))
    showToast('과제를 등록했습니다.')
    navigate(ADMIN_ROUTES.assignments)
  }

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="과제 등록"
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
        submitLabel="과제 등록"
      />
    </div>
  )
}
