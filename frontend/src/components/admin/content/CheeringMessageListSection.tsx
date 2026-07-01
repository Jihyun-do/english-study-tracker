import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { AdminCheeringMessage } from '../../../types/content'
import { useStudyContent } from '../../../contexts/StudyContentContext'
import { useToast } from '../../../contexts/ToastContext'
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
import { AdminDrawer } from '../AdminDrawer'
import { AdminStatusBadge, cheeringStatusToVariant } from '../AdminStatusBadge'
import { CheeringItemMenu } from './CheeringItemMenu'
import { CheeringMessageForm } from './CheeringMessageForm'
import {
  cheeringToForm,
  createEmptyCheeringForm,
  filterCheeringMessages,
  getCheeringStatusLabel,
} from './contentUtils'
import styles from './CheeringMessageListSection.module.css'

export interface CheeringMessageListSectionHandle {
  openCreate: () => void
}

export const CheeringMessageListSection = forwardRef<CheeringMessageListSectionHandle>(
  function CheeringMessageListSection(_props, ref) {
  const { showToast } = useToast()
  const { cheeringMessages, addCheeringMessage, updateCheeringMessage, setCheeringMessageStatus, deleteCheeringMessage } =
    useStudyContent()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingMessage, setEditingMessage] = useState<AdminCheeringMessage | null>(null)
  const [form, setForm] = useState(createEmptyCheeringForm)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const filteredMessages = useMemo(
    () => filterCheeringMessages(cheeringMessages, search),
    [cheeringMessages, search],
  )

  const openCreateForm = () => {
    setEditingMessage(null)
    setForm(createEmptyCheeringForm())
    setFormOpen(true)
  }

  useImperativeHandle(ref, () => ({ openCreate: openCreateForm }), [])

  const openEditForm = (message: AdminCheeringMessage) => {
    setEditingMessage(message)
    setForm(cheeringToForm(message))
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingMessage(null)
    setForm(createEmptyCheeringForm())
  }

  const handleSubmit = () => {
    if (editingMessage) {
      updateCheeringMessage(editingMessage.id, form)
      showToast('응원 문구를 수정했습니다.')
    } else {
      addCheeringMessage(form)
      showToast('응원 문구를 등록했습니다.')
    }
    closeForm()
  }

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return
    deleteCheeringMessage(deleteTargetId)
    setDeleteTargetId(null)
    showToast('응원 문구를 삭제했습니다.')
  }

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="응원 문구 검색"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <AdminTable fluid>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colMessage} />
            <col className={styles.colStatus} />
            <col className={styles.colDate} />
            <col className={styles.colManage} />
          </colgroup>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>
                <span className={styles.headerText}>문구</span>
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>
                <span className={styles.headerText}>상태</span>
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>
                <span className={styles.headerText}>등록일</span>
              </AdminTableHeaderCell>
              <AdminTableHeaderCell align="center">
                <span className={styles.headerText}>관리</span>
              </AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <AdminTableBody>
            {filteredMessages.length === 0 ? (
              <AdminTableRow disabled>
                <AdminTableCell colSpan={4}>
                  <EmptyState
                    message={
                      search.trim().length === 0 && cheeringMessages.length === 0
                        ? '등록된 응원 문구가 없습니다.'
                        : '조건에 맞는 응원 문구가 없습니다.'
                    }
                    variant="inline"
                  />
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              filteredMessages.map((message) => (
                <AdminTableRow key={message.id}>
                  <AdminTableCell>
                    <div className={styles.clipText}>
                      <span className={styles.messageText} title={message.message}>
                        {message.message}
                      </span>
                    </div>
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminStatusBadge
                      label={getCheeringStatusLabel(message.status)}
                      variant={cheeringStatusToVariant(message.status)}
                    />
                  </AdminTableCell>
                  <AdminTableCell>
                    <span className={styles.dateText}>{message.createdAt}</span>
                  </AdminTableCell>
                  <AdminTableCell align="center">
                    <CheeringItemMenu
                      status={message.status}
                      onEdit={() => openEditForm(message)}
                      onActivate={() => {
                        setCheeringMessageStatus(message.id, 'active')
                        showToast('응원 문구를 사용 상태로 변경했습니다.')
                      }}
                      onDeactivate={() => {
                        setCheeringMessageStatus(message.id, 'inactive')
                        showToast('응원 문구를 비활성 처리했습니다.')
                      }}
                      onDelete={() => setDeleteTargetId(message.id)}
                    />
                  </AdminTableCell>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </table>
      </AdminTable>

      <AdminDrawer
        isOpen={formOpen}
        title={editingMessage ? '응원 문구 수정' : '응원 문구 등록'}
        onClose={closeForm}
      >
        <CheeringMessageForm
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitLabel={editingMessage ? '수정' : '등록'}
        />
      </AdminDrawer>

      <AdminConfirmDialog
        isOpen={deleteTargetId !== null}
        message="정말 삭제하시겠습니까?"
        confirmLabel="삭제"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  )
},
)
