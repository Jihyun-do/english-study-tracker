import { useState } from 'react'
import type { AssignmentFormData } from '../../../types/assignment'
import { AdminButton } from '../AdminButton'
import { Card } from '../../ui/Card'
import { AssignmentFormFields } from './AssignmentFormFields'
import { AssignmentPreviewDrawer } from './AssignmentPreviewDrawer'
import styles from './AssignmentForm.module.css'

interface AssignmentFormProps {
  form: AssignmentFormData
  onChange: (form: AssignmentFormData) => void
  onSubmit: () => void
  submitLabel: string
  isEditing?: boolean
}

export function AssignmentForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  isEditing = false,
}: AssignmentFormProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const canSubmit = form.title.trim().length > 0 && form.publishDate.length > 0

  return (
    <>
      <Card className={styles.form} padding="lg">
        {isEditing && (
          <p className={styles.editBanner}>등록된 과제를 수정하고 있습니다</p>
        )}

        <AssignmentFormFields form={form} onChange={onChange} />

        <div className={styles.actions}>
          <AdminButton variant="secondary" onClick={() => setPreviewOpen(true)}>
            미리보기
          </AdminButton>
          <AdminButton type="submit" disabled={!canSubmit} onClick={onSubmit}>
            {submitLabel}
          </AdminButton>
        </div>
      </Card>

      <AssignmentPreviewDrawer
        isOpen={previewOpen}
        form={form}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  )
}
