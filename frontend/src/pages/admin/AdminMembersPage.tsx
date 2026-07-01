import { useCallback, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminConfirmDialog } from '../../components/admin/AdminConfirmDialog'
import { useToast } from '../../contexts/ToastContext'
import { EmptyState } from '../../components/ui/EmptyState'
import { AdminMemberDetailDrawer } from '../../components/admin/member/AdminMemberDetailDrawer'
import { AdminMemberMenu } from '../../components/admin/member/AdminMemberMenu'
import { AdminSortableHeaderCell } from '../../components/admin/member/AdminSortableHeaderCell'
import { MemberMonthSelect } from '../../components/admin/member/MemberMonthSelect'
import { MemberStatCell } from '../../components/admin/member/MemberStatCell'
import {
  filterStudyMembers,
  getMemberParticipationRate,
  getMemberSubmissionRate,
  isMemberMonthlyPick,
  removeMemberFromMonthlyPicks,
  sortMembers,
  toggleMemberSort,
  toggleMonthlyBestPick,
  type MemberSortState,
} from '../../components/admin/member/memberUtils'
import { formatMonthLabel, getCurrentMonthKey } from '../../components/admin/submission/submissionUtils'
import {
  AdminTable,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminTableHeaderCell,
} from '../../components/admin/AdminTable'
import {
  mockAdminMemberMonthKeys,
  mockAdminMembers,
  mockAdminMonthlyBestPicks,
  type AdminMemberItem,
} from '../../data/mockAdminData'
import styles from './AdminMembersPage.module.css'

const DEFAULT_MONTH_KEY =
  mockAdminMemberMonthKeys.find((key) => key === getCurrentMonthKey()) ??
  mockAdminMemberMonthKeys[0]

export function AdminMembersPage() {
  const [members, setMembers] = useState(mockAdminMembers)
  const [monthlyPicks, setMonthlyPicks] = useState(mockAdminMonthlyBestPicks)
  const [search, setSearch] = useState('')
  const [monthKey, setMonthKey] = useState<string>(DEFAULT_MONTH_KEY)
  const [sort, setSort] = useState<MemberSortState | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [kickTargetId, setKickTargetId] = useState<string | null>(null)
  const { showToast } = useToast()

  const filteredMembers = useMemo(() => {
    const filtered = filterStudyMembers(members, search)
    return sortMembers(filtered, sort, monthKey)
  }, [members, search, sort, monthKey])

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId],
  )

  const handleSort = useCallback((key: MemberSortState['key']) => {
    setSort((current) => toggleMemberSort(current, key))
  }, [])

  const handleMonthlyPick = useCallback(
    (id: string) => {
      const member = members.find((item) => item.id === id)
      if (!member) return

      const wasPicked = isMemberMonthlyPick(monthlyPicks, monthKey, id)
      setMonthlyPicks((prev) => toggleMonthlyBestPick(prev, monthKey, id))

      const monthLabel = formatMonthLabel(monthKey)
      if (wasPicked) {
        showToast(`${monthLabel} ${member.name}님의 선정을 해제했습니다.`)
      } else {
        showToast(`${monthLabel} BEST 참여자로 ${member.name}님을 선정했습니다.`)
      }
    },
    [members, monthlyPicks, monthKey, showToast],
  )

  const handleConfirmKick = useCallback(() => {
    if (!kickTargetId) return
    const target = members.find((member) => member.id === kickTargetId)
    setMembers((prev) => prev.filter((member) => member.id !== kickTargetId))
    setMonthlyPicks((prev) => removeMemberFromMonthlyPicks(prev, kickTargetId))
    setSelectedMemberId((prev) => (prev === kickTargetId ? null : prev))
    if (target) showToast(`${target.name}님을 추방했습니다.`)
    setKickTargetId(null)
  }, [kickTargetId, members, showToast])

  const renderMemberRow = (member: AdminMemberItem) => {
    const isPicked = isMemberMonthlyPick(monthlyPicks, monthKey, member.id)

    return (
      <AdminTableRow key={member.id}>
        <AdminTableCell>
          <div className={styles.profileCell}>
            <span className={styles.avatar} style={{ backgroundColor: member.avatarColor }}>
              {member.name.charAt(0)}
            </span>
            <div className={styles.nameGroup}>
              <span className={styles.profileName}>{member.name}</span>
              {isPicked && <span className={styles.monthlyPickBadge}>🏅 선정</span>}
            </div>
          </div>
        </AdminTableCell>
        <AdminTableCell align="center">
          <MemberStatCell value={getMemberParticipationRate(member, monthKey)} unit="%" />
        </AdminTableCell>
        <AdminTableCell align="center">
          <MemberStatCell value={member.streakDays} unit="일" />
        </AdminTableCell>
        <AdminTableCell align="center">
          <MemberStatCell value={getMemberSubmissionRate(member, monthKey)} unit="%" />
        </AdminTableCell>
        <AdminTableCell align="center">
          <AdminMemberMenu
            member={member}
            isMonthlyPick={isPicked}
            onMonthlyPick={() => handleMonthlyPick(member.id)}
            onViewInfo={() => setSelectedMemberId(member.id)}
          />
        </AdminTableCell>
      </AdminTableRow>
    )
  }

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="스터디원 관리"
        description="스터디원 활동 현황을 확인하고 이번 달 BEST 참여자를 선정하세요"
      />

      <div className={styles.controls}>
        <MemberMonthSelect
          monthKeys={mockAdminMemberMonthKeys}
          value={monthKey}
          onChange={setMonthKey}
        />

        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="스터디원 검색"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <AdminTable fluid>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colProfile} />
            <col className={styles.colStat} />
            <col className={styles.colStat} />
            <col className={styles.colStat} />
            <col className={styles.colManage} />
          </colgroup>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>프로필</AdminTableHeaderCell>
              <AdminSortableHeaderCell
                label="참여율"
                sortKey="participationRate"
                activeKey={sort?.key ?? null}
                sortDir={sort?.dir ?? 'desc'}
                onSort={handleSort}
              />
              <AdminSortableHeaderCell
                label="연속"
                sortKey="streakDays"
                activeKey={sort?.key ?? null}
                sortDir={sort?.dir ?? 'desc'}
                onSort={handleSort}
              />
              <AdminSortableHeaderCell
                label="제출률"
                sortKey="submissionRate"
                activeKey={sort?.key ?? null}
                sortDir={sort?.dir ?? 'desc'}
                onSort={handleSort}
              />
              <AdminTableHeaderCell align="center">관리</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <AdminTableBody>
            {filteredMembers.length === 0 ? (
              <AdminTableRow disabled>
                <AdminTableCell colSpan={5}>
                  <EmptyState message="조건에 맞는 스터디원이 없습니다." variant="inline" />
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              filteredMembers.map(renderMemberRow)
            )}
          </AdminTableBody>
        </table>
      </AdminTable>

      <AdminMemberDetailDrawer
        member={selectedMember}
        monthKey={monthKey}
        isMonthlyPick={
          selectedMember
            ? isMemberMonthlyPick(monthlyPicks, monthKey, selectedMember.id)
            : false
        }
        onClose={() => setSelectedMemberId(null)}
        onKick={() => {
          if (selectedMember) setKickTargetId(selectedMember.id)
        }}
      />

      <AdminConfirmDialog
        isOpen={kickTargetId !== null}
        message="회원을 추방하시겠습니까?"
        description="추방된 회원은 로그인 및 스터디 참여가 불가능합니다."
        confirmLabel="추방"
        onConfirm={handleConfirmKick}
        onCancel={() => setKickTargetId(null)}
      />
    </div>
  )
}
