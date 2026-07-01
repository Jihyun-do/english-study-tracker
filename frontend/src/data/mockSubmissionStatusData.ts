export interface SubmitterAvatar {
  id: string
  imageUrl?: string
  fallbackEmoji?: string
  backgroundColor?: string
}

export interface MaterialSubmissionStatus {
  totalMembers: number
  submittedCount: number
  submitters: SubmitterAvatar[]
}

const AVATAR_COLORS = ['#ede9fe', '#f3f0ff', '#e8e4fb', '#ddd6fe', '#ede9fe', '#f3f0ff', '#e8e4fb']

export const mockMaterialSubmissionStatus: MaterialSubmissionStatus = {
  totalMembers: 18,
  submittedCount: 14,
  submitters: Array.from({ length: 14 }, (_, index) => ({
    id: `submitter-${index + 1}`,
    fallbackEmoji: '🙂',
    backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  })),
}
