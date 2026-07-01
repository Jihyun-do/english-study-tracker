import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { AdminPoll, PollOperationalStatus } from '../../../types/content'
import { useStudyContent } from '../../../contexts/StudyContentContext'
import { useToast } from '../../../contexts/ToastContext'
import { ADMIN_ROUTES } from '../../../router/paths'
import { AdminConfirmDialog } from '../AdminConfirmDialog'
import {
  AdminStatusBadge,
  pollStatusToVariant,
} from '../AdminStatusBadge'
import { Card } from '../../ui/Card'
import { EmptyState } from '../../ui/EmptyState'
import { SubmissionCollapseTrigger } from '../submission/SubmissionCollapseTrigger'
import { PollItemMenu } from './PollItemMenu'
import { PollResultDrawer } from './PollResultDrawer'
import {
  filterPolls,
  filterPollsByListFilter,
  getPollOperationalStatus,
  getPollParticipationRate,
  getPollStatusLabel,
  splitPollsByStatus,
  type PollListFilter,
} from './contentUtils'
import styles from './PollListSection.module.css'

const POLL_GROUPS: { key: PollOperationalStatus; title: string }[] = [
  { key: 'active', title: '진행중 투표' },
  { key: 'scheduled', title: '예약 투표' },
  { key: 'closed', title: '마감 투표' },
]

interface PollListSectionProps {
  listFilter?: PollListFilter
}

function PollGroupList({
  title,
  polls,
  onViewResults,
  onEdit,
  onDelete,
}: {
  title: string
  polls: AdminPoll[]
  onViewResults: (poll: AdminPoll) => void
  onEdit: (poll: AdminPoll) => void
  onDelete: (id: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(() => polls.length > 0)

  useEffect(() => {
    setIsExpanded(polls.length > 0)
  }, [polls.length])

  if (polls.length === 0) return null

  return (
    <section className={styles.section}>
      <Card className={styles.panel} padding="sm">
        <SubmissionCollapseTrigger
          level="section"
          label={`${title} (${polls.length})`}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((prev) => !prev)}
        />

        {isExpanded && (
          <ul className={styles.list}>
            {polls.map((poll) => {
              const status = getPollOperationalStatus(poll)
              const participationRate = getPollParticipationRate(poll)

              return (
                <li key={poll.id}>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardHeaderMain}>
                        <AdminStatusBadge
                          label={getPollStatusLabel(status)}
                          variant={pollStatusToVariant(status)}
                        />
                        <h3 className={styles.cardTitle}>{poll.title}</h3>
                      </div>
                      <PollItemMenu
                        onViewResults={() => onViewResults(poll)}
                        onEdit={() => onEdit(poll)}
                        onDelete={() => onDelete(poll.id)}
                      />
                    </div>
                    <p className={styles.cardMeta}>
                      {poll.startDate} ~ {poll.endDate} · 선택지 {poll.options.length}개 · 참여{' '}
                      {poll.participantCount}/{poll.totalMembers}명 ({participationRate}%)
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </section>
  )
}

export function PollListSection({ listFilter = 'all' }: PollListSectionProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { polls, deletePoll } = useStudyContent()
  const [search, setSearch] = useState('')
  const [resultPoll, setResultPoll] = useState<AdminPoll | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const filteredPolls = useMemo(() => {
    const bySearch = filterPolls(polls, search)
    return filterPollsByListFilter(bySearch, listFilter)
  }, [polls, search, listFilter])
  const grouped = useMemo(() => splitPollsByStatus(filteredPolls), [filteredPolls])

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return
    deletePoll(deleteTargetId)
    setDeleteTargetId(null)
    showToast('투표를 삭제했습니다.')
  }

  const hasPolls = filteredPolls.length > 0

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="투표 검색"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {!hasPolls ? (
        <EmptyState
          message={
            listFilter === 'ending_today'
              ? '오늘 종료되는 투표가 없습니다.'
              : search.trim().length === 0 && polls.length === 0
                ? '등록된 투표가 없습니다.'
                : '조건에 맞는 투표가 없습니다.'
          }
          variant="inline"
        />
      ) : (
        <div className={styles.sections}>
          {POLL_GROUPS.map(({ key, title }) => (
            <PollGroupList
              key={key}
              title={title}
              polls={grouped[key]}
              onViewResults={setResultPoll}
              onEdit={(poll) => navigate(ADMIN_ROUTES.contentPollEdit(poll.id))}
              onDelete={setDeleteTargetId}
            />
          ))}
        </div>
      )}

      <PollResultDrawer poll={resultPoll} onClose={() => setResultPoll(null)} />

      <AdminConfirmDialog
        isOpen={deleteTargetId !== null}
        message="정말 삭제하시겠습니까?"
        confirmLabel="삭제"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  )
}
