import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { AdminNotice, NoticeFilterStatus } from '../../../types/content'
import { useStudyContent } from '../../../contexts/StudyContentContext'
import { useToast } from '../../../contexts/ToastContext'
import { ADMIN_ROUTES } from '../../../router/paths'
import { EmptyState } from '../../ui/EmptyState'
import {
  AdminTable,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminTableHeaderCell,
} from '../AdminTable'
import { AdminConfirmDialog } from '../AdminConfirmDialog'
import {
  AdminStatusBadge,
  noticeStatusToVariant,
} from '../AdminStatusBadge'
import { NoticeItemMenu } from './NoticeItemMenu'
import { NoticePreviewDrawer } from './NoticePreviewDrawer'
import {
  filterNotices,
  getNoticeOperationalStatus,
  getNoticeStatusLabel,
} from './contentUtils'
import styles from './NoticeListSection.module.css'

const STATUS_FILTERS: { key: NoticeFilterStatus; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'published', label: '게시중' },
  { key: 'scheduled', label: '예약' },
  { key: 'hidden', label: '종료' },
]

export function NoticeListSection() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { notices, hideNotice, deleteNotice, setBannerNotice } = useStudyContent()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<NoticeFilterStatus>('all')
  const [previewNotice, setPreviewNotice] = useState<AdminNotice | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const filteredNotices = useMemo(
    () => filterNotices(notices, search, filter),
    [notices, search, filter],
  )

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return
    deleteNotice(deleteTargetId)
    setDeleteTargetId(null)
    showToast('공지를 삭제했습니다.')
  }

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="공지 검색"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {STATUS_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`${styles.filterBtn} ${filter === key ? styles.filterActive : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <AdminTable fluid>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colTitle} />
            <col className={`${styles.colPreview} ${styles.previewCol}`} />
            <col className={styles.colStatus} />
            <col className={styles.colDate} />
            <col className={styles.colBanner} />
            <col className={styles.colManage} />
          </colgroup>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>
                <span className={styles.headerText}>제목</span>
              </AdminTableHeaderCell>
              <AdminTableHeaderCell className={styles.previewCol}>
                <span className={styles.headerText} title="배너 미리보기">
                  미리보기
                </span>
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>
                <span className={styles.headerText}>상태</span>
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>
                <span className={styles.headerText}>게시일</span>
              </AdminTableHeaderCell>
              <AdminTableHeaderCell align="center">
                <span className={styles.headerText} title="홈 배너">
                  배너
                </span>
              </AdminTableHeaderCell>
              <AdminTableHeaderCell align="center">
                <span className={styles.headerText}>관리</span>
              </AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <AdminTableBody>
            {filteredNotices.length === 0 ? (
              <AdminTableRow disabled>
                <AdminTableCell colSpan={6}>
                  <EmptyState
                    message={
                      search.trim().length === 0 && filter === 'all' && notices.length === 0
                        ? '등록된 공지가 없습니다.'
                        : '조건에 맞는 공지가 없습니다.'
                    }
                    variant="inline"
                  />
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              filteredNotices.map((notice) => {
                const status = getNoticeOperationalStatus(notice)
                const canSetBanner = status === 'published'

                return (
                  <AdminTableRow
                    key={notice.id}
                    className={status === 'hidden' ? styles.hiddenRow : undefined}
                  >
                    <AdminTableCell>
                      <div className={styles.clipText}>
                        <button
                          type="button"
                          className={styles.titleBtn}
                          onClick={() => setPreviewNotice(notice)}
                          title={notice.title}
                        >
                          {notice.title}
                        </button>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className={styles.previewCol}>
                      <p className={styles.preview} title={notice.preview}>
                        {notice.preview}
                      </p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStatusBadge
                        label={getNoticeStatusLabel(status)}
                        variant={noticeStatusToVariant(status)}
                      />
                    </AdminTableCell>
                    <AdminTableCell>
                      <span className={styles.dateText}>{notice.publishDate}</span>
                    </AdminTableCell>
                    <AdminTableCell align="center">
                      {notice.isBanner ? (
                        <span className={styles.bannerBadge}>배너</span>
                      ) : (
                        <span className={styles.muted}>—</span>
                      )}
                    </AdminTableCell>
                    <AdminTableCell align="center">
                      <NoticeItemMenu
                        isBanner={notice.isBanner}
                        canSetBanner={canSetBanner}
                        onEdit={() => navigate(ADMIN_ROUTES.contentNoticeEdit(notice.id))}
                        onSetBanner={() => {
                          setBannerNotice(notice.id)
                          showToast('홈 배너 공지로 지정했습니다.')
                        }}
                        onHide={() => {
                          hideNotice(notice.id)
                          showToast('공지를 종료 처리했습니다.')
                        }}
                        onDelete={() => setDeleteTargetId(notice.id)}
                      />
                    </AdminTableCell>
                  </AdminTableRow>
                )
              })
            )}
          </AdminTableBody>
        </table>
      </AdminTable>

      <NoticePreviewDrawer notice={previewNotice} onClose={() => setPreviewNotice(null)} />

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
