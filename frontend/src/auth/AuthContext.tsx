import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { completeOnboarding as completeOnboardingApi, fetchMe } from './api'
import { mapMeToAuthUser, meToGoogleSession } from './authUtils'
import { OAUTH_LOGIN_URL } from './config'
import type { AuthUser, GoogleSession } from './types'
import { clearTokens, hasStoredTokens, saveTokens } from './tokenStorage'

interface OnboardingDraft {
  inviteCode: string
  nickname: string
}

export type OAuthCallbackResult =
  | { type: 'success'; user: AuthUser }
  | { type: 'onboarding' }
  | { type: 'error' }

interface AuthContextValue {
  user: AuthUser | null
  googleSession: GoogleSession | null
  onboardingDraft: OnboardingDraft
  isAuthenticated: boolean
  needsOnboarding: boolean
  isAuthReady: boolean
  loginWithGoogle: () => void
  processOAuthCallback: (params: URLSearchParams) => Promise<OAuthCallbackResult>
  setInviteCode: (code: string) => void
  setNickname: (nickname: string) => void
  completeOnboarding: () => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [googleSession, setGoogleSession] = useState<GoogleSession | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft>({
    inviteCode: '',
    nickname: '',
  })

  const applyMeResponse = useCallback((me: Awaited<ReturnType<typeof fetchMe>>) => {
    if (me.status === 'ONBOARDING') {
      const session = meToGoogleSession(me)
      setUser(null)
      setGoogleSession(session)
      setOnboardingDraft((prev) => ({
        inviteCode: prev.inviteCode,
        nickname: prev.nickname || session.displayName,
      }))
      return null
    }

    const authUser = mapMeToAuthUser(me)
    setUser(authUser)
    setGoogleSession(null)
    return authUser
  }, [])

  const restoreSession = useCallback(async () => {
    if (!hasStoredTokens()) {
      setUser(null)
      setGoogleSession(null)
      return null
    }

    try {
      const me = await fetchMe()
      return applyMeResponse(me)
    } catch {
      clearTokens()
      setUser(null)
      setGoogleSession(null)
      return null
    }
  }, [applyMeResponse])

  useEffect(() => {
    void (async () => {
      await restoreSession()
      setIsAuthReady(true)
    })()
  }, [restoreSession])

  const loginWithGoogle = useCallback(() => {
    window.location.href = OAUTH_LOGIN_URL
  }, [])

  const processOAuthCallback = useCallback(
    async (params: URLSearchParams): Promise<OAuthCallbackResult> => {
      const accessToken = params.get('accessToken')
      const refreshToken = params.get('refreshToken')
      const status = params.get('status')
      const email = params.get('email')
      const nickname = params.get('nickname')
      const error = params.get('error')

      if (error) {
        clearTokens()
        setUser(null)
        setGoogleSession(null)
        return { type: 'error' }
      }

      if (accessToken && refreshToken) {
        saveTokens({ accessToken, refreshToken })

        if (status === 'onboarding') {
          setUser(null)
          const session: GoogleSession = {
            email: email ?? '',
            displayName: nickname ?? email ?? '',
          }
          setGoogleSession(session)
          setOnboardingDraft({ inviteCode: '', nickname: session.displayName })
          return { type: 'onboarding' }
        }

        const authUser = await restoreSession()
        if (!authUser) {
          clearTokens()
          return { type: 'error' }
        }

        return { type: 'success', user: authUser }
      }

      return { type: 'error' }
    },
    [restoreSession],
  )

  const setInviteCode = useCallback((inviteCode: string) => {
    setOnboardingDraft((prev) => ({ ...prev, inviteCode }))
  }, [])

  const setNickname = useCallback((nickname: string) => {
    setOnboardingDraft((prev) => ({ ...prev, nickname }))
  }, [])

  const completeOnboarding = useCallback(async (): Promise<AuthUser> => {
    const me = await completeOnboardingApi({
      inviteCode: onboardingDraft.inviteCode,
      nickname: onboardingDraft.nickname.trim(),
    })

    const authUser = applyMeResponse(me)
    if (!authUser) {
      throw new Error('Onboarding completion failed')
    }

    setOnboardingDraft({ inviteCode: '', nickname: '' })
    return authUser
  }, [applyMeResponse, onboardingDraft])

  const logout = useCallback(() => {
    clearTokens()
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
      needsOnboarding: googleSession !== null,
      isAuthReady,
      loginWithGoogle,
      processOAuthCallback,
      setInviteCode,
      setNickname,
      completeOnboarding,
      logout,
    }),
    [
      user,
      googleSession,
      onboardingDraft,
      isAuthReady,
      loginWithGoogle,
      processOAuthCallback,
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
