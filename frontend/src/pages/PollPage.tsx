import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useStudyContent } from '../contexts/StudyContentContext'
import { PollStatusTabs, type PollViewTab } from '../components/poll/PollStatusTabs'
import { PollListItem } from '../components/poll/PollListItem'
import { EmptyState } from '../components/ui/EmptyState'
import { getActivePolls, getClosedPolls } from '../lib/poll/userPollUtils'
import styles from './PollPage.module.css'

interface PollPageProps {
  onBack: () => void
  initialTab?: PollViewTab
}

export function PollPage({ onBack, initialTab = 'active' }: PollPageProps) {
  const { polls } = useStudyContent()
  const [tab, setTab] = useState<PollViewTab>(initialTab)

  const activePolls = useMemo(() => getActivePolls(polls), [polls])
  const closedPolls = useMemo(() => getClosedPolls(polls), [polls])
  const visiblePolls = tab === 'active' ? activePolls : closedPolls

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="뒤로">
          <ArrowLeft size={20} />
        </button>
        <h2 className={styles.headerTitle}>투표</h2>
      </header>

      <PollStatusTabs value={tab} onChange={setTab} />

      <div className={styles.list}>
        {visiblePolls.length === 0 ? (
          <EmptyState
            message={
              tab === 'active'
                ? '현재 진행 중인 투표가 없습니다.'
                : '종료된 투표가 없습니다.'
            }
            className={styles.empty}
          />
        ) : (
          visiblePolls.map((poll) => (
            <PollListItem key={poll.id} poll={poll} isActive={tab === 'active'} />
          ))
        )}
      </div>
    </div>
  )
}
