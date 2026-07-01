import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AuthUser,
  GoogleLoginResult,
  GoogleSession,
} from './types'
import {
  clearStoredAuth,
  loadStoredAuth,
  resolveRoleFromInviteCode,
  saveStoredAuth,
} from './types'

interface OnboardingDraft {
  inviteCode: string
  nickname: string
}

interface AuthContextValue {
  user: AuthUser | null
  googleSession: GoogleSession | null
  onboardingDraft: OnboardingDraft
  isAuthenticated: boolean
  loginWithGoogle: () => GoogleLoginResult
  setInviteCode: (code: string) => void
  setNickname: (nickname: string) => void
  completeOnboarding: () => AuthUser
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const MOCK_GOOGLE_SESSION: GoogleSession = {
  email: 'member@gmail.com',
  displayName: 'Google 사용자',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredAuth())
  const [googleSession, setGoogleSession] = useState<GoogleSession | null>(null)
  const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft>({
    inviteCode: '',
    nickname: '',
  })

  const loginWithGoogle = useCallback((): GoogleLoginResult => {
    const storedUser = loadStoredAuth()

    if (storedUser) {
      setUser(storedUser)
      setGoogleSession(null)
      return { type: 'returning', user: storedUser }
    }

    setGoogleSession(MOCK_GOOGLE_SESSION)
    setOnboardingDraft({ inviteCode: '', nickname: '' })
    return { type: 'onboarding', session: MOCK_GOOGLE_SESSION }
  }, [])

  const setInviteCode = useCallback((inviteCode: string) => {
    setOnboardingDraft((prev) => ({ ...prev, inviteCode }))
  }, [])

  const setNickname = useCallback((nickname: string) => {
    setOnboardingDraft((prev) => ({ ...prev, nickname }))
  }, [])

  const completeOnboarding = useCallback((): AuthUser => {
    const role = resolveRoleFromInviteCode(onboardingDraft.inviteCode)
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: onboardingDraft.nickname.trim(),
      role,
    }

    saveStoredAuth(newUser)
    setUser(newUser)
    setGoogleSession(null)
    return newUser
  }, [onboardingDraft])

  const logout = useCallback(() => {
    clearStoredAuth()
    setUser(null)
    setGoogleSession(null)
    setOnboardingDraft({ inviteCode: '', nickname: '' })
  }, [])

  const value = useMemo(
    () => ({
      user,
      googleSession,
      onboardingDraft,
      isAuthenticated: user !== null,
      loginWithGoogle,
      setInviteCode,
      setNickname,
      completeOnboarding,
      logout,
    }),
    [
      user,
      googleSession,
      onboardingDraft,
      loginWithGoogle,
      setInviteCode,
      setNickname,
      completeOnboarding,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function getPostLoginPath(role: AuthUser['role']) {
  return role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/'
}
