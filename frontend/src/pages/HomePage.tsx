import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppNavigation } from '../context/AppNavigationContext'
import { useStudyContent } from '../contexts/StudyContentContext'
import { NoticeBanner } from '../components/home/NoticeBanner'
import { TodayAssignment } from '../components/home/TodayAssignment'
import { ActivePollCard } from '../components/home/ActivePollCard'
import { SubmitButton } from '../components/home/SubmitButton'
import { MyRecordLink } from '../components/home/MyRecordLink'
import { RecentCertifications } from '../components/home/RecentCertifications'
import { PopularTopicsSection } from '../components/home/PopularTopicsSection'
import { NoticeDetailPage } from './NoticeDetailPage'
import { mockHomeData } from '../data/mockHomeData'
import { getHomeFeaturedPoll } from '../lib/poll/userPollUtils'
import { POLLS_ROUTE } from '../router/paths'
import styles from './HomePage.module.css'

export function HomePage() {
  const navigate = useNavigate()
  const { openMaterialDetail, openSubmitAssignment, navigateToMyPage, navigateToFeed, openTopicDetail } =
    useAppNavigation()
  const { polls } = useStudyContent()
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null)

  const { assignment } = mockHomeData
  const featuredPoll = useMemo(() => getHomeFeaturedPoll(polls), [polls])

  if (selectedNoticeId) {
    return (
      <NoticeDetailPage
        noticeId={selectedNoticeId}
        onBack={() => setSelectedNoticeId(null)}
      />
    )
  }

  return (
    <div className={styles.page}>
      <NoticeBanner onClick={setSelectedNoticeId} />
      <TodayAssignment
        sectionTitle={assignment.sectionTitle}
        assignmentTitle={assignment.title}
        onDetailClick={() => openMaterialDetail(assignment.materialId)}
      />
      <MyRecordLink onClick={navigateToMyPage} />
      {featuredPoll && (
        <ActivePollCard poll={featuredPoll} onVoteClick={() => navigate(POLLS_ROUTE)} />
      )}
      <RecentCertifications onCertClick={navigateToFeed} />
      <PopularTopicsSection onTopicClick={openTopicDetail} />
      <SubmitButton
        onClick={() =>
          openSubmitAssignment({
            assignmentId: assignment.materialId,
            returnTab: 'home',
          })
        }
      />
    </div>
  )
}
