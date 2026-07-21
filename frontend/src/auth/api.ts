import { API_BASE_URL } from './config'
import { loadAccessToken } from './tokenStorage'
import type { MeResponse, OnboardingRequest } from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'AuthApiError'
  }
}

async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = loadAccessToken()
  if (!accessToken) {
    throw new AuthApiError('Access token is missing', 401)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new AuthApiError(`Auth API request failed: ${path}`, response.status)
  }

  const body = (await response.json()) as ApiResponse<T>
  return body.data
}

export async function fetchMe(): Promise<MeResponse> {
  return authFetch<MeResponse>('/api/auth/me')
}

export async function completeOnboarding(
  request: OnboardingRequest,
): Promise<MeResponse> {
  return authFetch<MeResponse>('/api/auth/onboarding', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
