import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthGuard, AdminGuard, GuestGuard, OnboardingGuard } from './guards'
import { createUserRoutes } from './userRoutes'
import { adminRouteConfig } from './adminRoutes'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingInvitePage } from '../pages/onboarding/OnboardingInvitePage'
import { OnboardingNicknamePage } from '../pages/onboarding/OnboardingNicknamePage'
import { OnboardingCompletePage } from '../pages/onboarding/OnboardingCompletePage'

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <OnboardingGuard />,
    children: [
      { path: '/onboarding/invite-code', element: <OnboardingInvitePage /> },
      { path: '/onboarding/nickname', element: <OnboardingNicknamePage /> },
      { path: '/onboarding/complete', element: <OnboardingCompletePage /> },
    ],
  },
  {
    element: <AuthGuard />,
    children: createUserRoutes(),
  },
  {
    element: <AdminGuard />,
    children: [adminRouteConfig],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])
