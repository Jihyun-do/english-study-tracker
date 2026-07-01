import type { CheeringMessageFormData } from '../../../types/content'
import { AdminButton } from '../AdminButton'
import styles from './CheeringMessageForm.module.css'

const MAX_LENGTH = 100

interface CheeringMessageFormProps {
  form: CheeringMessageFormData
  onChange: (form: CheeringMessageFormData) => void
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
}

export function CheeringMessageForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: CheeringMessageFormProps) {
  const canSubmit = form.message.trim().length > 0 && form.message.length <= MAX_LENGTH

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        if (canSubmit) onSubmit()
      }}
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="cheering-message">
          응원 문구
        </label>
        <textarea
          id="cheering-message"
          className={styles.textarea}
          value={form.message}
          maxLength={MAX_LENGTH}
          placeholder="응원 문구를 입력하세요"
          onChange={(event) => onChange({ message: event.target.value })}
        />
        <p className={styles.hint}>
          {form.message.length}/{MAX_LENGTH}자 (최대 {MAX_LENGTH}자)
        </p>
      </div>

      <div className={styles.actions}>
        <AdminButton variant="ghost" type="button" onClick={onCancel}>
          취소
        </AdminButton>
        <AdminButton type="submit" disabled={!canSubmit}>
          {submitLabel}
        </AdminButton>
      </div>
    </form>
  )
}
