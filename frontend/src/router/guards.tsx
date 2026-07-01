import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, getPostLoginPath } from '../auth/AuthContext'

export function GuestGuard() {
  const { isAuthenticated, user, googleSession } = useAuth()

  if (isAuthenticated && user) {
    return <Navigate to={getPostLoginPath(user.role)} replace />
  }

  if (googleSession) {
    return <Navigate to="/onboarding/invite-code" replace />
  }

  return <Outlet />
}

export function OnboardingGuard() {
  const { isAuthenticated, user, googleSession } = useAuth()

  if (isAuthenticated && user) {
    return <Navigate to={getPostLoginPath(user.role)} replace />
  }

  if (!googleSession) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function AuthGuard() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function AdminGuard() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
