import { UserLayout } from '../layouts/UserLayout'

export const USER_PATHS = ['/', '/feed', '/topics', '/library', '/mypage', '/settings', '/polls'] as const

const USER_CHILD_PATHS = [
  { index: true as const },
  { path: 'feed' },
  { path: 'topics' },
  { path: 'library' },
  { path: 'mypage' },
  { path: 'settings' },
  { path: 'polls' },
]

export function createUserRoutes() {
  return [
    {
      element: <UserLayout />,
      children: USER_CHILD_PATHS,
    },
  ]
}
