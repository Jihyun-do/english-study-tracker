export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN'

export interface AuthUser {
  id: string
  name: string
  role: UserRole
}

export interface GoogleSession {
  email: string
  displayName: string
}

export interface StoredAuth {
  user: AuthUser
}

export type GoogleLoginResult =
  | { type: 'returning'; user: AuthUser }
  | { type: 'onboarding'; session: GoogleSession }

const STORAGE_KEY = 'jude_auth'

export function loadStoredAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredAuth
    return parsed.user ?? null
  } catch {
    return null
  }
}

export function saveStoredAuth(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }))
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY)
}

export function resolveRoleFromInviteCode(code: string): UserRole {
  const normalized = code.trim().toUpperCase()
  return normalized === 'JUDE-ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER'
}
