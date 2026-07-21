const ACCESS_TOKEN_KEY = 'english_study_access_token'
const REFRESH_TOKEN_KEY = 'english_study_refresh_token'

export interface StoredTokens {
  accessToken: string
  refreshToken: string
}

export function saveTokens(tokens: StoredTokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function loadAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function loadRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function hasStoredTokens(): boolean {
  return Boolean(loadAccessToken())
}
