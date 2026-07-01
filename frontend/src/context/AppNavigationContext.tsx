import { createContext, useContext } from 'react'
import type { AppNavigationContextValue } from '../submission/types'

export const AppNavigationContext = createContext<AppNavigationContextValue | null>(null)

export function useAppNavigation() {
  const context = useContext(AppNavigationContext)
  if (!context) {
    throw new Error('useAppNavigation must be used within AppNavigationProvider')
  }
  return context
}
