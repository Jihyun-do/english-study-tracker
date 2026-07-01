import type { TabId } from '../components/layout/BottomNav'

export const POLLS_ROUTE = '/polls'

export const USER_ROUTES: Record<TabId, string> = {
  home: '/',
  feed: '/feed',
  topics: '/topics',
  library: '/library',
  mypage: '/mypage',
}

export const SETTINGS_ROUTE = '/settings'

export const ROUTE_TO_TAB: Record<string, TabId> = {
  '/': 'home',
  '/feed': 'feed',
  '/topics': 'topics',
  '/library': 'library',
  '/mypage': 'mypage',
  '/settings': 'mypage',
  '/polls': 'home',
}

export const ADMIN_ROUTES = {
  dashboard: '/admin/dashboard',
  assignments: '/admin/assignments',
  assignmentNew: '/admin/assignments/new',
  assignmentEdit: (id: string) => `/admin/assignments/${id}/edit`,
  /** @deprecated use assignments */
  assignment: '/admin/assignments',
  submission: '/admin/submission',
  feed: '/admin/feed',
  topics: '/admin/topics',
  members: '/admin/members',
  settings: '/admin/settings',
  content: '/admin/content',
  contentNoticeNew: '/admin/content/notices/new',
  contentNoticeEdit: (id: string) => `/admin/content/notices/${id}/edit`,
  contentPollNew: '/admin/content/polls/new',
  contentPollEdit: (id: string) => `/admin/content/polls/${id}/edit`,
} as const
