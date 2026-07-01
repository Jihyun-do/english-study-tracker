import type { ThreadComment } from '../types/comment'

export interface AdminDashboardStats {
  todayParticipationRate: number
  overallParticipationRate: number
  activeAssignments: number
  submittedCount: number
  notSubmittedCount: number
  popularTopicThisWeek: string
}

export interface AdminRecentSubmission {
  id: string
  memberName: string
  avatarColor: string
  assignmentTitle: string
  submittedAt: string
  status: 'completed' | 'pending'
}

export interface AdminSubmissionItem {
  id: string
  assignmentId: string
  memberName: string
  avatarColor: string
  submittedAt: string | null
  hasImage: boolean
  hasAudio: boolean
  status: 'completed' | 'pending'
  assignmentTitle: string
  memo?: string
  imageTheme?: 'lavender' | 'mint' | 'peach' | 'sky'
  audioDuration?: string
  likeCount: number
  commentCount: number
  feedbackPreview?: string
  feedbackStatus?: 'pending' | 'completed'
  feedbackAt?: string | null
  likedByAdmin?: boolean
  comments?: ThreadComment[]
  unreadSubmitterCommentCount?: number
}

export interface AdminSubmissionAssignmentGroup {
  assignmentId: string
  title: string
  publishDate: string
  deadlineDate: string
  deadlineTime: string
  submissions: AdminSubmissionItem[]
}

export type FeedVisibility = 'public' | 'hidden'

export interface AdminFeedItem {
  id: string
  authorName: string
  avatarColor: string
  memo: string
  createdAt: string
  createdAtISO: string
  visibility: FeedVisibility
}

export interface AdminTopicItem {
  id: string
  title: string
  description: string
  referenceLink?: string
  referenceLabel?: string
  authorName: string
  avatarColor: string
  likeCount: number
  createdAt: string
  createdAtISO: string
  isAdopted: boolean
  visibility: FeedVisibility
}

import type { UserRole } from '../auth/types'

export interface MemberMonthlyStats {
  assignmentCount: number
  participatedCount: number
  submissionTargetCount: number
  submittedCount: number
}

export interface AdminMemberItem {
  id: string
  name: string
  email: string
  avatarColor: string
  joinedAt: string
  lastLoginAt: string
  lastSubmissionAt: string
  streakDays: number
  monthlyStats: Record<string, MemberMonthlyStats>
  role: UserRole
}

/** monthKey(YYYY-MM) → memberId | null — 월별 BEST 선정자 (백엔드: year + month + memberId) */
export type MonthlyBestPickMap = Record<string, string | null>

export const mockAdminMonthlyBestPicks: MonthlyBestPickMap = {
  '2026-06': 'member-2',
  '2026-05': 'member-3',
  '2026-04': 'member-4',
}

/** 회원 관리 통계 조회 가능 월 (더미) */
export const mockAdminMemberMonthKeys = ['2026-06', '2026-05', '2026-04'] as const

export interface AdminStudySettings {
  name: string
  description: string
  joinCode: string
  imageTheme: 'lavender' | 'mint' | 'peach' | 'sky'
}

export const mockAdminDashboardStats: AdminDashboardStats = {
  todayParticipationRate: 78,
  overallParticipationRate: 92,
  activeAssignments: 1,
  submittedCount: 14,
  notSubmittedCount: 4,
  popularTopicThisWeek: '영화 소개 영어 표현',
}

export const mockAdminRecentSubmissions: AdminRecentSubmission[] = [
  {
    id: 'sub-1',
    memberName: '명수',
    avatarColor: '#B794F4',
    assignmentTitle: '영화 소개 영어 표현 익히기',
    submittedAt: '21:35',
    status: 'completed',
  },
  {
    id: 'sub-2',
    memberName: '지영',
    avatarColor: '#A594E8',
    assignmentTitle: '영화 소개 영어 표현 익히기',
    submittedAt: '21:12',
    status: 'completed',
  },
  {
    id: 'sub-3',
    memberName: '민호',
    avatarColor: '#7EC8A8',
    assignmentTitle: '영화 소개 영어 표현 익히기',
    submittedAt: '20:48',
    status: 'completed',
  },
  {
    id: 'sub-4',
    memberName: '수진',
    avatarColor: '#F5A962',
    assignmentTitle: '영화 소개 영어 표현 익히기',
    submittedAt: '-',
    status: 'pending',
  },
]

function createPendingSubmission(
  id: string,
  assignmentId: string,
  title: string,
  memberName: string,
  avatarColor: string,
): AdminSubmissionItem {
  return {
    id,
    assignmentId,
    memberName,
    avatarColor,
    submittedAt: null,
    hasImage: false,
    hasAudio: false,
    status: 'pending',
    assignmentTitle: title,
    likeCount: 0,
    commentCount: 0,
  }
}

export const mockAdminSubmissionGroups: AdminSubmissionAssignmentGroup[] = [
  {
    assignmentId: 'assignment-2',
    title: 'Business Email Writing',
    publishDate: '2026-06-22',
    deadlineDate: '2026-06-26',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-detail-1',
        assignmentId: 'assignment-2',
        memberName: '명수',
        avatarColor: '#B794F4',
        submittedAt: '21:35',
        hasImage: true,
        hasAudio: true,
        status: 'completed',
        assignmentTitle: 'Business Email Writing',
        memo: '비즈니스 이메일 초안을 작성했습니다.',
        imageTheme: 'lavender',
        audioDuration: '0:42',
        likeCount: 5,
        commentCount: 4,
        feedbackStatus: 'completed',
        feedbackAt: '2026.06.22 21:40',
        feedbackPreview: '이메일 톤이 자연스러워요!',
        unreadSubmitterCommentCount: 2,
        comments: [
          {
            id: 'c-sub1-1',
            authorName: '지수',
            avatarColor: '#9F7AEA',
            role: 'leader',
            content: '이메일 톤이 자연스러워요!',
            createdAt: '2026.06.22 21:40',
            createdAtSort: 1,
          },
          {
            id: 'c-sub1-2',
            authorName: '명수',
            avatarColor: '#B794F4',
            role: 'submitter',
            content: '피드백 감사합니다! closing 문장을 조금 더 다듬어볼게요.',
            createdAt: '2026.06.22 22:10',
            createdAtSort: 2,
            isUnreadByAdmin: true,
          },
          {
            id: 'c-sub1-3',
            authorName: '민호',
            avatarColor: '#7EC8A8',
            role: 'member',
            content: '표현 정리 방식 참고할게요!',
            createdAt: '2026.06.22 22:25',
            createdAtSort: 3,
          },
          {
            id: 'c-sub1-4',
            authorName: '명수',
            avatarColor: '#B794F4',
            role: 'submitter',
            content: '음성으로 추가 질문 남겼어요.',
            createdAt: '2026.06.22 22:30',
            createdAtSort: 4,
            hasVoiceFeedback: true,
            voiceDuration: '0:22',
            isUnreadByAdmin: true,
          },
        ],
      },
      {
        id: 'sub-detail-2',
        assignmentId: 'assignment-2',
        memberName: '지영',
        avatarColor: '#A594E8',
        submittedAt: '21:12',
        hasImage: true,
        hasAudio: true,
        status: 'completed',
        assignmentTitle: 'Business Email Writing',
        memo: 'follow-up email 표현 위주로 정리했어요.',
        imageTheme: 'mint',
        audioDuration: '0:38',
        likeCount: 4,
        commentCount: 1,
        feedbackStatus: 'pending',
      },
      createPendingSubmission(
        'sub-detail-4',
        'assignment-2',
        'Business Email Writing',
        '수진',
        '#F5A962',
      ),
      createPendingSubmission(
        'sub-detail-5',
        'assignment-2',
        'Business Email Writing',
        '현우',
        '#6BAED6',
      ),
    ],
  },
  {
    assignmentId: 'assignment-1',
    title: '영화 소개 영어 표현 익히기',
    publishDate: '2026-06-18',
    deadlineDate: '2026-06-20',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-detail-3',
        assignmentId: 'assignment-1',
        memberName: '민호',
        avatarColor: '#7EC8A8',
        submittedAt: '20:48',
        hasImage: true,
        hasAudio: false,
        status: 'completed',
        assignmentTitle: '영화 소개 영어 표현 익히기',
        memo: 'Shadowing 2번 완료!',
        imageTheme: 'peach',
        likeCount: 3,
        commentCount: 0,
        feedbackStatus: 'pending',
      },
      createPendingSubmission(
        'sub-detail-6',
        'assignment-1',
        '영화 소개 영어 표현 익히기',
        '지수',
        '#9F7AEA',
      ),
    ],
  },
  {
    assignmentId: 'assignment-closed-1',
    title: 'Travel Expressions',
    publishDate: '2026-06-10',
    deadlineDate: '2026-06-12',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-closed-1',
        assignmentId: 'assignment-closed-1',
        memberName: '명수',
        avatarColor: '#B794F4',
        submittedAt: '21:02',
        hasImage: true,
        hasAudio: true,
        status: 'completed',
        assignmentTitle: 'Travel Expressions',
        memo: '공항 표현 정리 완료',
        imageTheme: 'sky',
        audioDuration: '0:35',
        likeCount: 6,
        commentCount: 1,
      },
      createPendingSubmission(
        'sub-closed-2',
        'assignment-closed-1',
        'Travel Expressions',
        '수진',
        '#F5A962',
      ),
    ],
  },
  {
    assignmentId: 'assignment-closed-2',
    title: 'Daily Conversation Practice',
    publishDate: '2026-06-08',
    deadlineDate: '2026-06-09',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-closed-3',
        assignmentId: 'assignment-closed-2',
        memberName: '지영',
        avatarColor: '#A594E8',
        submittedAt: '20:15',
        hasImage: true,
        hasAudio: false,
        status: 'completed',
        assignmentTitle: 'Daily Conversation Practice',
        memo: '오늘의 대화 표현 인증',
        imageTheme: 'mint',
        likeCount: 2,
        commentCount: 0,
      },
    ],
  },
  {
    assignmentId: 'assignment-closed-3',
    title: 'News Article Summary',
    publishDate: '2026-06-05',
    deadlineDate: '2026-06-07',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-closed-4',
        assignmentId: 'assignment-closed-3',
        memberName: '민호',
        avatarColor: '#7EC8A8',
        submittedAt: '22:40',
        hasImage: true,
        hasAudio: true,
        status: 'completed',
        assignmentTitle: 'News Article Summary',
        memo: '뉴스 요약 과제 제출',
        imageTheme: 'peach',
        audioDuration: '0:28',
        likeCount: 4,
        commentCount: 2,
        feedbackPreview: '요약 구조가 좋아요.',
      },
    ],
  },
  {
    assignmentId: 'assignment-closed-4',
    title: 'Vocabulary Builder',
    publishDate: '2026-06-03',
    deadlineDate: '2026-06-05',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-closed-5',
        assignmentId: 'assignment-closed-4',
        memberName: '현우',
        avatarColor: '#6BAED6',
        submittedAt: '19:50',
        hasImage: true,
        hasAudio: false,
        status: 'completed',
        assignmentTitle: 'Vocabulary Builder',
        memo: '단어장 30개 정리',
        imageTheme: 'lavender',
        likeCount: 2,
        commentCount: 0,
      },
      createPendingSubmission(
        'sub-closed-6',
        'assignment-closed-4',
        'Vocabulary Builder',
        '지수',
        '#9F7AEA',
      ),
    ],
  },
  {
    assignmentId: 'assignment-closed-5',
    title: 'Presentation Skills',
    publishDate: '2026-05-28',
    deadlineDate: '2026-05-30',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-closed-7',
        assignmentId: 'assignment-closed-5',
        memberName: '명수',
        avatarColor: '#B794F4',
        submittedAt: '21:10',
        hasImage: true,
        hasAudio: true,
        status: 'completed',
        assignmentTitle: 'Presentation Skills',
        imageTheme: 'mint',
        audioDuration: '0:32',
        likeCount: 3,
        commentCount: 1,
      },
    ],
  },
  {
    assignmentId: 'assignment-closed-6',
    title: 'Idiom Practice',
    publishDate: '2026-05-20',
    deadlineDate: '2026-05-22',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-closed-8',
        assignmentId: 'assignment-closed-6',
        memberName: '지영',
        avatarColor: '#A594E8',
        submittedAt: '20:30',
        hasImage: true,
        hasAudio: false,
        status: 'completed',
        assignmentTitle: 'Idiom Practice',
        imageTheme: 'peach',
        likeCount: 1,
        commentCount: 0,
      },
    ],
  },
  {
    assignmentId: 'assignment-closed-7',
    title: 'Listening Comprehension',
    publishDate: '2026-05-12',
    deadlineDate: '2026-05-14',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-closed-9',
        assignmentId: 'assignment-closed-7',
        memberName: '민호',
        avatarColor: '#7EC8A8',
        submittedAt: '22:05',
        hasImage: false,
        hasAudio: true,
        status: 'completed',
        assignmentTitle: 'Listening Comprehension',
        audioDuration: '0:45',
        likeCount: 2,
        commentCount: 0,
      },
      createPendingSubmission(
        'sub-closed-10',
        'assignment-closed-7',
        'Listening Comprehension',
        '수진',
        '#F5A962',
      ),
    ],
  },
  {
    assignmentId: 'assignment-closed-8',
    title: 'Grammar Review',
    publishDate: '2026-04-25',
    deadlineDate: '2026-04-27',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-closed-11',
        assignmentId: 'assignment-closed-8',
        memberName: '명수',
        avatarColor: '#B794F4',
        submittedAt: '21:00',
        hasImage: true,
        hasAudio: false,
        status: 'completed',
        assignmentTitle: 'Grammar Review',
        imageTheme: 'sky',
        likeCount: 4,
        commentCount: 1,
      },
    ],
  },
  {
    assignmentId: 'assignment-closed-9',
    title: 'Reading Challenge',
    publishDate: '2026-04-15',
    deadlineDate: '2026-04-17',
    deadlineTime: '23:59',
    submissions: [
      {
        id: 'sub-closed-12',
        assignmentId: 'assignment-closed-9',
        memberName: '지영',
        avatarColor: '#A594E8',
        submittedAt: '20:22',
        hasImage: true,
        hasAudio: true,
        status: 'completed',
        assignmentTitle: 'Reading Challenge',
        imageTheme: 'lavender',
        audioDuration: '0:30',
        likeCount: 5,
        commentCount: 2,
      },
    ],
  },
]

/** @deprecated mockAdminSubmissionGroups 사용 */
export const mockAdminSubmissions: AdminSubmissionItem[] =
  mockAdminSubmissionGroups.flatMap((group) => group.submissions)


export const mockAdminFeedItems: AdminFeedItem[] = [
  {
    id: 'feed-1',
    authorName: '지영',
    avatarColor: '#A594E8',
    memo: '오늘은 travel expressions 위주로 정리했어요!',
    createdAt: '6/22 21:12',
    createdAtISO: '2026-06-22T21:12:00',
    visibility: 'public',
  },
  {
    id: 'feed-2',
    authorName: '민호',
    avatarColor: '#7EC8A8',
    memo: 'Shadowing 3번 반복했습니다.',
    createdAt: '6/20 21:08',
    createdAtISO: '2026-06-20T21:08:00',
    visibility: 'public',
  },
  {
    id: 'feed-3',
    authorName: '수진',
    avatarColor: '#F5A962',
    memo: '오늘 과제 단어장 인증!',
    createdAt: '6/15 20:45',
    createdAtISO: '2026-06-15T20:45:00',
    visibility: 'public',
  },
  {
    id: 'feed-4',
    authorName: '하은',
    avatarColor: '#6EB5D9',
    memo: '5월 마지막 주 shadowing 인증합니다.',
    createdAt: '5/28 19:40',
    createdAtISO: '2026-05-28T19:40:00',
    visibility: 'public',
  },
  {
    id: 'feed-5',
    authorName: '지영',
    avatarColor: '#A594E8',
    memo: 'Travel expressions 복습 인증!',
    createdAt: '5/12 21:05',
    createdAtISO: '2026-05-12T21:05:00',
    visibility: 'hidden',
  },
  {
    id: 'feed-6',
    authorName: '민호',
    avatarColor: '#7EC8A8',
    memo: '4월 스터디 과제 제출 인증',
    createdAt: '4/25 20:30',
    createdAtISO: '2026-04-25T20:30:00',
    visibility: 'public',
  },
]

export const mockAdminTopics: AdminTopicItem[] = [
  {
    id: 'topic-1',
    title: '해외여행 영어',
    description: '일본 여행 전에 실전 회화 위주로 공부하면 좋을 것 같습니다.',
    referenceLink: 'https://youtube.com/watch?v=example1',
    referenceLabel: 'YouTube 링크',
    authorName: '지영',
    avatarColor: '#A594E8',
    likeCount: 12,
    createdAt: '6/14',
    createdAtISO: '2026-06-14T10:30:00',
    isAdopted: true,
    visibility: 'public',
  },
  {
    id: 'topic-2',
    title: '비즈니스 이메일 표현',
    description: '실무에서 자주 쓰는 formal expression 위주로 스터디하면 좋겠어요.',
    authorName: '민호',
    avatarColor: '#7EC8A8',
    likeCount: 9,
    createdAt: '6/13',
    createdAtISO: '2026-06-13T18:20:00',
    isAdopted: false,
    visibility: 'public',
  },
  {
    id: 'topic-3',
    title: 'Netflix로 영어 듣기',
    description: '좋아하는 드라마로 shadowing 연습하는 방법을 같이 공유해요!',
    referenceLink: 'https://youtube.com/watch?v=example2',
    referenceLabel: 'YouTube 링크',
    authorName: '수진',
    avatarColor: '#F5A962',
    likeCount: 7,
    createdAt: '6/12',
    createdAtISO: '2026-06-12T09:15:00',
    isAdopted: true,
    visibility: 'public',
  },
  {
    id: 'topic-4',
    title: 'TOEIC Part 5 단어 암기',
    description: '빈출 어휘 100개를 2주 안에 정복하는 챌린지 어떨까요?',
    authorName: '명수',
    avatarColor: '#B794F4',
    likeCount: 4,
    createdAt: '6/10',
    createdAtISO: '2026-06-10T08:00:00',
    isAdopted: false,
    visibility: 'public',
  },
  {
    id: 'topic-5',
    title: '일상 Small Talk',
    description: '날씨, 취미, 주말 계획 등 가벼운 주제로 회화 연습해봐요.',
    referenceLink: 'https://youtube.com/watch?v=example3',
    referenceLabel: 'YouTube 링크',
    authorName: '지수',
    avatarColor: '#9F7AEA',
    likeCount: 9,
    createdAt: '5/28',
    createdAtISO: '2026-05-28T14:45:00',
    isAdopted: true,
    visibility: 'public',
  },
  {
    id: 'topic-6',
    title: '영화 소개 영어 표현',
    description: '좋아하는 영화를 영어로 소개하는 연습보면 어떨까요?',
    authorName: '지영',
    avatarColor: '#A594E8',
    likeCount: 11,
    createdAt: '5/20',
    createdAtISO: '2026-05-20T16:30:00',
    isAdopted: false,
    visibility: 'public',
  },
  {
    id: 'topic-7',
    title: '카페 주문 영어',
    description: '해외 여행이나 외국인 친구와 카페에서 쓸 수 있는 표현을 모아봐요.',
    authorName: '민호',
    avatarColor: '#7EC8A8',
    likeCount: 6,
    createdAt: '4/18',
    createdAtISO: '2026-04-18T11:00:00',
    isAdopted: true,
    visibility: 'public',
  },
  {
    id: 'topic-8',
    title: '뉴스 헤드라인 읽기',
    description: '짧은 영어 뉴스 헤드라인으로 어휘와 독해력을 같이 키워봐요.',
    authorName: '수진',
    avatarColor: '#F5A962',
    likeCount: 5,
    createdAt: '4/12',
    createdAtISO: '2026-04-12T19:20:00',
    isAdopted: false,
    visibility: 'public',
  },
]

export const mockAdminMembers: AdminMemberItem[] = [
  {
    id: 'member-1',
    name: '지수',
    email: 'jisoo.kim@gmail.com',
    avatarColor: '#9F7AEA',
    joinedAt: '2024.11.02',
    lastLoginAt: '2026.06.15 08:10',
    lastSubmissionAt: '2026.06.14',
    streakDays: 20,
    monthlyStats: {
      '2026-06': { assignmentCount: 20, participatedCount: 19, submissionTargetCount: 20, submittedCount: 19 },
      '2026-05': { assignmentCount: 22, participatedCount: 21, submissionTargetCount: 22, submittedCount: 21 },
      '2026-04': { assignmentCount: 18, participatedCount: 17, submissionTargetCount: 18, submittedCount: 16 },
    },
    role: 'ROLE_ADMIN',
  },
  {
    id: 'member-2',
    name: '명수',
    email: 'myungsoo.park@gmail.com',
    avatarColor: '#B794F4',
    joinedAt: '2025.01.18',
    lastLoginAt: '2026.06.15 07:45',
    lastSubmissionAt: '2026.06.15',
    streakDays: 12,
    monthlyStats: {
      '2026-06': { assignmentCount: 20, participatedCount: 18, submissionTargetCount: 20, submittedCount: 18 },
      '2026-05': { assignmentCount: 22, participatedCount: 20, submissionTargetCount: 22, submittedCount: 19 },
      '2026-04': { assignmentCount: 18, participatedCount: 16, submissionTargetCount: 18, submittedCount: 15 },
    },
    role: 'ROLE_USER',
  },
  {
    id: 'member-3',
    name: '지영',
    email: 'jiyoung.lee@gmail.com',
    avatarColor: '#A594E8',
    joinedAt: '2025.02.05',
    lastLoginAt: '2026.06.14 22:30',
    lastSubmissionAt: '2026.06.14',
    streakDays: 10,
    monthlyStats: {
      '2026-06': { assignmentCount: 20, participatedCount: 18, submissionTargetCount: 20, submittedCount: 17 },
      '2026-05': { assignmentCount: 22, participatedCount: 19, submissionTargetCount: 22, submittedCount: 18 },
      '2026-04': { assignmentCount: 18, participatedCount: 15, submissionTargetCount: 18, submittedCount: 14 },
    },
    role: 'ROLE_USER',
  },
  {
    id: 'member-4',
    name: '민호',
    email: 'minho.choi@gmail.com',
    avatarColor: '#7EC8A8',
    joinedAt: '2025.03.22',
    lastLoginAt: '2026.05.28 19:15',
    lastSubmissionAt: '2026.05.27',
    streakDays: 8,
    monthlyStats: {
      '2026-06': { assignmentCount: 20, participatedCount: 17, submissionTargetCount: 20, submittedCount: 16 },
      '2026-05': { assignmentCount: 22, participatedCount: 18, submissionTargetCount: 22, submittedCount: 17 },
      '2026-04': { assignmentCount: 18, participatedCount: 14, submissionTargetCount: 18, submittedCount: 13 },
    },
    role: 'ROLE_USER',
  },
]

export const mockAdminStudySettings: AdminStudySettings = {
  name: 'Jude\'s English',
  description: '매일 영어 학습을 인증하고 함께 성장하는 스터디입니다.',
  joinCode: 'YOUNGS2025',
  imageTheme: 'lavender',
}
