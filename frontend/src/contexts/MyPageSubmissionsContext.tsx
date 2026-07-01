import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { DayRecord, MyPageData } from '../data/mockMyPageData'
import { mockMyPageData } from '../data/mockMyPageData'
import type { SubmissionUpdatePayload } from '../submission/submissionUtils'
import {
  formatSubmittedTime,
  MOCK_NOW,
  resolveImageThemeFromFile,
} from '../submission/submissionUtils'

interface MyPageSubmissionsContextValue {
  myPageData: MyPageData
  getDayRecord: (day: number) => DayRecord | null
  updateSubmission: (day: number, payload: SubmissionUpdatePayload) => void
  deleteSubmission: (day: number) => void
}

const MyPageSubmissionsContext = createContext<MyPageSubmissionsContextValue | null>(null)

function cloneDailyRecords(records: Record<number, DayRecord>): Record<number, DayRecord> {
  return Object.fromEntries(
    Object.entries(records).map(([day, record]) => [Number(day), { ...record }]),
  )
}

export function MyPageSubmissionsProvider({ children }: { children: ReactNode }) {
  const [dailyRecords, setDailyRecords] = useState<Record<number, DayRecord>>(() =>
    cloneDailyRecords(mockMyPageData.dailyRecords),
  )
  const [completedDates, setCompletedDates] = useState<number[]>(() => [
    ...mockMyPageData.completedDates,
  ])
  const [totalSubmissions, setTotalSubmissions] = useState(mockMyPageData.totalSubmissions)

  const myPageData = useMemo<MyPageData>(
    () => ({
      ...mockMyPageData,
      completedDates,
      totalSubmissions,
      dailyRecords,
    }),
    [completedDates, totalSubmissions, dailyRecords],
  )

  const getDayRecord = useCallback(
    (day: number) => dailyRecords[day] ?? null,
    [dailyRecords],
  )

  const updateSubmission = useCallback((day: number, payload: SubmissionUpdatePayload) => {
    setDailyRecords((prev) => {
      const current = prev[day]
      if (!current?.isSubmitted || !current.submissionId) return prev

      const imageTheme = payload.imageFile
        ? resolveImageThemeFromFile(payload.imageFile)
        : payload.imageTheme

      const audioFileName = payload.audioFile
        ? payload.audioFile.name
        : payload.audioFileName

      const audioDuration =
        audioFileName != null
          ? payload.audioDuration ?? current.submissionAudioDuration
          : undefined

      const submittedAt = MOCK_NOW.toISOString()

      return {
        ...prev,
        [day]: {
          ...current,
          memo: payload.memo,
          submissionImageTheme: imageTheme ?? undefined,
          submissionAudioFileName: audioFileName ?? undefined,
          submissionAudioDuration: audioDuration,
          submittedAt,
          submittedTime: formatSubmittedTime(submittedAt),
        },
      }
    })
  }, [])

  const deleteSubmission = useCallback((day: number) => {
    setDailyRecords((prev) => {
      const next = { ...prev }
      delete next[day]
      return next
    })
    setCompletedDates((prev) => prev.filter((d) => d !== day))
    setTotalSubmissions((prev) => Math.max(0, prev - 1))
  }, [])

  const value = useMemo(
    () => ({
      myPageData,
      getDayRecord,
      updateSubmission,
      deleteSubmission,
    }),
    [myPageData, getDayRecord, updateSubmission, deleteSubmission],
  )

  return (
    <MyPageSubmissionsContext.Provider value={value}>{children}</MyPageSubmissionsContext.Provider>
  )
}

export function useMyPageSubmissions() {
  const context = useContext(MyPageSubmissionsContext)
  if (!context) {
    throw new Error('useMyPageSubmissions must be used within MyPageSubmissionsProvider')
  }
  return context
}
