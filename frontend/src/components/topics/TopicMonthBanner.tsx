import { PageGuideBanner } from '../ui/PageGuideBanner'
import { getTopicMonthLabel, getVoteDeadlineInfo } from '../../data/mockTopicData'

export function TopicMonthBanner() {
  const monthLabel = getTopicMonthLabel()
  const { formattedDate, daysLeft } = getVoteDeadlineInfo()
  const remainText = daysLeft === 0 ? '오늘 마감' : `마감까지 ${daysLeft}일 남음`

  return (
    <PageGuideBanner
      title={`💡 ${monthLabel}`}
      description="다음 스터디 주제를 제안하고 투표해보세요."
      meta={
        <>
          투표 마감 <strong>{formattedDate}</strong> · {remainText}
        </>
      }
    />
  )
}
