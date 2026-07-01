import type { AdminAssignment } from '../types/assignment'

export const mockAdminAssignments: AdminAssignment[] = [
  {
    id: 'assignment-1',
    publishDate: '2026-06-18',
    title: '영화 소개 영어 표현 익히기',
    description:
      '오늘의 영화 클립을 듣고 핵심 표현 5개를 정리해 주세요.\nPDF 자료의 표현 목록을 참고하고, 음성 파일로 쉐도잉 연습을 진행합니다.',
    pdfFiles: [
      { id: 'pdf-1', name: 'day1.pdf', sizeLabel: '1.2MB' },
      { id: 'pdf-2', name: 'script.pdf', sizeLabel: '890KB' },
    ],
    audioFiles: [
      { id: 'audio-1', name: 'normal.mp3', sizeLabel: '2.4MB' },
      { id: 'audio-2', name: 'slow.mp3', sizeLabel: '2.1MB' },
    ],
    deadlineDate: '2026-06-20',
    deadlineTime: '23:59',
    createdAt: '2026-06-15T09:00:00.000Z',
    updatedAt: '2026-06-15T09:00:00.000Z',
  },
  {
    id: 'assignment-2',
    publishDate: '2026-06-22',
    title: 'Business Email Writing',
    description: '비즈니스 이메일 작성 연습 — PDF 예문을 참고해 상황별 이메일 초안을 작성하세요.',
    pdfFiles: [{ id: 'pdf-3', name: 'email-guide.pdf', sizeLabel: '1.5MB' }],
    audioFiles: [{ id: 'audio-3', name: 'sample-tone.mp3', sizeLabel: '1.8MB' }],
    deadlineDate: '2026-06-26',
    deadlineTime: '23:59',
    createdAt: '2026-06-17T10:30:00.000Z',
    updatedAt: '2026-06-17T10:30:00.000Z',
  },
]
