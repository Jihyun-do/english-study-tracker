import { Navigate } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { AdminAssignmentsProvider } from '../contexts/AdminAssignmentsContext'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminAssignmentListPage } from '../pages/admin/AdminAssignmentListPage'
import { AdminAssignmentCreatePage } from '../pages/admin/AdminAssignmentCreatePage'
import { AdminAssignmentEditPage } from '../pages/admin/AdminAssignmentEditPage'
import { AdminSubmissionPage } from '../pages/admin/AdminSubmissionPage'
import { AdminFeedManagePage } from '../pages/admin/AdminFeedManagePage'
import { AdminTopicManagePage } from '../pages/admin/AdminTopicManagePage'
import { AdminMembersPage } from '../pages/admin/AdminMembersPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { AdminContentPage } from '../pages/admin/AdminContentPage'
import { AdminNoticeCreatePage } from '../pages/admin/AdminNoticeCreatePage'
import { AdminNoticeEditPage } from '../pages/admin/AdminNoticeEditPage'
import { AdminPollCreatePage } from '../pages/admin/AdminPollCreatePage'
import { AdminPollEditPage } from '../pages/admin/AdminPollEditPage'

export const adminRouteConfig = {
  path: '/admin',
  element: (
    <AdminAssignmentsProvider>
      <AdminLayout />
    </AdminAssignmentsProvider>
  ),
  children: [
    { index: true, element: <Navigate to="/admin/dashboard" replace /> },
    { path: 'dashboard', element: <AdminDashboardPage /> },
    { path: 'content', element: <AdminContentPage /> },
    { path: 'content/notices/new', element: <AdminNoticeCreatePage /> },
    { path: 'content/notices/:id/edit', element: <AdminNoticeEditPage /> },
    { path: 'content/polls/new', element: <AdminPollCreatePage /> },
    { path: 'content/polls/:id/edit', element: <AdminPollEditPage /> },
    { path: 'assignment', element: <Navigate to="/admin/assignments" replace /> },
    { path: 'assignments', element: <AdminAssignmentListPage /> },
    { path: 'assignments/new', element: <AdminAssignmentCreatePage /> },
    { path: 'assignments/:id/edit', element: <AdminAssignmentEditPage /> },
    { path: 'submission', element: <AdminSubmissionPage /> },
    { path: 'feed', element: <AdminFeedManagePage /> },
    { path: 'topics', element: <AdminTopicManagePage /> },
    { path: 'members', element: <AdminMembersPage /> },
    { path: 'settings', element: <AdminSettingsPage /> },
  ],
}
