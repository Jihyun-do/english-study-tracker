import type { AuthUser, MeResponse, UserRole } from './types'

export function mapBackendRole(role: string | null | undefined): UserRole {
  if (!role) {
    return 'ROLE_USER'
  }

  const normalized = role.toUpperCase()
  return normalized === 'ADMIN' || normalized === 'OWNER' ? 'ROLE_ADMIN' : 'ROLE_USER'
}

export function mapMeToAuthUser(me: MeResponse): AuthUser | null {
  if (me.status === 'ONBOARDING') {
    return null
  }

  return {
    id: String(me.userId),
    name: me.nickname,
    role: mapBackendRole(me.role),
    email: me.email,
    profileImage: me.profileImage,
    studyId: me.studyId ?? undefined,
  }
}

export function meToGoogleSession(me: MeResponse): { email: string; displayName: string } {
  return {
    email: me.email,
    displayName: me.nickname,
  }
}
