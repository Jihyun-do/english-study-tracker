import { useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminButton } from '../../components/admin/AdminButton'
import { ContentSegmentTabs, type ContentTab } from '../../components/admin/content/ContentSegmentTabs'
import { NoticeListSection } from '../../components/admin/content/NoticeListSection'
import { PollListSection } from '../../components/admin/content/PollListSection'
import { CheeringMessageListSection, type CheeringMessageListSectionHandle } from '../../components/admin/content/CheeringMessageListSection'
import { parseContentTab, parsePollListFilter } from '../../components/admin/content/contentUtils'
import { ADMIN_ROUTES } from '../../router/paths'
import styles from './AdminContentPage.module.css'

export function AdminContentPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = parseContentTab(searchParams.get('tab'))
  const pollListFilter = parsePollListFilter(searchParams.get('filter'))
  const cheeringSectionRef = useRef<CheeringMessageListSectionHandle>(null)

  const handleTabChange = useCallback(
    (nextTab: ContentTab) => {
      setSearchParams(nextTab === 'notices' ? {} : { tab: nextTab })
    },
    [setSearchParams],
  )

  const handleAction = () => {
    if (tab === 'polls') {
      navigate(ADMIN_ROUTES.contentPollNew)
      return
    }
    if (tab === 'cheering') {
      cheeringSectionRef.current?.openCreate()
      return
    }
    navigate(ADMIN_ROUTES.contentNoticeNew)
  }

  const actionLabel =
    tab === 'polls' ? '➕ 투표 등록' : tab === 'cheering' ? '➕ 문구 등록' : '➕ 공지 작성'

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="콘텐츠 관리"
        description="공지, 투표, 응원 문구를 등록하고 관리하세요"
        action={<AdminButton onClick={handleAction}>{actionLabel}</AdminButton>}
      />

      <ContentSegmentTabs value={tab} onChange={handleTabChange} />

      {tab === 'notices' && <NoticeListSection />}
      {tab === 'polls' && <PollListSection listFilter={pollListFilter} />}
      {tab === 'cheering' && <CheeringMessageListSection ref={cheeringSectionRef} />}
    </div>
  )
}
