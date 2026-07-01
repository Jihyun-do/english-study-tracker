export type TopicSort = 'popular' | 'latest'

export interface TopicSuggestion {
  id: string
  title: string
  description: string
  referenceLink?: string
  referenceLabel?: string
  likeCount: number
  isLiked: boolean
  authorName: string
  isAnonymous: boolean
  isAdopted: boolean
  createdAt: string
}

export const mockTopicSuggestions: TopicSuggestion[] = [
  {
    id: 'topic-1',
    title: '해외여행 영어',
    description: '일본 여행 전에 실전 회화 위주로 공부하면 좋을 것 같습니다.',
    referenceLink: 'https://youtube.com/watch?v=example1',
    referenceLabel: 'YouTube 링크',
    likeCount: 8,
    isLiked: false,
    authorName: '민수',
    isAnonymous: false,
    isAdopted: true,
    createdAt: '2025-06-14T10:30:00',
  },
  {
    id: 'topic-2',
    title: '비즈니스 이메일 작성',
    description: '실무에서 자주 쓰는 formal expression 위주로 스터디하면 좋겠어요.',
    likeCount: 12,
    isLiked: true,
    authorName: '지영',
    isAnonymous: true,
    isAdopted: false,
    createdAt: '2025-06-13T18:20:00',
  },
  {
    id: 'topic-3',
    title: 'Netflix로 영어 듣기',
    description: '좋아하는 드라마로 shadowing 연습하는 방법을 같이 공유해요!',
    referenceLink: 'https://youtube.com/watch?v=example2',
    referenceLabel: 'YouTube 링크',
    likeCount: 6,
    isLiked: false,
    authorName: '현우',
    isAnonymous: false,
    isAdopted: false,
    createdAt: '2025-06-15T09:15:00',
  },
  {
    id: 'topic-4',
    title: 'TOEIC Part 5 단어 암기',
    description: '빈출 어휘 100개를 2주 안에 정복하는 챌린지 어떨까요?',
    likeCount: 4,
    isLiked: false,
    authorName: '수진',
    isAnonymous: true,
    isAdopted: false,
    createdAt: '2025-06-16T08:00:00',
  },
  {
    id: 'topic-5',
    title: '일상 Small Talk',
    description: '날씨, 취미, 주말 계획 등 가벼운 주제로 회화 연습해봐요.',
    referenceLink: 'https://youtube.com/watch?v=example3',
    referenceLabel: 'YouTube 링크',
    likeCount: 9,
    isLiked: false,
    authorName: '민호',
    isAnonymous: false,
    isAdopted: false,
    createdAt: '2025-06-12T14:45:00',
  },
]

export function getTopicById(id: string): TopicSuggestion | undefined {
  return mockTopicSuggestions.find((topic) => topic.id === id)
}

export function sortTopics(topics: TopicSuggestion[], sort: TopicSort): TopicSuggestion[] {
  const sorted = [...topics]
  if (sort === 'popular') {
    return sorted.sort((a, b) => b.likeCount - a.likeCount)
  }
  return sorted.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function formatTopicDate(isoDate: string): string {
  const date = new Date(isoDate)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const period = hours < 12 ? '오전' : '오후'
  const displayHours = hours % 12 || 12
  return `${month}/${day} ${period} ${displayHours}:${minutes}`
}

export function getTopicDisplayAuthor(topic: TopicSuggestion): string {
  if (topic.isAnonymous) return '익명'
  return topic.authorName
}

/** 관리자 화면 전용 — 일반 사용자 UI에서는 사용하지 않음 */
export function getTopicRealAuthor(topic: TopicSuggestion): string {
  return topic.authorName
}

export function getTopicMonthLabel(date = new Date()): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 주제 제안`
}

export interface VoteDeadlineInfo {
  formattedDate: string
  daysLeft: number
}

export function getVoteDeadlineInfo(now = new Date()): VoteDeadlineInfo {
  const year = now.getFullYear()
  const month = now.getMonth()
  const lastDay = new Date(year, month + 1, 0)

  const formattedDate = [
    year,
    String(month + 1).padStart(2, '0'),
    String(lastDay.getDate()).padStart(2, '0'),
  ].join('.')

  const endOfDay = new Date(year, month + 1, 0, 23, 59, 59, 999)
  const msLeft = endOfDay.getTime() - now.getTime()
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))

  return { formattedDate, daysLeft }
}
