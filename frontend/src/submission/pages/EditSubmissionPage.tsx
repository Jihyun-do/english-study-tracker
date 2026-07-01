import { ArrowLeft } from 'lucide-react'
import { useAppNavigation } from '../../context/AppNavigationContext'
import { useMyPageSubmissions } from '../../contexts/MyPageSubmissionsContext'
import { useToast } from '../../contexts/ToastContext'
import { getSubmissionAssignmentDisplay } from '../getSubmissionAssignment'
import { useSubmissionForm } from '../hooks/useSubmissionForm'
import { AssignmentInfo } from '../components/AssignmentInfo'
import { ImageUploadField } from '../components/ImageUploadField'
import { AudioUploadField } from '../components/AudioUploadField'
import { MemoField } from '../components/MemoField'
import styles from './SubmitAssignmentPage.module.css'

export function EditSubmissionPage() {
  const { navigateBack, currentEditParams } = useAppNavigation()
  const { updateSubmission } = useMyPageSubmissions()
  const { showToast } = useToast()

  const assignmentId = currentEditParams?.assignmentId ?? ''
  const day = currentEditParams?.day ?? 0

  const form = useSubmissionForm(assignmentId, {
    memo: currentEditParams?.initialMemo ?? '',
    existingImageTheme: currentEditParams?.initialImageTheme ?? null,
    existingAudioFileName: currentEditParams?.initialAudioFileName ?? null,
  })

  if (!currentEditParams) return null

  const assignment = getSubmissionAssignmentDisplay(currentEditParams.assignmentId)

  const handleSave = () => {
    updateSubmission(day, {
      memo: form.memo,
      imageFile: form.getFormData().imageFile,
      imageTheme: form.existingImageTheme,
      audioFile: form.getFormData().audioFile,
      audioFileName: form.audioFileName,
      audioDuration: form.audioFileName ? currentEditParams.initialAudioDuration ?? null : null,
    })
    showToast('과제를 수정했습니다.')
    navigateBack()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={navigateBack} aria-label="뒤로 가기">
          <ArrowLeft size={22} />
        </button>
        <h2 className={styles.title}>제출 수정</h2>
      </header>

      <AssignmentInfo assignment={assignment} />

      <ImageUploadField
        previewUrl={form.imagePreviewUrl}
        existingImageTheme={form.existingImageTheme}
        onImageSelect={form.handleImageSelect}
        onImageClear={form.handleImageClear}
      />

      <AudioUploadField
        fileName={form.audioFileName}
        onAudioSelect={form.handleAudioSelect}
        onAudioClear={form.handleAudioClear}
      />

      <MemoField value={form.memo} onChange={form.setMemo} />

      <button type="button" className={styles.submitBtn} onClick={handleSave}>
        수정 저장
      </button>
    </div>
  )
}
