import { mockFeedPosts } from './mockFeedData'

export interface RecentCertification {
  id: string
  userName: string
  avatarColor: string
  memo: string
  likeCount: number
  submittedAt: string
  imageTheme: 'lavender' | 'mint' | 'peach' | 'sky'
}

export interface PopularTopicItem {
  rank: number
  topicId: string
  title: string
  likeCount: number
}

export const mockRecentCertifications: RecentCertification[] = mockFeedPosts
  .slice(0, 4)
  .map((post) => ({
    id: post.id,
    userName: post.userName,
    avatarColor: post.avatarColor,
    memo: post.memo,
    likeCount: post.likeCount,
    submittedAt: post.submittedAt,
    imageTheme: post.imageTheme,
  }))

export const mockPopularTopics: PopularTopicItem[] = [
  { rank: 1, topicId: 'topic-1', title: '해외여행 영어', likeCount: 8 },
  { rank: 2, topicId: 'topic-3', title: 'Netflix로 영어 듣기', likeCount: 6 },
  { rank: 3, topicId: 'topic-4', title: 'TOEIC Part 5 단어 암기', likeCount: 4 },
]

export function truncateMemo(memo: string, maxLength = 36): string {
  if (memo.length <= maxLength) return memo
  return `${memo.slice(0, maxLength)}…`
}
