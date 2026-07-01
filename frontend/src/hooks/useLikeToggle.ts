import { useCallback, useState } from 'react'

interface LikeState {
  isLiked: boolean
  likeCount: number
}

export function useLikeToggle(initialLiked: boolean, initialCount: number) {
  const [like, setLike] = useState<LikeState>({
    isLiked: initialLiked,
    likeCount: initialCount,
  })

  const toggleLike = useCallback(() => {
    setLike(({ isLiked, likeCount }) => ({
      isLiked: !isLiked,
      likeCount: likeCount + (isLiked ? -1 : 1),
    }))
  }, [])

  return {
    isLiked: like.isLiked,
    likeCount: like.likeCount,
    toggleLike,
  }
}
