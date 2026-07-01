import { ArrowLeft } from 'lucide-react'
import { useAppNavigation } from '../../context/AppNavigationContext'
import { useToast } from '../../contexts/ToastContext'
import { getSubmissionAssignmentDisplay } from '../getSubmissionAssignment'
import { useSubmissionForm } from '../hooks/useSubmissionForm'
import { AssignmentInfo } from '../components/AssignmentInfo'
import { ImageUploadField } from '../components/ImageUploadField'
import { AudioUploadField } from '../components/AudioUploadField'
import { MemoField } from '../components/MemoField'
import styles from './SubmitAssignmentPage.module.css'

export function SubmitAssignmentPage() {
  const { navigateBack, submitAssignment, currentAssignmentId } = useAppNavigation()
  const assignmentId = currentAssignmentId ?? 'material-1'
  const assignment = getSubmissionAssignmentDisplay(assignmentId)

  const form = useSubmissionForm(assignmentId)
  const { showToast } = useToast()

  const handleSubmit = () => {
    showToast('과제를 제출했습니다.')
    submitAssignment(form.getFormData())
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={navigateBack} aria-label="뒤로 가기">
          <ArrowLeft size={22} />
        </button>
        <h2 className={styles.title}>과제 제출</h2>
      </header>

      <AssignmentInfo assignment={assignment} />

      <ImageUploadField
        previewUrl={form.imagePreviewUrl}
        onImageSelect={form.handleImageSelect}
        onImageClear={form.handleImageClear}
      />

      <AudioUploadField
        fileName={form.audioFileName}
        onAudioSelect={form.handleAudioSelect}
        onAudioClear={form.handleAudioClear}
      />

      <MemoField value={form.memo} onChange={form.setMemo} />

      <button type="button" className={styles.submitBtn} onClick={handleSubmit}>
        과제 제출하기
      </button>
    </div>
  )
}
