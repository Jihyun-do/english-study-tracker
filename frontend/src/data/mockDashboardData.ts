/** Dashboard mock 기준 시점 — 과제·투표 mock 데이터와 정합 */
export const DASHBOARD_REFERENCE_NOW = new Date('2026-06-23T12:00:00')

export type DashboardActivityType =
  | 'submission'
  | 'topic'
  | 'comment'
  | 'notice'
  | 'poll'

export interface DashboardActivity {
  id: string
  message: string
  createdAt: string
  type: DashboardActivityType
}

export interface DashboardAssignmentProgress {
  submitted: number
  total: number
}

export interface DashboardTodoCounts {
  newComments: number
  feedbackPending: number
  endingTodayPolls: number
}

/** UI mock — 추후 API 연동 */
export const mockDashboardTodoCounts: DashboardTodoCounts = {
  newComments: 3,
  feedbackPending: 2,
  endingTodayPolls: 0,
}

/** UI mock — 추후 API 연동 */
export const mockDashboardTodaySubmissionCount = 6

export const mockDashboardAssignmentProgress: Record<string, DashboardAssignmentProgress> = {
  'assignment-1': { submitted: 8, total: 10 },
  'assignment-2': { submitted: 5, total: 10 },
}

export const mockDashboardActivities: DashboardActivity[] = [
  {
    id: 'activity-1',
    message: '명수가 과제를 제출했습니다.',
    createdAt: '10분 전',
    type: 'submission',
  },
  {
    id: 'activity-2',
    message: '지영이 주제를 제안했습니다.',
    createdAt: '1시간 전',
    type: 'topic',
  },
  {
    id: 'activity-3',
    message: '새로운 댓글이 등록되었습니다.',
    createdAt: '2시간 전',
    type: 'comment',
  },
  {
    id: 'activity-4',
    message: '공지가 등록되었습니다.',
    createdAt: '어제',
    type: 'notice',
  },
  {
    id: 'activity-5',
    message: '투표가 시작되었습니다.',
    createdAt: '어제',
    type: 'poll',
  },
]
