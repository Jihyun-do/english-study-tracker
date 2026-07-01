/** Mock 앱 기준 현재 시각 (마이페이지 mockMyPageData.today = 16과 일치) */
export const MOCK_NOW = new Date('2025-06-16T22:00:00')

export function isBeforeSubmissionDeadline(dueAt: string): boolean {
  return MOCK_NOW.getTime() < new Date(dueAt).getTime()
}

export type SubmissionImageTheme = 'lavender' | 'mint' | 'peach' | 'sky'

export interface AssignmentSubmissionFile {
  id: string
  submissionId: string
  type: 'image' | 'audio'
  fileName?: string
  imageTheme?: SubmissionImageTheme
  audioDuration?: string
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  memo: string
  submittedAt: string
  dueAt: string
  assignmentTitle: string
  files: AssignmentSubmissionFile[]
}

export interface SubmissionUpdatePayload {
  memo: string
  imageFile: File | null
  imageTheme: SubmissionImageTheme | null
  audioFile: File | null
  audioFileName: string | null
  audioDuration: string | null
}

const IMAGE_THEMES: SubmissionImageTheme[] = ['lavender', 'mint', 'peach', 'sky']

export function resolveImageThemeFromFile(_file: File): SubmissionImageTheme {
  return IMAGE_THEMES[Math.floor(Math.random() * IMAGE_THEMES.length)]
}

export function formatSubmittedTime(iso: string): string {
  const date = new Date(iso)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
