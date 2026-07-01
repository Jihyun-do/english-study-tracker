import type { PollFormData } from '../../../types/content'
import { AdminButton } from '../AdminButton'
import { Card } from '../../ui/Card'
import { PollFormFields } from './PollFormFields'
import styles from './PollForm.module.css'

interface PollFormProps {
  form: PollFormData
  onChange: (form: PollFormData) => void
  onSubmit: () => void
  submitLabel: string
  isEditing?: boolean
}

function isPollFormValid(form: PollFormData): boolean {
  const validOptions = form.options.map((option) => option.trim()).filter(Boolean)
  return (
    form.title.trim().length > 0 &&
    form.startDate.length > 0 &&
    form.endDate.length > 0 &&
    validOptions.length >= 2
  )
}

export function PollForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  isEditing = false,
}: PollFormProps) {
  const canSubmit = isPollFormValid(form)

  return (
    <Card className={styles.form} padding="lg">
      {isEditing && <p className={styles.editBanner}>등록된 투표를 수정하고 있습니다</p>}
      <PollFormFields form={form} onChange={onChange} />
      <div className={styles.actions}>
        <AdminButton disabled={!canSubmit} onClick={onSubmit}>
          {submitLabel}
        </AdminButton>
      </div>
    </Card>
  )
}
