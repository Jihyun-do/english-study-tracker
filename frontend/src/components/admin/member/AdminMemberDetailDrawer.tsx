import type { AdminMemberItem } from '../../../data/mockAdminData'
import { AdminButton } from '../AdminButton'
import { AdminDrawer } from '../AdminDrawer'
import {
  getMemberMonthlyStats,
  getMemberParticipationRate,
  getMemberSubmissionRate,
} from './memberUtils'
import { formatMonthLabel } from '../submission/submissionUtils'
import styles from './AdminMemberDetailDrawer.module.css'

interface AdminMemberDetailDrawerProps {
  member: AdminMemberItem | null
  monthKey: string
  isMonthlyPick: boolean
  onClose: () => void
  onKick: () => void
}

export function AdminMemberDetailDrawer({
  member,
  monthKey,
  isMonthlyPick,
  onClose,
  onKick,
}: AdminMemberDetailDrawerProps) {
  const monthLabel = member ? formatMonthLabel(monthKey) : ''
  const monthlyStats = member ? getMemberMonthlyStats(member, monthKey) : null

  return (
    <AdminDrawer isOpen={member !== null} title="회원 정보" onClose={onClose}>
      {member && (
        <div className={styles.content}>
          <div className={styles.profileCard}>
            <span className={styles.avatar} style={{ backgroundColor: member.avatarColor }}>
              {member.name.charAt(0)}
            </span>
            <div className={styles.nameRow}>
              <h3 className={styles.name}>{member.name}</h3>
              {isMonthlyPick && (
                <span className={styles.monthlyPickBadge}>🏅 {monthLabel} BEST</span>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>기본 정보</p>
            <dl className={styles.infoList}>
              <div className={styles.infoRow}>
                <dt>Google 이메일</dt>
                <dd>{member.email}</dd>
              </div>
              <div className={styles.infoRow}>
                <dt>가입일</dt>
                <dd>{member.joinedAt}</dd>
              </div>
              <div className={styles.infoRow}>
                <dt>마지막 로그인</dt>
                <dd>{member.lastLoginAt}</dd>
              </div>
              <div className={styles.infoRow}>
                <dt>마지막 과제 제출일</dt>
                <dd>{member.lastSubmissionAt}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>활동 정보</p>
            <p className={styles.monthHint}>{monthLabel} 기준</p>
            <div className={styles.statGrid}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>참여율</span>
                <span className={styles.statValue}>
                  {getMemberParticipationRate(member, monthKey)}%
                </span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>제출률</span>
                <span className={styles.statValue}>
                  {getMemberSubmissionRate(member, monthKey)}%
                </span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>연속 인증</span>
                <span className={styles.statValue}>{member.streakDays}일</span>
              </div>
            </div>
            {monthlyStats && (
              <p className={styles.activitySummary}>
                과제 {monthlyStats.assignmentCount}일 중 {monthlyStats.participatedCount}일 참여
                · 제출 {monthlyStats.submissionTargetCount}건 중 {monthlyStats.submittedCount}건
                완료
              </p>
            )}
          </div>

          <div className={styles.dangerSection}>
            <AdminButton variant="danger" className={styles.kickBtn} onClick={onKick}>
              추방
            </AdminButton>
          </div>
        </div>
      )}
    </AdminDrawer>
  )
}
