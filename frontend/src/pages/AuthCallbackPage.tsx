import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPostLoginPath, useAuth } from '../auth/AuthContext'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { processOAuthCallback } = useAuth()

  useEffect(() => {
    void (async () => {
      const params = new URLSearchParams(window.location.search)
      const result = await processOAuthCallback(params)

      if (result.type === 'success') {
        navigate(getPostLoginPath(result.user.role), { replace: true })
        return
      }

      if (result.type === 'onboarding') {
        navigate('/onboarding/invite-code', { replace: true })
        return
      }

      navigate('/login', { replace: true })
    })()
  }, [processOAuthCallback, navigate])

  return null
}
