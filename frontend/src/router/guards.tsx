import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, getPostLoginPath } from '../auth/AuthContext'

export function GuestGuard() {
  const { isAuthenticated, user, needsOnboarding, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return null
  }

  if (isAuthenticated && user) {
    return <Navigate to={getPostLoginPath(user.role)} replace />
  }

  if (needsOnboarding) {
    return <Navigate to="/onboarding/invite-code" replace />
  }

  return <Outlet />
}

export function OnboardingGuard() {
  const { isAuthenticated, user, needsOnboarding, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return null
  }

  if (isAuthenticated && user) {
    return <Navigate to={getPostLoginPath(user.role)} replace />
  }

  if (!needsOnboarding) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function AuthGuard() {
  const { isAuthenticated, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function AdminGuard() {
  const { isAuthenticated, user, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
