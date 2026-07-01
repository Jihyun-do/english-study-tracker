import { useState } from 'react'
import type { NoticeFormData } from '../../../types/content'
import { AdminButton } from '../AdminButton'
import { Card } from '../../ui/Card'
import { NoticeFormFields } from './NoticeFormFields'
import { NoticePreviewDrawer } from './NoticePreviewDrawer'
import { createNoticeFromForm } from './contentUtils'
import styles from './NoticeForm.module.css'

interface NoticeFormProps {
  form: NoticeFormData
  onChange: (form: NoticeFormData) => void
  onSubmit: () => void
  submitLabel: string
  isEditing?: boolean
  noticeId?: string
}

export function NoticeForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  isEditing = false,
  noticeId,
}: NoticeFormProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const canSubmit =
    form.title.trim().length > 0 &&
    form.preview.trim().length > 0 &&
    form.content.trim().length > 0 &&
    form.publishDate.length > 0

  const previewNotice = createNoticeFromForm(form, noticeId)

  return (
    <>
      <Card className={styles.form} padding="lg">
        {isEditing && <p className={styles.editBanner}>등록된 공지를 수정하고 있습니다</p>}
        <NoticeFormFields form={form} onChange={onChange} />
        <div className={styles.actions}>
          <AdminButton variant="secondary" onClick={() => setPreviewOpen(true)}>
            미리보기
          </AdminButton>
          <AdminButton disabled={!canSubmit} onClick={onSubmit}>
            {submitLabel}
          </AdminButton>
        </div>
      </Card>

      <NoticePreviewDrawer
        notice={previewOpen ? previewNotice : null}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  )
}
