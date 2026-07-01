import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminConfirmDialog } from '../../components/admin/AdminConfirmDialog'
import { AdminItemMenu } from '../../components/admin/AdminItemMenu'
import { MemberMonthSelect } from '../../components/admin/member/MemberMonthSelect'
import {
  filterFeedItems,
  getDefaultFeedMonthKey,
  getFeedMonthKeys,
} from '../../components/admin/feed/feedUtils'
import {
  AdminTable,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminTableHeaderCell,
} from '../../components/admin/AdminTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { useToast } from '../../contexts/ToastContext'
import { mockAdminFeedItems } from '../../data/mockAdminData'
import styles from './AdminFeedManagePage.module.css'

export function AdminFeedManagePage() {
  const [items, setItems] = useState(mockAdminFeedItems)
  const { showToast } = useToast()
  const [monthKey, setMonthKey] = useState(() => getDefaultFeedMonthKey(mockAdminFeedItems))
  const [search, setSearch] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const monthKeys = useMemo(() => getFeedMonthKeys(items), [items])

  const filteredItems = useMemo(
    () => filterFeedItems(items, search, monthKey),
    [items, search, monthKey],
  )

  useEffect(() => {
    setSearch('')
  }, [monthKey])

  const handleHide = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id && item.visibility === 'public'
            ? { ...item, visibility: 'hidden' as const }
            : item,
        ),
      )
      showToast('인증글을 숨김 처리했습니다.')
    },
    [showToast],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTargetId) return
    setItems((prev) => prev.filter((item) => item.id !== deleteTargetId))
    setDeleteTargetId(null)
    showToast('인증글을 삭제했습니다.')
  }, [deleteTargetId, showToast])

  const emptyMessage =
    search.trim().length > 0
      ? '조건에 맞는 인증글이 없습니다.'
      : '해당 월에 등록된 인증글이 없습니다.'

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="인증 피드 관리"
        description="인증글을 검색하고 콘텐츠를 관리하세요"
      />

      <div className={styles.controls}>
        <MemberMonthSelect
          label="인증 기준"
          monthKeys={monthKeys}
          value={monthKey}
          onChange={setMonthKey}
        />

        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="회원 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <AdminTable fluid>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colAuthor} />
            <col className={styles.colMemo} />
            <col className={styles.colDate} />
            <col className={styles.colManage} />
          </colgroup>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>작성자</AdminTableHeaderCell>
              <AdminTableHeaderCell>내용</AdminTableHeaderCell>
              <AdminTableHeaderCell>작성일</AdminTableHeaderCell>
              <AdminTableHeaderCell align="center">관리</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <AdminTableBody>
            {filteredItems.length === 0 ? (
              <AdminTableRow disabled>
                <AdminTableCell colSpan={4}>
                  <EmptyState message={emptyMessage} variant="inline" />
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              filteredItems.map((item) => (
                <AdminTableRow
                  key={item.id}
                  className={item.visibility === 'hidden' ? styles.hiddenRow : undefined}
                >
                  <AdminTableCell>
                    <div className={styles.authorCell}>
                      <span
                        className={styles.avatar}
                        style={{ backgroundColor: item.avatarColor }}
                      >
                        {item.authorName.charAt(0)}
                      </span>
                      <span className={styles.authorName}>{item.authorName}</span>
                      {item.visibility === 'hidden' && (
                        <span className={styles.hiddenBadge}>숨김</span>
                      )}
                    </div>
                  </AdminTableCell>
                  <AdminTableCell>
                    <p className={styles.memo}>{item.memo}</p>
                  </AdminTableCell>
                  <AdminTableCell>
                    <span className={styles.createdAt}>{item.createdAt}</span>
                  </AdminTableCell>
                  <AdminTableCell align="center">
                    <AdminItemMenu
                      visibility={item.visibility}
                      onHide={() => handleHide(item.id)}
                      onDelete={() => setDeleteTargetId(item.id)}
                      ariaLabel="인증글 관리 메뉴"
                    />
                  </AdminTableCell>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </table>
      </AdminTable>

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
