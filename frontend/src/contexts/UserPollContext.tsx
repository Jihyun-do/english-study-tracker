import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type UserPollVotes = Record<string, string[]>

interface UserPollContextValue {
  hasVoted: (pollId: string) => boolean
  getUserVote: (pollId: string) => string[]
  submitVote: (pollId: string, optionIds: string[]) => void
}

const UserPollContext = createContext<UserPollContextValue | null>(null)

export function UserPollProvider({ children }: { children: ReactNode }) {
  const [votes, setVotes] = useState<UserPollVotes>({})

  const hasVoted = useCallback((pollId: string) => pollId in votes, [votes])

  const getUserVote = useCallback((pollId: string) => votes[pollId] ?? [], [votes])

  const submitVote = useCallback((pollId: string, optionIds: string[]) => {
    if (optionIds.length === 0) return
    setVotes((prev) => ({ ...prev, [pollId]: optionIds }))
  }, [])

  const value = useMemo(
    () => ({ hasVoted, getUserVote, submitVote }),
    [hasVoted, getUserVote, submitVote],
  )

  return <UserPollContext.Provider value={value}>{children}</UserPollContext.Provider>
}

export function useUserPoll() {
  const context = useContext(UserPollContext)
  if (!context) {
    throw new Error('useUserPoll must be used within UserPollProvider')
  }
  return context
}
