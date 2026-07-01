import { useCallback, useState } from 'react'

export function useLoading(initial = false) {
  const [isLoading, setIsLoading] = useState(initial)

  const startLoading = useCallback(() => setIsLoading(true), [])
  const stopLoading = useCallback(() => setIsLoading(false), [])

  return {
    isLoading,
    setIsLoading,
    startLoading,
    stopLoading,
  }
}
