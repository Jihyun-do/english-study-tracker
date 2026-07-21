export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN'

export type AuthStatus = 'REGISTERED' | 'ONBOARDING'

export interface AuthUser {
  id: string
  name: string
  role: UserRole
  email?: string
  profileImage?: string | null
  studyId?: number
}

export interface GoogleSession {
  email: string
  displayName: string
}

export interface MeResponse {
  status: AuthStatus
  userId: number
  email: string
  nickname: string
  profileImage: string | null
  studyId: number | null
  role: string | null
}

export interface OnboardingRequest {
  inviteCode: string
  nickname: string
}

export function resolveRoleFromInviteCode(code: string): UserRole {
  const normalized = code.trim().toUpperCase()
  return normalized === 'JUDE-ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER'
}
