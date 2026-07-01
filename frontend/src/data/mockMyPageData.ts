export interface DayFeedback {
  id: string
  authorName: string
  avatarColor: string
  role: 'leader' | 'member'
  content: string
  createdAt: string
  createdAtISO: string
  hasVoiceFeedback?: boolean
  voiceDuration?: string
}

export interface DayRecord {
  isSubmitted: boolean
  submissionId?: string
  assignmentId?: string
  /** Assignment.due_at — ISO 8601 */
  dueAt?: string
  submittedAt?: string
  submittedTime?: string
  assignmentTitle?: string
  memo?: string
  submissionImageTheme?: 'lavender' | 'mint' | 'peach' | 'sky'
  submissionAudioFileName?: string
  submissionAudioDuration?: string
  likesReceived?: number
  feedbackCount?: number
  feedbackLastReadAt?: string | null
  feedbacks?: DayFeedback[]
}

export interface MyPageData {
  streakDays: number
  monthlyParticipationRate: number
  totalSubmissions: number
  year: number
  month: number
  completedDates: number[]
  assignmentDates: number[]
  today: number
  dailyRecords: Record<number, DayRecord>
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function getWeekdayLabel(year: number, month: number, day: number): string {
  return WEEKDAYS[new Date(year, month - 1, day).getDay()]
}

export function getDayRecord(
  dailyRecords: Record<number, DayRecord>,
  day: number,
): DayRecord | null {
  return dailyRecords[day] ?? null
}

export function hasAssignmentOnDate(assignmentDates: number[], day: number): boolean {
  return assignmentDates.includes(day)
}

export function hasUnreadFeedback(
  feedbacks: DayFeedback[] | undefined,
  feedbackLastReadAt: string | null | undefined,
): boolean {
  if (!feedbacks?.length) return false
  if (!feedbackLastReadAt) return true

  const lastReadTime = new Date(feedbackLastReadAt).getTime()
  return feedbacks.some((feedback) => new Date(feedback.createdAtISO).getTime() > lastReadTime)
}

const COMPLETED_DATES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
const ASSIGNMENT_DATES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

const DETAILED_RECORDS: Record<number, DayRecord> = {
  14: {
    isSubmitted: true,
    submissionId: 'submission-14',
    assignmentId: 'material-3',
    dueAt: '2025-06-14T23:59:59',
    submittedAt: '2025-06-14T20:12:00',
    submittedTime: '20:12',
    assignmentTitle: 'Business Email Writing',
    memo: 'Business email 표현 위주로 정리했습니다.',
    submissionImageTheme: 'mint',
    submissionAudioFileName: 'shadowing-practice.mp3',
    submissionAudioDuration: '1:05',
    likesReceived: 4,
    feedbackCount: 2,
    feedbackLastReadAt: null,
    feedbacks: [
      {
        id: 'fb-14-1',
        authorName: '지수',
        avatarColor: '#9F7AEA',
        role: 'leader',
        content: '이메일 closing phrase 정리가 좋아요. formal tone도 잘 맞습니다.',
        createdAt: '6/14 오후 9:30',
        createdAtISO: '2025-06-14T21:30:00',
      },
      {
        id: 'fb-14-2',
        authorName: '지수',
        avatarColor: '#9F7AEA',
        role: 'leader',
        content: '다음엔 subject line 표현도 같이 연습보면 좋겠어요.',
        createdAt: '6/14 오후 9:45',
        createdAtISO: '2025-06-14T21:45:00',
        hasVoiceFeedback: true,
        voiceDuration: '0:18',
      },
    ],
  },
  15: {
    isSubmitted: true,
    submissionId: 'submission-15',
    assignmentId: 'material-2',
    dueAt: '2025-06-15T23:59:59',
    submittedAt: '2025-06-15T21:08:00',
    submittedTime: '21:08',
    assignmentTitle: 'Travel Expressions',
    memo: 'Shadowing 3번 반복했습니다.',
    submissionImageTheme: 'peach',
    submissionAudioFileName: 'shadowing-practice.mp3',
    submissionAudioDuration: '0:52',
    likesReceived: 6,
    feedbackCount: 3,
    feedbackLastReadAt: '2025-06-15T23:00:00',
    feedbacks: [
      {
        id: 'fb-15-1',
        authorName: '지수',
        avatarColor: '#9F7AEA',
        role: 'leader',
        content: 'Shadowing 톤이 안정적이에요. 발음도 점점 좋아지고 있어요!',
        createdAt: '6/15 오후 10:00',
        createdAtISO: '2025-06-15T22:00:00',
        hasVoiceFeedback: true,
        voiceDuration: '0:25',
      },
      {
        id: 'fb-15-2',
        authorName: '지수',
        avatarColor: '#9F7AEA',
        role: 'leader',
        content: '공항 표현 파트는 다음 주 복습 퀴즈에 넣어볼게요.',
        createdAt: '6/15 오후 10:20',
        createdAtISO: '2025-06-15T22:20:00',
      },
      {
        id: 'fb-15-3',
        authorName: '하은',
        avatarColor: '#F687B3',
        role: 'member',
        content: '저도 같은 과제 했는데 표현 정리 방식 참고할게요!',
        createdAt: '6/15 오후 11:00',
        createdAtISO: '2025-06-15T23:00:00',
      },
    ],
  },
  16: {
    isSubmitted: true,
    submissionId: 'submission-16',
    assignmentId: 'material-1',
    dueAt: '2025-06-17T09:00:00',
    submittedAt: '2025-06-16T21:35:00',
    submittedTime: '21:35',
    assignmentTitle: '영화 소개 영어 표현 익히기',
    memo: 'Travel expressions 위주로 정리했습니다.',
    submissionImageTheme: 'lavender',
    submissionAudioFileName: 'shadowing-practice.mp3',
    submissionAudioDuration: '0:42',
    likesReceived: 5,
    feedbackCount: 2,
    feedbackLastReadAt: '2025-06-16T21:00:00',
    feedbacks: [
      {
        id: 'fb-16-1',
        authorName: '지수',
        avatarColor: '#9F7AEA',
        role: 'leader',
        content: 'Travel expressions 정리 깔끔해요. shadowing 톤도 좋습니다!',
        createdAt: '6/16 오후 9:50',
        createdAtISO: '2025-06-16T21:50:00',
        hasVoiceFeedback: true,
        voiceDuration: '0:22',
      },
      {
        id: 'fb-16-2',
        authorName: '지수',
        avatarColor: '#9F7AEA',
        role: 'leader',
        content: '다음 과제에서도 plot summary 표현을 써보세요.',
        createdAt: '6/16 오후 10:05',
        createdAtISO: '2025-06-16T22:05:00',
      },
    ],
  },
}

function buildDailyRecords(): Record<number, DayRecord> {
  const records: Record<number, DayRecord> = { ...DETAILED_RECORDS }

  for (const day of COMPLETED_DATES) {
    if (!records[day]) {
      records[day] = {
        isSubmitted: true,
        submissionId: `submission-${day}`,
        assignmentId: `material-${17 - day}`,
        dueAt: `2025-06-${String(day).padStart(2, '0')}T23:59:59`,
        submittedAt: `2025-06-${String(day).padStart(2, '0')}T21:00:00`,
        submittedTime: '21:00',
        assignmentTitle: `6/${day} 영어 학습 과제`,
        memo: '오늘 과제 인증 완료!',
        submissionImageTheme: 'sky',
        submissionAudioFileName: 'shadowing-practice.mp3',
        submissionAudioDuration: '0:58',
        likesReceived: 3,
        feedbackCount: 1,
        feedbackLastReadAt: '2025-06-01T12:00:00',
        feedbacks: [
          {
            id: `fb-${day}-1`,
            authorName: '지수',
            avatarColor: '#9F7AEA',
            role: 'leader',
            content: '꾸준한 학습 인증 좋아요! 내용 정리도 깔끔합니다.',
            createdAt: `6/${day} 오후 9:30`,
            createdAtISO: `2025-06-${String(day).padStart(2, '0')}T21:30:00`,
          },
        ],
      }
    }
  }

  return records
}

export const mockMyPageData: MyPageData = {
  streakDays: 12,
  monthlyParticipationRate: 92,
  totalSubmissions: 34,
  year: 2025,
  month: 6,
  completedDates: COMPLETED_DATES,
  assignmentDates: ASSIGNMENT_DATES,
  today: 16,
  dailyRecords: buildDailyRecords(),
}
