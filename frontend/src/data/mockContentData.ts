import type { AdminCheeringMessage, AdminNotice, AdminPoll } from '../types/content'

export const mockAdminNotices: AdminNotice[] = [
  {
    id: 'notice-1',
    preview: '📢 이번 주 금요일 스터디는 20시 시작합니다.',
    title: '금요일 스터디 시간 변경 안내',
    content:
      '안녕하세요, 스터디원 여러분.\n\n이번 주 금요일 스터디는 사전 공지드린 대로 20시에 시작합니다. Zoom 링크는 스터디 시작 30분 전에 공유드릴 예정이니 참고해주세요.\n\n감사합니다.',
    publishDate: '2025-06-14',
    visibility: 'public',
    isBanner: true,
    createdAt: '2025-06-14',
  },
  {
    id: 'notice-2',
    preview: '📌 7월 스터디 일정 사전 안내',
    title: '7월 스터디 일정 사전 안내',
    content:
      '7월 스터디는 매주 금요일 19:30에 진행됩니다.\n\n휴식 주는 7월 셋째 주이며, 해당 주에는 과제만 진행하고 모임은 없습니다.',
    publishDate: '2025-07-01',
    visibility: 'public',
    isBanner: false,
    createdAt: '2025-06-20',
  },
  {
    id: 'notice-3',
    preview: '🎉 6월 BEST 참여자 발표',
    title: '6월 BEST 참여자 발표',
    content: '6월 BEST 참여자는 민수님, 지영님입니다. 축하드립니다!',
    publishDate: '2025-07-05',
    visibility: 'public',
    isBanner: false,
    createdAt: '2025-06-28',
  },
]

export const mockAdminPolls: AdminPoll[] = [
  {
    id: 'poll-1',
    title: '7월 추가 모임 요일 투표',
    options: [
      { id: 'opt-1', label: '화요일 20:00', voteCount: 5 },
      { id: 'opt-2', label: '수요일 20:00', voteCount: 8 },
      { id: 'opt-3', label: '토요일 14:00', voteCount: 3 },
    ],
    startDate: '2026-06-10',
    endDate: '2026-07-05',
    allowMultiple: false,
    participantCount: 12,
    totalMembers: 15,
    createdAt: '2025-06-10',
  },
  {
    id: 'poll-2',
    title: '8월 교재 선정 투표',
    options: [
      { id: 'opt-4', label: 'Real-Life English Conversations', voteCount: 0 },
      { id: 'opt-5', label: 'English for Everyday Situations', voteCount: 0 },
    ],
    startDate: '2026-06-25',
    endDate: '2026-07-15',
    allowMultiple: false,
    participantCount: 0,
    totalMembers: 15,
    createdAt: '2025-06-22',
  },
  {
    id: 'poll-3',
    title: '6월 스터디 만족도 조사',
    options: [
      { id: 'opt-6', label: '매우 만족', voteCount: 7 },
      { id: 'opt-7', label: '만족', voteCount: 5 },
      { id: 'opt-8', label: '보통', voteCount: 2 },
      { id: 'opt-9', label: '아쉬움', voteCount: 1 },
    ],
    startDate: '2025-05-20',
    endDate: '2025-06-05',
    allowMultiple: false,
    participantCount: 15,
    totalMembers: 15,
    createdAt: '2025-05-20',
  },
]

export const mockAdminCheeringMessages: AdminCheeringMessage[] = [
  {
    id: 'cheer-1',
    message: '오늘도 영어 한 문장! 💜',
    status: 'in_use',
    createdAt: '2026-07-01',
  },
  {
    id: 'cheer-2',
    message: '꾸준함은 최고의 재능입니다.',
    status: 'inactive',
    createdAt: '2026-06-20',
  },
  {
    id: 'cheer-3',
    message: '포기하지 않는 사람이 결국 이깁니다.',
    status: 'inactive',
    createdAt: '2026-06-15',
  },
]
