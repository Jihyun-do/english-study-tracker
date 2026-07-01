import type { TabId } from '../components/layout/AppLayout'
import type { SubmissionImageTheme } from './submissionUtils'

export interface SubmitAssignmentParams {
  assignmentId: string
  returnTab?: TabId
}

export interface EditSubmissionParams {
  submissionId: string
  assignmentId: string
  day: number
  year: number
  month: number
  initialMemo: string
  initialImageTheme?: SubmissionImageTheme
  initialAudioFileName?: string
  initialAudioDuration?: string
}

/** 향후 Supabase/API 연동 시 사용할 제출 데이터 구조 */
export interface SubmissionFormData {
  assignmentId: string
  imageFile: File | null
  imagePreviewUrl: string | null
  audioFile: File | null
  memo: string
}

export interface SubmissionAssignment {
  id: string
  dateLabel: string
  title: string
  description: string
}

export type AppOverlay = 'none' | 'submit' | 'submit-success' | 'edit-submission'

export interface AppNavigationContextValue {
  openSubmitAssignment: (params: SubmitAssignmentParams) => void
  openEditSubmission: (params: EditSubmissionParams) => void
  openMaterialDetail: (materialId: string) => void
  navigateToMyPage: () => void
  navigateBack: () => void
  submitAssignment: (data: SubmissionFormData) => void
  navigateToHome: () => void
  navigateToFeed: () => void
  openTopicDetail: (topicId: string) => void
  currentAssignmentId: string | null
  currentEditParams: EditSubmissionParams | null
}
