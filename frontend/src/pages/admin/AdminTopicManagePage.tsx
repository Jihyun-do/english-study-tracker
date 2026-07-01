import { useCallback, useMemo, useState } from 'react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminConfirmDialog } from '../../components/admin/AdminConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { useToast } from '../../contexts/ToastContext'
import { MemberMonthSelect } from '../../components/admin/member/MemberMonthSelect'
import { AdminTopicDetailDrawer } from '../../components/admin/topic/AdminTopicDetailDrawer'
import { TopicMonthGroupSection } from '../../components/admin/topic/TopicMonthGroup'
import {
  filterTopicsByMonth,
  getTopicMonthKeys,
} from '../../components/admin/topic/topicUtils'
import { getCurrentMonthKey, formatMonthLabel } from '../../components/admin/submission/submissionUtils'
import type { AdminTopicItem } from '../../data/mockAdminData'
import { mockAdminTopics } from '../../data/mockAdminData'
import styles from './AdminTopicManagePage.module.css'

function getDefaultTopicMonthKey(topics: AdminTopicItem[]): string {
  const monthKeys = getTopicMonthKeys(topics)
  return monthKeys.find((key) => key === getCurrentMonthKey()) ?? monthKeys[0]
}

export function AdminTopicManagePage() {
  const [topics, setTopics] = useState(mockAdminTopics)
  const { showToast } = useToast()
  const [monthKey, setMonthKey] = useState(() => getDefaultTopicMonthKey(mockAdminTopics))
  const [selectedTopic, setSelectedTopic] = useState<AdminTopicItem | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const monthKeys = useMemo(() => getTopicMonthKeys(topics), [topics])

  const monthTopics = useMemo(
    () => filterTopicsByMonth(topics, monthKey),
    [topics, monthKey],
  )

  const selectedFromState = useMemo(() => {
    if (!selectedTopic) return null
    return topics.find((topic) => topic.id === selectedTopic.id) ?? null
  }, [topics, selectedTopic])

  const handleHide = useCallback(
    (id: string) => {
      setTopics((prev) =>
        prev.map((topic) =>
          topic.id === id && topic.visibility === 'public'
            ? { ...topic, visibility: 'hidden' as const }
            : topic,
        ),
      )
      showToast('주제 제안을 숨김 처리했습니다.')
    },
    [showToast],
  )

  const handleToggleAdopt = useCallback(
    (id: string) => {
      setTopics((prev) => {
        const target = prev.find((topic) => topic.id === id)
        const nextAdopted = target ? !target.isAdopted : false
        showToast(nextAdopted ? '주제를 채택했습니다.' : '주제 채택을 해제했습니다.')
        return prev.map((topic) =>
          topic.id === id ? { ...topic, isAdopted: !topic.isAdopted } : topic,
        )
      })
    },
    [showToast],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTargetId) return
    setTopics((prev) => prev.filter((topic) => topic.id !== deleteTargetId))
    setSelectedTopic((prev) => (prev?.id === deleteTargetId ? null : prev))
    setDeleteTargetId(null)
    showToast('주제 제안을 삭제했습니다.')
  }, [deleteTargetId, showToast])

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="주제 관리"
        description="스터디원이 제안한 주제를 검토하고 과제 제작에 사용할 주제를 채택하세요"
      />

      <div className={styles.controls}>
        <MemberMonthSelect
          label="주제 기준"
          monthKeys={monthKeys}
          value={monthKey}
          onChange={setMonthKey}
        />
      </div>

      <h2 className={styles.monthTitle}>{formatMonthLabel(monthKey)}</h2>

      {monthTopics.length === 0 ? (
        <EmptyState message="해당 월에 등록된 주제 제안이 없습니다." variant="boxed" />
      ) : (
        <TopicMonthGroupSection
          topics={monthTopics}
          onSelect={setSelectedTopic}
          onHide={handleHide}
          onDelete={setDeleteTargetId}
        />
      )}

      <AdminTopicDetailDrawer
        topic={selectedFromState}
        onClose={() => setSelectedTopic(null)}
        onToggleAdopt={handleToggleAdopt}
      />

      <AdminConfirmDialog
        isOpen={deleteTargetId !== null}
        message="정말 삭제하시겠습니까?"
        confirmLabel="삭제"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
