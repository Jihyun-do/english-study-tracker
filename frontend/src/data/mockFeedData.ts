import type { CommentAuthorRole } from '../types/comment'

export interface FeedPost {
  id: string
  userName: string
  avatarColor: string
  submittedAt: string
  memo: string
  imageTheme: 'lavender' | 'mint' | 'peach' | 'sky'
  hasAudio: boolean
  audioDuration?: string
  likeCount: number
  commentCount: number
  isLiked: boolean
}


export interface FeedComment {
  id: string
  postId: string
  authorName: string
  avatarColor: string
  role: CommentAuthorRole
  content: string
  createdAt: string
  hasVoiceFeedback?: boolean
  voiceDuration?: string
}

export interface CurrentUser {
  name: string
  avatarColor: string
  role: CommentAuthorRole
}

export const mockCurrentUser: CurrentUser = {
  name: '명수',
  avatarColor: '#B794F4',
  role: 'leader',
}

export const mockFeedPosts: FeedPost[] = [
  {
    id: 'post-1',
    userName: '지영',
    avatarColor: '#A594E8',
    submittedAt: '2시간 전',
    memo: '오늘은 travel expressions 위주로 정리했어요! 공항에서 쓸 표현들이 특히 유용했습니다 ✈️',
    imageTheme: 'lavender',
    hasAudio: true,
    audioDuration: '0:42',
    likeCount: 5,
    commentCount: 2,
    isLiked: false,
  },
  {
    id: 'post-2',
    userName: '민호',
    avatarColor: '#7EC8A8',
    submittedAt: '5시간 전',
    memo: 'Shadowing 3번 반복했습니다. 발음 교정이 필요한 부분 메모해뒀어요.',
    imageTheme: 'mint',
    hasAudio: true,
    audioDuration: '1:15',
    likeCount: 3,
    commentCount: 1,
    isLiked: true,
  },
  {
    id: 'post-3',
    userName: '수진',
    avatarColor: '#F5A962',
    submittedAt: '6/15 오후 9:12',
    memo: '오늘 과제 단어장 인증! 내일 복습 예정입니다 📒',
    imageTheme: 'peach',
    hasAudio: false,
    likeCount: 8,
    commentCount: 3,
    isLiked: false,
  },
  {
    id: 'post-4',
    userName: '현우',
    avatarColor: '#6BAED6',
    submittedAt: '6/15 오후 7:30',
    memo: 'Listening part 2 정리. 들은 내용 요약해서 적어봤어요.',
    imageTheme: 'sky',
    hasAudio: true,
    audioDuration: '0:58',
    likeCount: 2,
    commentCount: 0,
    isLiked: false,
  },
]

export const mockFeedComments: FeedComment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    authorName: '하은',
    avatarColor: '#F687B3',
    role: 'member',
    content: '공항 표현 정리 너무 도움됐어요! 저도 따라 적어볼게요.',
    createdAt: '1시간 전',
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    authorName: '지수',
    avatarColor: '#9F7AEA',
    role: 'leader',
    content: 'Travel expressions 정리 깔끔해요. 다음엔 실제 대화 연습도 해봐요!',
    createdAt: '30분 전',
    hasVoiceFeedback: true,
    voiceDuration: '0:28',
  },
  {
    id: 'comment-3',
    postId: 'post-2',
    authorName: '서연',
    avatarColor: '#63B3ED',
    role: 'member',
    content: 'Shadowing 꾸준히 하니까 확실히 느는 것 같아요 👏',
    createdAt: '3시간 전',
  },
  {
    id: 'comment-4',
    postId: 'post-3',
    authorName: '민호',
    avatarColor: '#7EC8A8',
    role: 'member',
    content: '단어장 인증 인상적이에요! 복습 후기도 공유해주세요.',
    createdAt: '6/15 오후 10:00',
  },
  {
    id: 'comment-5',
    postId: 'post-3',
    authorName: '지수',
    avatarColor: '#9F7AEA',
    role: 'leader',
    content: '꾸준한 복습 습관 아주 좋습니다. 내일 퀴즈도 준비해볼까요?',
    createdAt: '6/15 오후 10:30',
    hasVoiceFeedback: true,
    voiceDuration: '0:35',
  },
  {
    id: 'comment-6',
    postId: 'post-3',
    authorName: '현우',
    avatarColor: '#6BAED6',
    role: 'member',
    content: '저도 내일 같이 복습해요!',
    createdAt: '6/15 오후 11:00',
  },
]

export function getFeedPostById(postId: string): FeedPost | undefined {
  return mockFeedPosts.find((post) => post.id === postId)
}

export function getCommentsByPostId(postId: string): FeedComment[] {
  return mockFeedComments.filter((comment) => comment.postId === postId)
}

export function truncateFeedMemo(memo: string, maxLength = 40): string {
  if (memo.length <= maxLength) return memo
  return `${memo.slice(0, maxLength)}…`
}
