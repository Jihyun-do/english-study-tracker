import type { ReactNode } from 'react'
import { LoadingSkeleton } from './LoadingSkeleton'
import { LoadingSpinner } from './LoadingSpinner'

type LoadingGateFallback = 'spinner' | 'skeleton'

interface LoadingGateProps {
  isLoading: boolean
  fallback?: LoadingGateFallback
  skeletonVariant?: 'text' | 'textShort' | 'card' | 'table-row'
  skeletonCount?: number
  label?: string
  children: ReactNode
}

export function LoadingGate({
  isLoading,
  fallback = 'spinner',
  skeletonVariant = 'card',
  skeletonCount = 3,
  label,
  children,
}: LoadingGateProps) {
  if (!isLoading) return children

  if (fallback === 'skeleton') {
    return <LoadingSkeleton variant={skeletonVariant} count={skeletonCount} />
  }

  return <LoadingSpinner centered label={label} />
}
