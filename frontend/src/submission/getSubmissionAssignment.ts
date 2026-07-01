import { getMaterialById } from '../data/mockLibraryData'
import type { SubmissionAssignment } from './types'

const FALLBACK_ASSIGNMENT: SubmissionAssignment = {
  id: 'material-1',
  dateLabel: '오늘 과제',
  title: '영화 소개 영어 표현 익히기',
  description:
    '좋아하는 영화를 영어로 소개하는 표현을 익히고, plot summary와 review 표현을 연습합니다.',
}

export function getSubmissionAssignmentDisplay(assignmentId: string): SubmissionAssignment {
  const material = getMaterialById(assignmentId)
  if (!material) return FALLBACK_ASSIGNMENT

  const isToday = material.id === 'material-1'

  return {
    id: material.id,
    dateLabel: isToday ? '오늘 과제' : material.dateLabel,
    title: material.title,
    description: material.description,
  }
}
