import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { mockAdminCheeringMessages, mockAdminNotices, mockAdminPolls } from '../data/mockContentData'
import type { AdminCheeringMessage, AdminNotice, AdminPoll } from '../types/content'
import {
  createCheeringFromForm,
  createNoticeFromForm,
  createPollFromForm,
  getNoticeOperationalStatus,
} from '../components/admin/content/contentUtils'
import type { CheeringMessageFormData, CheeringMessageStatus, NoticeFormData, PollFormData } from '../types/content'

interface StudyContentContextValue {
  notices: AdminNotice[]
  polls: AdminPoll[]
  cheeringMessages: AdminCheeringMessage[]
  getNoticeById: (id: string) => AdminNotice | undefined
  getPollById: (id: string) => AdminPoll | undefined
  getCheeringMessageById: (id: string) => AdminCheeringMessage | undefined
  getBannerNotice: () => AdminNotice | undefined
  addNotice: (form: NoticeFormData) => AdminNotice
  updateNotice: (id: string, form: NoticeFormData) => void
  hideNotice: (id: string) => void
  deleteNotice: (id: string) => void
  setBannerNotice: (id: string) => void
  addPoll: (form: PollFormData) => AdminPoll
  updatePoll: (id: string, form: PollFormData) => void
  deletePoll: (id: string) => void
  addCheeringMessage: (form: CheeringMessageFormData) => AdminCheeringMessage
  updateCheeringMessage: (id: string, form: CheeringMessageFormData) => void
  setCheeringMessageStatus: (id: string, status: CheeringMessageStatus) => void
  deleteCheeringMessage: (id: string) => void
}

const StudyContentContext = createContext<StudyContentContextValue | null>(null)

function applyBannerSelection(notices: AdminNotice[], bannerId: string | null): AdminNotice[] {
  return notices.map((notice) => ({
    ...notice,
    isBanner: bannerId !== null && notice.id === bannerId,
  }))
}

export function StudyContentProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<AdminNotice[]>(mockAdminNotices)
  const [polls, setPolls] = useState<AdminPoll[]>(mockAdminPolls)
  const [cheeringMessages, setCheeringMessages] = useState<AdminCheeringMessage[]>(
    mockAdminCheeringMessages,
  )

  const getNoticeById = useCallback(
    (id: string) => notices.find((notice) => notice.id === id),
    [notices],
  )

  const getPollById = useCallback(
    (id: string) => polls.find((poll) => poll.id === id),
    [polls],
  )

  const getCheeringMessageById = useCallback(
    (id: string) => cheeringMessages.find((message) => message.id === id),
    [cheeringMessages],
  )

  const getBannerNotice = useCallback(
    () =>
      notices.find(
        (notice) =>
          notice.isBanner &&
          notice.visibility === 'public' &&
          getNoticeOperationalStatus(notice) === 'published',
      ),
    [notices],
  )

  const addNotice = useCallback((form: NoticeFormData) => {
    const notice = createNoticeFromForm(form)
    setNotices((prev) => {
      const next = [notice, ...prev]
      return form.isBanner ? applyBannerSelection(next, notice.id) : next
    })
    return notice
  }, [])

  const updateNotice = useCallback((id: string, form: NoticeFormData) => {
    setNotices((prev) => {
      const existing = prev.find((notice) => notice.id === id)
      const updated = prev.map((notice) =>
        notice.id === id ? createNoticeFromForm(form, id, existing) : notice,
      )
      return form.isBanner ? applyBannerSelection(updated, id) : updated
    })
  }, [])

  const hideNotice = useCallback((id: string) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.id === id
          ? { ...notice, visibility: 'hidden' as const, isBanner: false }
          : notice,
      ),
    )
  }, [])

  const deleteNotice = useCallback((id: string) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id))
  }, [])

  const setBannerNotice = useCallback((id: string) => {
    setNotices((prev) => applyBannerSelection(prev, id))
  }, [])

  const addPoll = useCallback((form: PollFormData) => {
    const poll = createPollFromForm(form)
    setPolls((prev) => [poll, ...prev])
    return poll
  }, [])

  const updatePoll = useCallback((id: string, form: PollFormData) => {
    setPolls((prev) =>
      prev.map((poll) =>
        poll.id === id ? createPollFromForm(form, id, poll) : poll,
      ),
    )
  }, [])

  const deletePoll = useCallback((id: string) => {
    setPolls((prev) => prev.filter((poll) => poll.id !== id))
  }, [])

  const addCheeringMessage = useCallback((form: CheeringMessageFormData) => {
    const message = createCheeringFromForm(form)
    setCheeringMessages((prev) => [message, ...prev])
    return message
  }, [])

  const updateCheeringMessage = useCallback((id: string, form: CheeringMessageFormData) => {
    setCheeringMessages((prev) =>
      prev.map((message) =>
        message.id === id
          ? createCheeringFromForm(form, id, message)
          : message,
      ),
    )
  }, [])

  const setCheeringMessageStatus = useCallback((id: string, status: CheeringMessageStatus) => {
    setCheeringMessages((prev) =>
      prev.map((message) => (message.id === id ? { ...message, status } : message)),
    )
  }, [])

  const deleteCheeringMessage = useCallback((id: string) => {
    setCheeringMessages((prev) => prev.filter((message) => message.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      notices,
      polls,
      cheeringMessages,
      getNoticeById,
      getPollById,
      getCheeringMessageById,
      getBannerNotice,
      addNotice,
      updateNotice,
      hideNotice,
      deleteNotice,
      setBannerNotice,
      addPoll,
      updatePoll,
      deletePoll,
      addCheeringMessage,
      updateCheeringMessage,
      setCheeringMessageStatus,
      deleteCheeringMessage,
    }),
    [
      notices,
      polls,
      cheeringMessages,
      getNoticeById,
      getPollById,
      getCheeringMessageById,
      getBannerNotice,
      addNotice,
      updateNotice,
      hideNotice,
      deleteNotice,
      setBannerNotice,
      addPoll,
      updatePoll,
      deletePoll,
      addCheeringMessage,
      updateCheeringMessage,
      setCheeringMessageStatus,
      deleteCheeringMessage,
    ],
  )

  return (
    <StudyContentContext.Provider value={value}>{children}</StudyContentContext.Provider>
  )
}

export function useStudyContent() {
  const context = useContext(StudyContentContext)
  if (!context) {
    throw new Error('useStudyContent must be used within StudyContentProvider')
  }
  return context
}
